class GraphMakerComponent {
  components = {
    graphMakerBtn: document.querySelector("#graph-maker"),
    closeBtn: document.querySelector("#close-btn"),
    fullScreen: document.querySelector("#full-screen"),
    body: document.querySelector("body"),
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
    document.getElementById("side-nav").style.width = "1000px";
    document.getElementById("main").style.marginRight = "1000px";
  };

  /**
   * Callback for div not visible in view event
   */
  #graphMakerOff = () => {
    document.getElementById("side-nav").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
  };

  /**
   * Callback for showing pdf reader view in full screen when button clicked
   */
  #showFullScreen = () => {
    if (this.components.body.requestFullscreen) {
      this.components.body.requestFullscreen();
    } else if (this.components.body.webkitRequestFullscreen) {
      /* Safari */
      this.components.body.webkitRequestFullscreen();
    } else if (this.components.body.msRequestFullscreen) {
      /* IE11 */
      this.components.body.msRequestFullscreen();
    }
  };
}

export { GraphMakerComponent };
