import React from "react";

function TextAreaInput({ label, error, ...rest }) {
  return (
    <div>
      <label className="block font-medium">{label}</label>
      <textarea {...rest} className="w-full p-2 border rounded" />
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}

export default TextAreaInput;
