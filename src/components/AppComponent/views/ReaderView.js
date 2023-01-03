import { AppView } from "./AppView.js";
import { PdfReaderComponent } from "../../PdfReaderComponent.js";
import { ThumbnailComponent } from "../../ThumbnailComponent.js";
import { SidePageComponent } from "../../SidePageComponents/SidePageComponent.js";

/**
 * PDF reader page view.
 *
 * @extends AppView
 * @property {PdfReaderComponent} reader static property representhing the PDF file reader component
 * @property {ThumbnailComponent} reader static property representhing the thumbnail of PDF file
 * @property {HTMLElement} component element representing the reader view
 */
class ReaderView extends AppView {
  static reader = new PdfReaderComponent();
  static thumbnail = new ThumbnailComponent();
  static sidePageComponent = new SidePageComponent();

  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
