import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService.js";
/**
 * Reset reader, reads file and then publishes readNewFileEvent. After, publishes the showReaderView event
 * @param {File} file PDF document
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
