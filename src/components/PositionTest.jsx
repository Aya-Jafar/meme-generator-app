import React, { useState, useRef, useEffect } from "react";
import Tesseract from "tesseract.js";
import testImage from "./d.webp";
import cv from "opencv4nodejs";

function PositionTest() {
  const [recognizedText, setRecognizedText] = useState("");
  const [sentenceRectangles, setSentenceRectangles] = useState([]);
  const [customText, setCustomText] = useState("Custom Replacement Text");
  const imageRef = useRef(null);

  const recognizeText = () => {
    if (testImage) {
      Tesseract.recognize(testImage, "eng", { logger: (m) => console.log(m) })
        .then(({ data: { text, lines } }) => {
          console.log("Recognized Text:", text);
          setRecognizedText(text);

          // Extract text positions with bounding boxes
          const sentences = lines.map(({ text, bbox }) => ({ text, bbox }));
          console.log("Sentences:", sentences);
          setSentenceRectangles(sentences);
        })
        .catch((error) => {
          console.error("Error recognizing text:", error);
        });
    }
  };

  const imageUrl =
    "https://i0.wp.com/static.stacker.com/s3fs-public/styles/1280x720/s3/2019-03/Screen%20Shot%202019-03-14%20at%2010.53.38%20AM.png?ssl=1";

  const apiKey =
    "17ad1bf7cb74d8577b0a2339f8c7835a4f866b8c1e7007ee5b28d788a438d1ac384ab0c893db956931a8d9023532aec1";

  const [processedImage, setProcessedImage] = useState(null);

  const removeTextFromImage = async () => {
    try {
      // Fetch the image from the URL
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Error fetching image: ${response.statusText}`);
      }

      // Convert the fetched image to a Blob
      const blob = await response.blob();

      // Create a FormData object and append the Blob
      const form = new FormData();
      form.append("image_file", blob, "image.png"); // The third parameter is the filename

      // Send the FormData object via a fetch request
      const apiResponse = await fetch(
        "https://clipdrop-api.co/remove-text/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": apiKey,
          },
          body: form,
        }
      );

      if (!apiResponse.ok) {
        throw new Error(
          `Error from API: ${apiResponse.status} ${apiResponse.statusText}`
        );
      }

      // Process the response
      const buffer = await apiResponse.arrayBuffer();
      const resultBlob = new Blob([buffer], { type: "image/png" });
      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    recognizeText();
    removeTextFromImage();
  }, []); // Run once on component mount

  useEffect(() => {
    // Draw rectangles around sentences on image
    const canvas = imageRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Load the image
    const img = new Image();
    img.onload = () => {
      // Set canvas dimensions to match image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image
      ctx.drawImage(img, 0, 0);

      // Draw rectangles around sentences
      sentenceRectangles.forEach(({ bbox }) => {
        const { x0, y0, x1, y1 } = bbox;
        const width = x1 - x0;
        const height = y1 - y0;

        // Draw rectangle around sentence
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.strokeRect(x0, y0, width, height);

        // Clear the region where recognized text was detected
        ctx.clearRect(x0, y0, width, height);

        // Draw custom text at the same position
        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText(customText, x0, y1); // Draw text at bottom-left corner of the bounding box
      });
    };

    // Set the image source to trigger onload event
    img.src = testImage;
  }, [sentenceRectangles, testImage, customText]);

  return (
    <div>
      <h2>Image Text Recognition</h2>
      <canvas
        ref={imageRef}
        width={800} // Set canvas width to match image width
        height={600} // Set canvas height to match image height
        style={{ maxWidth: "100%", border: "1px solid black" }}
      />
    </div>
  );
}

export default PositionTest;
