import { createWorker } from "tesseract.js";
import cv from 'opencv4nodejs'

// Define a function to calculate midpoint between two points
const midpoint = (x1, y1, x2, y2) => {
  const x_mid = Math.round((x1 + x2) / 2);
  const y_mid = Math.round((y1 + y2) / 2);
  return [x_mid, y_mid];
};

// Main function to detect text and inpaint
const inpaintText = async (imgPath) => {
  // Create Tesseract worker
  const worker = createWorker();

  // Load image using OpenCV
  const img = cv.imread(imgPath);

  try {
    // Initialize Tesseract worker
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    // Recognize text
    const {
      data: { text },
    } = await worker.recognize(imgPath);

    // Process text regions to create mask for inpainting
    const mask = new cv.Mat.zeros(img.rows, img.cols, cv.CV_8UC1);
    // Iterate over detected text regions and draw mask
    // Replace this with your own logic to extract text regions

    // Inpaint text regions
    const inpaintedImg = img.inpaint(mask, 7, cv.INPAINT_NS);

    // Return the inpainted image
    return inpaintedImg;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Release resources and terminate worker
    img.release();
    mask.release();
    await worker.terminate();
  }
};

// Call inpaintText function with the image path
inpaintText("./t.webp")
  .then((imgTextRemoved) => {
    // Display the inpainted image using OpenCV (or save it)
    cv.imshow("Inpainted Image", imgTextRemoved);
    cv.waitKey();
    cv.imwrite("text_removed_image.jpg", imgTextRemoved);
  })
  .catch((error) => {
    console.error("Error:", error);
  });



//   -------------


// import Tesseract from "tesseract.js";

// async function removeTextFromImage(imagePath, outputPath) {
//   const Jimp = await import("jimp").then((module) => module.default);

//   // Load the image using Jimp
//   const image = await Jimp.read(imagePath);

//   // Use Tesseract.js to detect text
//   const {
//     data: { blocks },
//   } = await Tesseract.recognize(imagePath, "eng");

//   // Function to calculate the average color of a region
//   function getAverageColor(image, x, y, width, height) {
//     let red = 0, green = 0, blue = 0, count = 0;
//     image.scan(x, y, width, height, (x, y, idx) => {
//       red += image.bitmap.data[idx + 0];
//       green += image.bitmap.data[idx + 1];
//       blue += image.bitmap.data[idx + 2];
//       count++;
//     });
//     return {
//       r: Math.floor(red / count),
//       g: Math.floor(green / count),
//       b: Math.floor(blue / count)
//     };
//   }

//   // Draw over the detected text blocks to remove text
//   blocks.forEach((block) => {
//     const {
//       bbox: { x0, y0, x1, y1 },
//     } = block;

//     // Dilate the bounding box by a small margin
//     const margin = 5;
//     const startX = Math.max(0, x0 - margin);
//     const startY = Math.max(0, y0 - margin);
//     const endX = Math.min(image.bitmap.width, x1 + margin);
//     const endY = Math.min(image.bitmap.height, y1 + margin);

//     // Get the average color of the surrounding area
//     const avgColor = getAverageColor(image, startX, startY, endX - startX, endY - startY);

//     // Draw over the detected text blocks with the average color
//     image.scan(startX, startY, endX - startX, endY - startY, (x, y, idx) => {
//       image.bitmap.data[idx + 0] = avgColor.r; // R
//       image.bitmap.data[idx + 1] = avgColor.g; // G
//       image.bitmap.data[idx + 2] = avgColor.b; // B
//       image.bitmap.data[idx + 3] = 255;        // A
//     });
//   });

//   // Save the modified image
//   await image.writeAsync(outputPath);
//   console.log("Text removed and image saved to", outputPath);
// }

// // Example usage
// removeTextFromImage(
//   "https://i0.wp.com/static.stacker.com/s3fs-public/styles/1280x720/s3/2019-03/Screen%20Shot%202019-03-14%20at%2010.53.38%20AM.png?ssl=1",
//   "output.jpg"
// );
