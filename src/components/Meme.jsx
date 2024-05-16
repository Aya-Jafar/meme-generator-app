import React from "react";
import mainTextStyle from "./styles/MainTextStyle";
import secondTextStyle from "./styles/SecondTextStyle";
import { saveAs } from "file-saver";

// TODO:
// - Get the texts position in an image
// - Hide original text from photos
// - Add the new text in the same position of the hidden text

function Meme(props) {
  const {
    index,
    photo,
    mainInputText,
    textColor,
    secondaryInputText,
    isBold,
    isItalic,
  } = props;

  const commonStyles = {
    color: textColor,
    fontWeight: isBold ? "900" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    whiteSpace: "nowrap",
  };

  return (
    <div key={index} className="image-container">
      <img src={photo} alt={`Meme ${index}`} />
      {mainInputText && (
        <div className="image-text">
          <span
            style={{
              ...mainTextStyle[index],
              ...commonStyles,
            }}
          >
            {mainInputText}
          </span>
        </div>
      )}

      {secondaryInputText && (
        <span
          style={{
            ...secondTextStyle[index],
            ...commonStyles,
            whiteSpace: "wrap",
          }}
        >
          {secondaryInputText}
        </span>
      )}
      <br />
    </div>
  );
}

export default Meme;
