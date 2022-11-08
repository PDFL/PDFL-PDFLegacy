import { FavoriteRounded } from "@mui/icons-material";
import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

class GraphMakerComponent {
  components = {
    graphMakerBtn: document.querySelector("#graph_maker"),
    closeBtn: document.querySelector("#close_btn"),
    fullScreen: document.querySelector("#full_screen"),
    body: document.querySelector("#body"),
  };

  /**
   * @constructor
   */
  constructor() {
    this.#registerEvents();
  }

  /**
   * Add event listeners to upload view
   */
  #registerEvents = () => {
    this.components.graphMakerBtn.addEventListener("click", this.#graphMakerOn);
    this.components.closeBtn.addEventListener("click", this.#graphMakerOff);
    this.components.fullScreen.addEventListener("click", this.#showFullScreen);
  };

  /**
   * Callback for div visible in view event
   */
  #graphMakerOn = () => {
    document.getElementById("side_nav").style.width = "1000px";
    document.getElementById("main").style.marginRight = "1000px";
  };

  /**
   * Callback for div not visible in view event
   */
  #graphMakerOff = () => {
    document.getElementById("side_nav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
  };

  /**
   * Callback for showing pdf reader view in full screen when button clicked
   */
  #showFullScreen = () => {
    if (body.requestFullscreen) {
      body.requestFullscreen();
    } else if (body.webkitRequestFullscreen) {
      /* Safari */
      body.webkitRequestFullscreen();
    } else if (body.msRequestFullscreen) {
      /* IE11 */
      body.msRequestFullscreen();
    }
  };
}

export { GraphMakerComponent };
