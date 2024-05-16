import React, { useState } from "react";
import { SketchPicker } from "react-color";

function ColorPicker({ onChange, selectedColor }) {
  
  const handleChange = (newColor) => {
    onChange(newColor.hex);
  };

  return (
    <div>
      <SketchPicker
        color={selectedColor}
        width={200}
        height={200}
        className="color-picker"
        onChange={handleChange}
      />
    </div>
  );
}

export default ColorPicker;
