import React from "react";
import PropTypes from "prop-types";

function TextInput({ label, icon: Icon, error, ...rest }) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
          {Icon && <Icon />}  {/* Check if Icon is provided before rendering */}
        </span>
        <input
          {...rest}
          className="w-full p-2 pl-10 border rounded"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  error: PropTypes.string,
};

export default TextInput;

