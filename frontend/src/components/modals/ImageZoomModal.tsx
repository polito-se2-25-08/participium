import { useEffect, useState } from "react";

interface ImageZoomModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  altText?: string;
}

export default function ImageZoomModal({
  isOpen,
  imageUrl,
  onClose,
  altText = "Zoomed image",
}: ImageZoomModalProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsZoomed(false);
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset zoom and position when modal closes
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      setPosition({ x: 50, y: 50 });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
    if (isZoomed) {
      // Reset position when zooming out
      setPosition({ x: 50, y: 50 });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    
    // Calculate position as percentage
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking on backdrop, not the image
    if (e.target === e.currentTarget) {
      setIsZoomed(false);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <button
          onClick={() => {
            setIsZoomed(false);
            onClose();
          }}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
          aria-label="Close"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div
          className="relative w-full h-full flex items-center justify-center overflow-hidden"
          onMouseMove={handleMouseMove}
        >
          <img
            src={imageUrl}
            alt={altText}
            className={`max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
            }`}
            onClick={handleImageClick}
            style={{
              transformOrigin: `${position.x}% ${position.y}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
