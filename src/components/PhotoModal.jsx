const PhotoModal = ({ photo, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        <img src={photo.url} alt={photo.name} />
        <h3>{photo.name}</h3>
      </div>
    </div>
  );
};

export default PhotoModal;