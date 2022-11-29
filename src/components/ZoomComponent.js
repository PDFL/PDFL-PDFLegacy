import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

/**
 * Component that displays zoom buttons, calculates zoom level when buttons pressed and stores it.
 *
 * @property {Object} components object that holds DOM elements that are within component
 * @property {HTMLElement} components.zoomIn zoom in button
 * @property {HTMLElement} components.zoomOut zoom out button
 * @property {double} zoom current zoom level
 */
class ZoomComponent {
  components = {
    zoomIn: document.querySelector("#zoom-in"),
    zoomOut: document.querySelector("#zoom-out"),
  };

  /**
   * Creates and initializes new zoom component. Sets zoom level to 1.
   * @constructor
   */
  constructor() {
    this.setZoom(1);
    this.#registerEvents();
  }

  /**
   * Setter for current zoom level.
   * @param {double} zoom new zoom level
   */
  setZoom = (zoom) => {
    this.zoom = zoom;
  };

  /**
   * Getter for current zoom level.
   * @returns {double} current zoom level
   */
  getZoom = () => {
    return this.zoom;
  };

  /**
   * Adds event listeners to component's elements.
   * @private
   */
  #registerEvents = () => {
    this.components.zoomIn.addEventListener("click", this.#zoomIn);
    this.components.zoomOut.addEventListener("click", this.#zoomOut);
  };

  /**
   * Callback for zoom in action.
   * @private
   */
  #zoomIn = () => {
    this.zoom *= 4 / 3;
    EventHandlerService.publish(PDFLEvents.onRenderPage);
  };

  /**
   * Callback for the zoom out action.
   * @private
   */
  #zoomOut = () => {
    this.zoom *= 2 / 3;
    EventHandlerService.publish(PDFLEvents.onRenderPage);
  };
}

export { ZoomComponent };
