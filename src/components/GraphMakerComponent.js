import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

class GraphMakerComponent {
  components = {
    graphMakerBtn: document.querySelector("#graph_maker"),
    closeBtn: document.querySelector("#closeBtn"),
  };

  constructor() {
    this.#registerEvents();
  }

  #registerEvents = () => {
    this.components.graphMakerBtn.addEventListener("click", this.#graphMakerOn);
    this.components.closeBtn.addEventListener("click", this.#graphMakerOff);
  };

  /**
   * Callback for zoom in event
   */
  #graphMakerOn = () => {
    document.getElementById("mySidenav").style.width = "1000px";
    document.getElementById("main").style.marginRight = "1000px";
  };

  #graphMakerOff = () => {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
  };
}

export { GraphMakerComponent };
