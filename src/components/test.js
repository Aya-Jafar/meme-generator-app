const cv = require('opencv4nodejs');
const { createWorker } = require('tesseract.js');

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




