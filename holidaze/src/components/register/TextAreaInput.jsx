import React from "react";
import PropTypes from "prop-types";

function TextAreaInput({ label, error, ...rest }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full border p-2 rounded ${
          error ? "border-red-500" : ""
        }`}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

TextAreaInput.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
};

export default TextAreaInput;
