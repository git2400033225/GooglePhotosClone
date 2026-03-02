import * as faceapi from "face-api.js";

let modelsLoaded = false;

export const loadModels = async () => {
  if (modelsLoaded) return;

  const MODEL_URL =
    "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

  await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

  modelsLoaded = true;
};

export const clusterFaces = async (photos) => {
  const clusters = [];
  const threshold = 0.6; // similarity threshold

  for (const photo of photos) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous"; // IMPORTANT for CDN
      img.src = photo.url;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const detections = await faceapi
        .detectAllFaces(
          img,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 512,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!detections || detections.length === 0) continue;

      for (const detection of detections) {
        const descriptor = detection.descriptor;
        let matched = false;

        for (const cluster of clusters) {
          const distance = faceapi.euclideanDistance(
            descriptor,
            cluster.descriptors[0]
          );

          if (distance < threshold) {
            cluster.photos.push(photo);
            cluster.descriptors.push(descriptor);
            matched = true;
            break;
          }
        }

        if (!matched) {
          clusters.push({
            name: `Person ${clusters.length + 1}`,
            photos: [photo],
            descriptors: [descriptor],
          });
        }
      }
    } catch (error) {
      console.error("Face detection error:", error);
    }
  }

  return clusters;
};