import { AppView } from './AppView.js';
import { PdfReaderComponent } from '../../PdfReaderComponent.js';
import { GraphMakerComponent } from "../../GraphMakerComponent";

/**
 * PDF reader page view.
 * 
 * @extends AppView
 * @property {PdfReaderComponent} reader static property representhing the PDF file reader component
 * @property {HTMLElement} component element representing the reader view
 */
class ReaderView extends AppView {
    static reader = new PdfReaderComponent();

  static graphmaker = new GraphMakerComponent();
  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
