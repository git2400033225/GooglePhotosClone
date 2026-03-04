import { useRef } from "react";

const Header = ({
  onUpload,
  setSearch,
  setSelectedDate,
  scanFaces,
  scanning,
  openCamera
}) => {
  const fileRef = useRef();

  return (
    <div className="header">
      <div className="logo">PIXORA</div>

      <div className="search-section">
        <input
          type="text"
          placeholder="Search photos..."
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="actions-section">

        <button onClick={() => fileRef.current.click()}>
          Upload
        </button>

        <button onClick={openCamera}>
          📷 Camera
        </button>

        <button onClick={scanFaces} disabled={scanning}>
          {scanning ? "Scanning..." : "Scan Faces"}
        </button>

      </div>

      <input
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        ref={fileRef}
        onChange={(e) => onUpload(e.target.files)}
      />

    </div>
  );
};

export default Header;