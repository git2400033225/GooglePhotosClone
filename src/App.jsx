import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PhotoGrid from "./components/PhotoGrid";
import PhotoModal from "./components/PhotoModal";
import CameraModal from "./components/CameraModal";
import { loadModels, clusterFaces } from "./utils/faceDetection";
import "./App.css";

function App() {
  const [photos, setPhotos] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [trash, setTrash] = useState([]);
  const [albums, setAlbums] = useState({});
  const [activeTab, setActiveTab] = useState("All");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  // Upload photos or videos
  const handleUpload = (files) => {
    const newPhotos = Array.from(files).map((file) => ({
      id: file.name + file.size,
      url: URL.createObjectURL(file),
      name: file.name,
      date: new Date().toISOString(),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setPhotos((prev) => {
      const filtered = newPhotos.filter(
        (newPhoto) => !prev.some((p) => p.id === newPhoto.id)
      );
      return [...filtered, ...prev];
    });
  };

  // Capture photo from camera
  const capturePhoto = (imageUrl) => {
    const newPhoto = {
      id: Date.now(),
      url: imageUrl,
      name: "Camera Photo",
      date: new Date().toISOString(),
      type: "image",
    };

    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const toggleFavorite = (photo) => {
    setFavorites((prev) =>
      prev.some((p) => p.id === photo.id)
        ? prev.filter((p) => p.id !== photo.id)
        : [...prev, photo]
    );
  };

  const moveToTrash = (photo) => {
    setTrash((prev) => {
      if (prev.some((p) => p.id === photo.id)) return prev;
      return [...prev, photo];
    });

    setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
    setFavorites((prev) => prev.filter((p) => p.id !== photo.id));

    setAlbums((prevAlbums) => {
      const updated = { ...prevAlbums };
      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((p) => p.id !== photo.id);
      });
      return updated;
    });
  };

  const deletePermanently = (photo) => {
    setTrash((prev) => prev.filter((p) => p.id !== photo.id));
  };

  const deleteAlbum = (albumName) => {
    setAlbums((prev) => {
      const updated = { ...prev };
      delete updated[albumName];
      return updated;
    });

    if (activeTab === albumName) {
      setActiveTab("All");
    }
  };

  const handleScanFaces = async () => {
    if (!photos.length) {
      alert("Upload photos first!");
      return;
    }

    alert("🔍 Scanning started... Click OK and wait a few seconds.");

    try {
      setScanning(true);

      await loadModels();
      const clusters = await clusterFaces(photos);

      if (!clusters.length) {
        alert("No faces detected.");
        return;
      }

      const albumObj = {};

      clusters.forEach((cluster) => {
        const uniquePhotos = cluster.photos.filter(
          (photo, index, self) =>
            index === self.findIndex((p) => p.id === photo.id)
        );

        albumObj[cluster.name] = uniquePhotos;
      });

      setAlbums(albumObj);
      setActiveTab(Object.keys(albumObj)[0]);

      alert("✅ Face scanning completed successfully!");
    } catch (error) {
      console.error("Face scan error:", error);
      alert("Face scanning failed.");
    } finally {
      setScanning(false);
    }
  };

  const renameAlbum = (oldName, newName) => {
    if (!newName.trim()) return;

    setAlbums((prev) => {
      const updated = { ...prev };
      updated[newName] = updated[oldName];
      delete updated[oldName];
      return updated;
    });

    setActiveTab(newName);
  };

  const getPhotosToDisplay = () => {
    let list = photos;

    if (activeTab === "Favorites") list = favorites;
    else if (activeTab === "Trash") list = trash;
    else if (albums[activeTab]) list = albums[activeTab];

    if (search) {
      list = list.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (dateFilter) {
      list = list.filter(
        (p) =>
          new Date(p.date).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    return list;
  };

  const groupedByDate = getPhotosToDisplay().reduce((acc, photo) => {
    const key = new Date(photo.date).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(photo);
    return acc;
  }, {});

  return (
    <div className="app">
      <Header
        onUpload={handleUpload}
        setSearch={setSearch}
        setSelectedDate={setDateFilter}
        scanFaces={handleScanFaces}
        scanning={scanning}
        openCamera={() => setShowCamera(true)}
      />

      <div className="main-layout">
        <Sidebar
          active={activeTab}
          setActive={setActiveTab}
          albums={albums}
          renameAlbum={renameAlbum}
          deleteAlbum={deleteAlbum}
        />

        <div className="photo-container">
          {Object.keys(groupedByDate).length === 0 && (
            <p style={{ color: "gray" }}>No photos found.</p>
          )}

          {Object.keys(groupedByDate).map((date) => (
            <div key={date}>
              <h2>
                {new Date(date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </h2>

              <PhotoGrid
                photos={groupedByDate[date]}
                onSelect={setSelectedPhoto}
                onFavorite={toggleFavorite}
                onTrash={moveToTrash}
                onDeletePermanent={deletePermanently}
                favorites={favorites}
                activeTab={activeTab}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}

      {showCamera && (
        <CameraModal
          onClose={() => setShowCamera(false)}
          onCapture={capturePhoto}
        />
      )}

      {scanning && (
        <div className="scan-overlay">
          <div className="scan-box">
            <h2>🔍 Scanning Faces...</h2>
            <p>Please wait a few seconds</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
