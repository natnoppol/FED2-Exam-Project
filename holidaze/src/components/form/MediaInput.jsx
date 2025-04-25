import React from "react";

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
       <label className="block font-medium mb-1">Media</label>

      {value.map((media, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
          <input
            type="url"
            value={media.url}
            onChange={(e) => handleMediaChange(index, "url", e.target.value)}
            placeholder="Image URL"
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            value={media.alt}
            onChange={(e) => handleMediaChange(index, "alt", e.target.value)}
            placeholder="Alt text (optional)"
            className="border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => handleRemoveMedia(index)}
            className="text-red-600 text-sm hover:underline col-span-full text-left"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAddMedia}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Media
      </button>
    </div>
  );
};

export default MediaInput;
