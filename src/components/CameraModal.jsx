import { useRef, useEffect } from "react";

const CameraModal = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let stream;

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });

      videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Camera not accessible");
      console.error(error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const imageUrl = canvas.toDataURL("image/png");

    onCapture(imageUrl);
    stopCamera();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">

        <button className="modal-close" onClick={() => {
          stopCamera();
          onClose();
        }}>
          X
        </button>

        <video
          ref={videoRef}
          autoPlay
          style={{ width: "100%", borderRadius: "10px" }}
        />

        <button
          onClick={capturePhoto}
          style={{
            marginTop: "15px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            background: "#6366f1",
            color: "white",
            cursor: "pointer"
          }}
        >
          📸 Capture
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />

      </div>
    </div>
  );
};

export default CameraModal;