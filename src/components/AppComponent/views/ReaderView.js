import { AppView } from "./AppView.js";
import { PdfReaderComponent } from "../../PdfReaderComponent.js";
import { NavbarComponent } from "../../NavbarComponent.js";
import { TutorialWindowComponent } from "../../TutorialWindowComponent";
import { ThumbnailComponent } from "../../ThumbnailComponent.js";

/**
 * PDF reader page view.
 *
 * @extends AppView
 * @property {PdfReaderComponent} reader static property representhing the PDF file reader component
 * @property {ThumbnailComponent} thumbnail static property representhing the thumbnail of PDF file
 * @property {ThumbnailComponent} tutorial static property representhing the tutorial window component
 * @property {HTMLElement} component element representing the reader view
 */
class ReaderView extends AppView {
  static reader = new PdfReaderComponent();
  static navbar = new NavbarComponent();
  static tutorial = new TutorialWindowComponent();
  static thumbnail = new ThumbnailComponent();

  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
