import { DocumentParser } from "./DocumentParser";

const pdfjsLib = require("pdfjs-dist");

/**
 * Service class to extract all the images in a given PDF page
 */
class ImageExtractorService extends DocumentParser {
  /**
   * @see{DocumentParser}
   * @returns {Promise<Object>}
   */
  getContent = async () => {
    const images = await this.getImagesDataUrl();
    if (images.length > 0) {
      return {
        type: "image",
        popupDisplayable: true,
        src: images[0],
      };
    }
    return null;
  };

  /**
   * This function return an array of object representing all the images extracted in the pdf page
   * This is useful only if you need the pixels array or you have to manipulate data
   * @returns {Promise<Object>}
   */
  async getImagesObjects() {
    const self = this;
    return new Promise(async (resolve, error) => {
      const images = [];
      const page = await self.pdfDocument.getPage(self.targetPage);
      const opList = await page.getOperatorList();
      for (let k = 0; k < opList.fnArray.length; k++) {
        if (
          opList.fnArray[k] === pdfjsLib.OPS.paintJpegXObject ||
          opList.fnArray[k] === pdfjsLib.OPS.paintImageXObject
        ) {
          let img = null;
          try {
            img = page.objs.get(opList.argsArray[k][0]);
          } catch (err) {
            if (opList.argsArray[k][0].startsWith("g_")) {
              img = page.commonObjs.get(opList.argsArray[k][0]);
            } else {
              error(err);
              return;
            }
          }
          if (img == null) {
            error("Null image");
            return;
          }
          images.push(img);
        }
      }
      resolve(images);
    });
  }

  /**
   * This function is used to get an array of all the data url of images in a pdf page
   * This in the best solution to create image elements in DOM, which are resizable too (just set img.src with each array element)
   * @returns {Promise<Array<String>>}
   */
  async getImagesDataUrl() {
    const self = this;
    return new Promise(async (resolve) => {
      const objects = await self.getImagesObjects();
      var dataUrls = [];
      objects.forEach((o) => {
        dataUrls.push(self.#canvasToImageDataUrl(self.imageDataToCanvas(o)));
      });
      resolve(dataUrls);
    });
  }

  /**
   * This function render an image data object into a canvas
   * The result is not resizable unless the canvas is re-drawn
   * @param imageObject the image data to be rendered
   * @returns {HTMLCanvasElement} the canvas with the image
   */
  imageDataToCanvas(imageObject) {
    const canvas = document.createElement("canvas");
    canvas.width = imageObject.width;
    canvas.height = imageObject.height;
    const ctx = canvas.getContext("2d");
    const imageData = ctx.createImageData(
      imageObject.width,
      imageObject.height
    );
    if (imageObject.kind === 2) {
      //Kind = 2 -> transparent
      const newImageData = this.#addAlphaChannelToUnit8ClampedArray(
        imageObject.data,
        imageObject.width,
        imageObject.height
      );
      if (imageData.data.set) {
        imageData.data.set(newImageData);
      } else {
        // IE9
        newImageData.forEach(function (val, i) {
          imageData.data[i] = val;
        });
      }
    } else {
      if (imageData.data.set) {
        imageData.data.set(imageObject.data);
      } else {
        // IE9
        imageObject.data.forEach(function (val, i) {
          imageData.data[i] = val;
        });
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }

  /**
   * This function is responsible to convert a canvas into a data url to be set into img.src
   * @param canvas the source canvas
   * @returns {string} the img.src string
   */
  #canvasToImageDataUrl(canvas) {
    return canvas.toDataURL();
  }

  /**
   * Add the alpha channel to images without it
   * @param unit8Array original image data without alpha channel
   * @param imageWidth
   * @param imageHeight
   * @returns {Uint8ClampedArray} new image data with alpha channel
   */
  #addAlphaChannelToUnit8ClampedArray(unit8Array, imageWidth, imageHeight) {
    const newImageData = new Uint8ClampedArray(imageWidth * imageHeight * 4);

    for (let j = 0, k = 0, jj = imageWidth * imageHeight * 4; j < jj; ) {
      newImageData[j++] = unit8Array[k++];
      newImageData[j++] = unit8Array[k++];
      newImageData[j++] = unit8Array[k++];
      newImageData[j++] = 255;
    }

    return newImageData;
  }
}

export { ImageExtractorService };
