const Sidebar = ({
  active,
  setActive,
  albums,
  renameAlbum,
  deleteAlbum,
}) => {
  return (
    <div className="sidebar">
      <div
        className={`sidebar-item ${active === "All" ? "active" : ""}`}
        onClick={() => setActive("All")}
      >
        All
      </div>

      <div
        className={`sidebar-item ${active === "Favorites" ? "active" : ""}`}
        onClick={() => setActive("Favorites")}
      >
        Favorites
      </div>

      <div
        className={`sidebar-item ${active === "Trash" ? "active" : ""}`}
        onClick={() => setActive("Trash")}
      >
        Trash
      </div>

      <h4 style={{ marginTop: "20px" }}>Albums</h4>

      {Object.keys(albums).map((album) => (
        <div
          key={album}
          className={`sidebar-item ${active === album ? "active" : ""}`}
        >
          <span
            style={{ cursor: "pointer" }}
            onClick={() => setActive(album)}
          >
            {album}
          </span>

          <div>
            <button
              onClick={() => {
                const newName = prompt("Rename album:", album);
                if (newName) renameAlbum(album, newName);
              }}
              style={{ marginRight: "8px" }}
            >
              ✏
            </button>

            <button onClick={() => deleteAlbum(album)}>
              ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;