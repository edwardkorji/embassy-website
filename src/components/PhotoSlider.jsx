import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PhotoSlider({ photos, alt }) {
  const [index, setIndex] = useState(0);

  if (!photos || photos.length === 0) return null;

  const go = (delta) => {
    setIndex((current) => (current + delta + photos.length) % photos.length);
  };

  return (
    <div className="photo-slider">
      <div className="photo-slider-viewport">
        <div
          className="photo-slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {photos.map((src, i) => (
            <div className="photo-slider-slide" key={src}>
              <img
                src={src}
                alt={alt ? `${alt} — photo ${i + 1}` : ""}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="photo-slider-arrow photo-slider-arrow--prev"
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              type="button"
              className="photo-slider-arrow photo-slider-arrow--next"
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="photo-slider-dots">
          {photos.map((src, i) => (
            <button
              type="button"
              key={src}
              className={`photo-slider-dot${i === index ? " active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default PhotoSlider;
