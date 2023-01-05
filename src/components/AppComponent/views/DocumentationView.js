import { AppView } from "./AppView.js";
import { DocumentationComponent } from "../../DocumentationComponent.js";
/**
 * PDF file upload page view.
 *
 * @extends AppView
 * @property {FileUploadComponent} FileUploadComponent static property representing the file upload component
 * @property {HTMLElement} component DOM element representing the file upload view
 */
class DocumentationView extends AppView {
  static documentation = new DocumentationComponent();
  component = document.getElementById("documentation-page");
}

export { DocumentationView };
