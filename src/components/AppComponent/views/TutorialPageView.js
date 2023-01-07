import { AppView } from "./AppView.js";
import { TutorialPageComponent } from "../../TutorialPageComponent.js";
/**
 * Tutorial Page View
 *
 * @extends AppView
 * @property {TutorialPageComponent} TutorialPageComponent static property representing the tutorial page component with it's element
 * @property {HTMLElement} component DOM element representing the file upload view
 */
class TutorialPageView extends AppView {
  static tutorialPage = new TutorialPageComponent();
  component = document.getElementById("tutorial-page");
}

export { TutorialPageView };
