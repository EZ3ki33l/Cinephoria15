"use client";

import { Star, StarHalf } from "lucide-react";
import { useState, useEffect } from "react";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled = false }: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [displayRating, setDisplayRating] = useState(value);

  useEffect(() => {
    setDisplayRating(value);
  }, [value]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const x = e.clientX - rect.left;
    const percent = x / width;

    // Si on est dans la première moitié de l'étoile
    if (percent <= 0.5) {
      setHoverRating(starIndex + 0.5);
    } else {
      setHoverRating(starIndex + 1);
    }
  };

  const handleClick = (rating: number) => {
    if (disabled) return;
    onChange(rating);
  };

  const renderStar = (index: number) => {
    const currentRating = hoverRating ?? displayRating;
    const filled = currentRating >= index + 1;
    const half = currentRating === index + 0.5;

    return (
      <div
        key={index}
        className={`relative cursor-${disabled ? 'not-allowed' : 'pointer'}`}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(hoverRating ?? displayRating)}
      >
        {half ? (
          <StarHalf className={`w-6 h-6 ${disabled ? 'text-gray-300' : 'text-yellow-400'}`} />
        ) : (
          <Star
            className={`w-6 h-6 ${
              filled
                ? disabled
                  ? 'text-gray-300'
                  : 'text-yellow-400 fill-yellow-400'
                : disabled
                ? 'text-gray-300'
                : 'text-yellow-400'
            }`}
            fill={filled ? 'currentColor' : 'none'}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => !disabled && setHoverRating(null)}
    >
      {[0, 1, 2, 3, 4].map((index) => renderStar(index))}
    </div>
  );
} 