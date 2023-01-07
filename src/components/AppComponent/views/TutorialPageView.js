import { AppView } from "./AppView.js";
import { TutorialPageComponent } from "../../TutorialPageComponent.js";
/**
 * PDF file upload page view.
 *
 * @extends AppView
 * @property {FileUploadComponent} FileUploadComponent static property representing the file upload component
 * @property {HTMLElement} component DOM element representing the file upload view
 */
class TutorialPageView extends AppView {
  static tutorialPage = new TutorialPageComponent();
  component = document.getElementById("tutorial-page");
}

export { TutorialPageView };
