import { useEffect, useState } from "react";
import "./ImageViewer.css";

export default function ImageViewer({ src, alt, onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [src]);

  if (!src) {
    return null;
  }

  function acercar() {
    setZoom((actual) => Math.min(actual + 0.25, 4));
  }

  function alejar() {
    setZoom((actual) => Math.max(actual - 0.25, 1));
  }

  return (
    <div className="image-viewer" onClick={onClose}>
      <button
        type="button"
        className="image-viewer-close"
        onClick={onClose}
        aria-label="Cerrar imagen"
      >
        ×
      </button>

      <div className="image-viewer-zoom-controls">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            alejar();
          }}
          aria-label="Alejar imagen"
        >
          −
        </button>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            acercar();
          }}
          aria-label="Acercar imagen"
        >
          +
        </button>
      </div>

      <img
        src={src}
        alt={alt || "Imagen ampliada"}
        className="image-viewer-image"
        style={{ transform: `scale(${zoom})` }}
        onClick={(event) => {
          event.stopPropagation();
          acercar();
        }}
      />
    </div>
  );
}
