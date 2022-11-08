import { AppView } from "./AppView.js";

class ReaderView extends AppView {
  component = document.getElementById("pdf-viewer");
}

export { ReaderView };
