import React from "react";
import { Image, Plus, Trash2 } from "lucide-react";

const MediaInput = ({ value = [], onChange }) => {
  const handleMediaChange = (index, field, newValue) => {
    const updated = [...value];
    updated[index][field] = newValue;
    onChange(updated);
  };

  const handleAddMedia = () => {
    onChange([...value, { url: "", alt: "" }]);
  };

  const handleRemoveMedia = (index) => {
    const updated = value.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Image className="text-blue-600" size={20} />
        Media Upload
      </div>

      {value.map((media, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start border p-3 rounded shadow-sm"
        >
          <input
            type="url"
            value={media.url}
            onChange={(e) => handleMediaChange(index, "url", e.target.value)}
            placeholder="Image URL"
            className="border p-2 rounded w-full"
            required
          />
          <input
            type="text"
            value={media.alt}
            onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
            placeholder="Alt text (optional)"
            className="border p-2 rounded w-full"
          />

          {/* Image Preview */}
          {media.url && (
            <img
              src={media.url}
              alt={media.alt || "Preview"}
              className="mt-2 max-h-32 rounded shadow col-span-full"
            />
          )}

          <button
            type="button"
            onClick={() => handleRemoveMedia(index)}
            className="text-red-600 text-sm hover:underline col-span-full flex items-center gap-1 mt-1"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddMedia}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
      >
        <Plus size={16} />
        Add Media
      </button>
    </div>
  );
};

export default MediaInput;
