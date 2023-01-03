import { MAX_ZOOM_FACTOR, MIN_ZOOM_FACTOR } from "../../Constants";
import {
  EventHandlerService,
  PDFLEvents,
} from "../../services/EventHandlerService";

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

    EventHandlerService.subscribe(
      PDFLEvents.onKeyboardKeyDown,
      this.#onKeyboardKeyDown.bind(this)
    );
  };

  /**
   * Callback for zoom in action.
   * @private
   */
  #zoomIn = (event) => {
    if (event) event.preventDefault();
    if (this.zoom > MAX_ZOOM_FACTOR) return;
    this.zoom *= 4 / 3;
    EventHandlerService.publish(PDFLEvents.onZoomChange, this.zoom);
    document.querySelector("#zoom-level").value =
      (this.zoom * 100).toString().substring(0, 3) + "%";
  };

  /**
   * Callback for the zoom out action.
   * @private
   */
  #zoomOut = () => {
    if (this.zoom < MIN_ZOOM_FACTOR) return;
    this.zoom *= 2 / 3;
    EventHandlerService.publish(PDFLEvents.onZoomChange, this.zoom);
    document.querySelector("#zoom-level").value =
      (this.zoom * 100).toString().substring(0, 3) + "%";
  };

  /**
   * Callback for global keyboard keyUp event
   * CTRL + ZoomIn - CTRL - ZoomOut
   * @param functionalKeys, object {ctrl: bool, alt: bool, shift: bool} indicates if one or more of this keys are pressed
   * @param key the actual key which triggers the event
   */
  #onKeyboardKeyDown = (functionalKeys, key, code) => {
    if (!functionalKeys.ctrl) {
      return;
    }
    if (key === "+") {
      this.#zoomIn();
    } else if (key === "-") {
      this.#zoomOut();
    }
  };
}

export { ZoomComponent };
