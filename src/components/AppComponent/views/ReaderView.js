import { AppView } from "./AppView.js";
import { GraphMakerComponent } from "../../GraphMakerComponent";
class ReaderView extends AppView {
  static graphmaker = new GraphMakerComponent();
  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
