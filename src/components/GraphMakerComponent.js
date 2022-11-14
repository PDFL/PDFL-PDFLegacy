class GraphMakerComponent {
  components = {
    graphMakerBtn: document.querySelector("#graph-maker"),
    closeBtn: document.querySelector("#close-btn"),
    fullScreen: document.querySelector("#full-screen"),
    body: document.querySelector("body"),
    sideNav: document.querySelector("#side-page"),
    pdfContainer: document.querySelector("#pdf-container")
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
    this.components.sideNav.className = "half-width";
    this.components.pdfContainer.className = "half-width";
  };

  /**
   * Callback for div not visible in view event
   */
  #graphMakerOff = () => {
    this.components.sideNav.className = "no-width";
    this.components.pdfContainer.className = "full-width";
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
