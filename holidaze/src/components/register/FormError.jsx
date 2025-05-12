import React from "react";

function FormError({ error }) {
  return error ? (
    <p className="text-red-600 text-center">{error}</p>
  ) : null;
}

export default FormError;
