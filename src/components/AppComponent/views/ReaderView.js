import { AppView } from "./AppView.js";
import { PdfReaderComponent } from "../../PdfReaderComponent.js";
import { NavbarComponent } from "../../NavbarComponent.js";
import { ThumbnailComponent } from "../../ThumbnailComponent.js";
import { SidePageComponent } from "../../SidePageComponent.js";

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
  static navbar = new NavbarComponent();
  static thumbnail = new ThumbnailComponent();
  static sidePageComponent = new SidePageComponent();

  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
