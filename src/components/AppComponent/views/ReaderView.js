import { AppView } from "./AppView.js";
import { PdfReaderComponent } from "../../PdfReaderComponent.js";
import { ThumbnailComponent } from "../../ThumbnailComponent.js";
import { SidePageComponent } from "../../SidePageComponents/SidePageComponent.js";
import { ReferenceViewComponent } from "../../ReferenceViewComponent.js";

/**
 * PDF reader page view.
 *
 * @extends AppView
 * @property {PdfReaderComponent} reader static property representhing the PDF file reader component
 * @property {ThumbnailComponent} thumbnail static property representhing the thumbnail of PDF file
 * @property {SidePageComponent} sidePage static property representing the side page in which summary
 * or knowledge graph can be displayed
 * @property {ReferenceViewComponent} referenceView static property representing a side paper with 
 * cross reference content
 * @property {HTMLElement} component element representing the reader view
 */
class ReaderView extends AppView {
  static reader = new PdfReaderComponent();
  static thumbnail = new ThumbnailComponent();
  static sidePage = new SidePageComponent();
  static referenceView = new ReferenceViewComponent();

  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
