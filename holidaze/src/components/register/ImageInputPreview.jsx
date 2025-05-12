import React from "react";
import { FaImage } from "react-icons/fa";
import { fallbackImage } from "../../api";
import PropTypes from "prop-types";

function ImageInputPreview({ label, register, watchValue, altLabel, altRegister, errorUrl, errorAlt, previewAlt }) {
  return (
    <>
      <div>
        <label className="block font-medium">{label}</label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
            <FaImage />
          </span>
          <input {...register} className="w-full p-2 pl-10 border rounded" />
        </div>
        {errorUrl && <p className="text-red-600 text-sm">{errorUrl}</p>}
      </div>

      {watchValue && (
        <div>
          <p className="text-sm text-gray-500 mb-1">Preview:</p>
          <img
            src={watchValue}
            alt={previewAlt}
            className="w-full max-h-48 object-cover rounded border"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = fallbackImage;
            }}
          />
        </div>
      )}

      <div>
        <label className="block font-medium">{altLabel}</label>
        <input {...altRegister} className="w-full p-2 border rounded" />
        {errorAlt && <p className="text-red-600 text-sm">{errorAlt}</p>}
      </div>
    </>
  );
}

ImageInputPreview.propTypes = {
  label: PropTypes.string.isRequired,
  register: PropTypes.object.isRequired,
  watchValue: PropTypes.string,
  altLabel: PropTypes.string.isRequired,
  altRegister: PropTypes.object.isRequired,
  errorUrl: PropTypes.string,
  errorAlt: PropTypes.string,
  previewAlt: PropTypes.string,
};


ImageInputPreview.defaultProps = {
  previewAlt: "Image preview",
};

export default ImageInputPreview;
