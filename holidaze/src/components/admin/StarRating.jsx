import React, { useState } from "react";
import { Star } from "lucide-react";

const StarRating = ({ rating, onChange }) => {
  const [hovered, setHovered] = useState(0);

  const handleClick = (value) => {
    if (value === rating) {
      onChange(0); // Click again to clear rating
    } else {
      onChange(value);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer transition-all duration-150 ${
            (hovered || rating) >= star
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-400"
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          fill={(hovered || rating) >= star ? "currentColor" : "none"}
        />
      ))}

      {/* Optional: Text label */}
      <span className="ml-2 text-sm text-gray-600">
        {rating ? `${rating} Star${rating > 1 ? "s" : ""}` : "No Rating"}
      </span>
    </div>
  );
};

export default StarRating;
