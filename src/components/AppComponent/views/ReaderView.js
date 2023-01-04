import { AppView } from "./AppView.js";
import { PdfReaderComponent } from "../../PdfReaderComponent.js";
import { NavbarComponent } from "../../NavbarComponent.js";
import { TutorialPopupComponent } from "../../TutorialPopupComponent";

/**
 * PDF reader page view.
 *
 * @extends AppView
 * @property {PdfReaderComponent} reader static property representhing the PDF file reader component
 * @property {PdfReaderComponent} navbar static property representhing the PDF file navbar component
 * @property {HTMLElement} component element representing the reader view
 */
class ReaderView extends AppView {
  static reader = new PdfReaderComponent();
  static navbar = new NavbarComponent();
  static tutorial = new TutorialPopupComponent();
  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
