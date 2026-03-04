const PhotoGrid = ({
  photos,
  onSelect,
  onFavorite,
  onTrash,
  favorites,
  activeTab,
  onDeletePermanent,
}) => {
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <div key={photo.id} className="photo-card">

          {photo.type === "video" ? (
            <video
              src={photo.url}
              controls
              onClick={() => onSelect(photo)}
              style={{ width: "100%", borderRadius: "14px" }}
            />
          ) : (
            <img
              src={photo.url}
              alt={photo.name}
              onClick={() => onSelect(photo)}
            />
          )}

          <div className="photo-actions">
            {activeTab !== "Trash" && (
              <>
                <button onClick={() => onFavorite(photo)}>
                  {favorites.some((f) => f.id === photo.id) ? "💜" : "🤍"}
                </button>

                <button onClick={() => onTrash(photo)}>
                  🗑
                </button>
              </>
            )}

            {activeTab === "Trash" && (
              <button onClick={() => onDeletePermanent(photo)}>
                ❌ Delete Permanently
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
};

export default PhotoGrid;