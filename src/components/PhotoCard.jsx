const PhotoCard = ({
  photo,
  toggleFavorite,
  moveToTrash,
  openModal,
}) => {
  return (
    <div className="photo-card">
      <img
        src={photo.url}
        alt=""
        onClick={() => openModal(photo)}
      />

      <div className="photo-actions">
        <button onClick={() => toggleFavorite(photo.id)}>
          {photo.favorite ? "💜" : "🤍"}
        </button>

        <button onClick={() => moveToTrash(photo.id)}>
          🗑
        </button>
      </div>
    </div>
  );
};

export default PhotoCard;