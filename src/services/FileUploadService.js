import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService.js";
/**
 * Function to publishes the showReaderView event, reads a file and then publishes readNewFile event
 * @param {pdfDoc} file PDF document
 */
export function readFile(file) {
  EventHandlerService.publish(PDFLEvents.onResetReader);

  const fileReader = new FileReader();
  fileReader.onload = function () {
    EventHandlerService.publish(
      PDFLEvents.onReadNewFile,
      new Uint8Array(this.result)
    );
    EventHandlerService.publish(PDFLEvents.onShowReaderView);
  };
  fileReader.readAsArrayBuffer(file);
}
