import { AppView } from "./AppView.js";

/**
 * PDF file upload page view.
 *
 * @extends AppView
 * @property {FileUploadComponent} FileUploadComponent static property representing the file upload component
 * @property {HTMLElement} component DOM element representing the file upload view
 */
class DocumentationView extends AppView {
  component = document.getElementById("documentation-page");
}

export { DocumentationView };
