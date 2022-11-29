import { FileUploadComponent } from "../../FileUploadComponent";
import { AppView } from "./AppView.js";

/**
 * PDF file upload page view.
 *
 * @extends AppView
 * @property {FileUploadComponent} FileUploadComponent static property representing the file upload component
 * @property {HTMLElement} component DOM element representing the file upload view
 */
class InputView extends AppView {
  static FileUploadComponent = new FileUploadComponent();

  component = document.getElementById("input-page");
}

export { InputView };
