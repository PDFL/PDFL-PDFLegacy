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
    zoomDisplay: document.querySelector("#zoom-level"),
  };

  /**
   * Creates and initializes new zoom component. Sets zoom level to 1.
   * @constructor
   */
  constructor() {
    this.zoom = 1;
    this.#registerEvents();
  }

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

    this.components.zoomDisplay.addEventListener(
      "keypress",
      this.#zoomInputChanged
    );

    EventHandlerService.subscribe(PDFLEvents.onResetReader, () => {
      this.#reset();
    });
  };

  /**
   * Callback for zoom in action.
   * @private
   */
  #zoomIn = (event) => {
    if (event) event.preventDefault();
    this.#changeZoom((this.zoom * 4) / 3);
  };

  /**
   * Callback for the zoom out action.
   * @private
   */
  #zoomOut = () => {
    if (this.zoom < MIN_ZOOM_FACTOR) return;
    this.#changeZoom(this.zoom / (4 / 3));
  };

  /**
   * Validates given zoom and sets new zoom level. Publishes onZoomChange
   * event if given zoom is different than current one and displays it.
   * @private
   * @param {double} zoom zoom factor
   */
  #changeZoom(zoom) {
    const validZoom = this.#validateZoom(zoom);
    if (validZoom != this.zoom) {
      this.zoom = validZoom;
      EventHandlerService.publish(PDFLEvents.onZoomChange, this.zoom);
    }
    this.#setZoomDisplay();
  }

  /**
   * Checks if given zoom factor is in zoom bounds and returns
   * zoom factor within those bounds. Lower bound is set to
   * {@link MIN_ZOOM_FACTOR} and upper to {@link MAX_ZOOM_FACTOR}.
   * @private
   * @param {double} zoom zoom factor to validate
   * @returns {double} validated zoom factor
   */
  #validateZoom(zoom) {
    if (zoom > MAX_ZOOM_FACTOR) return MAX_ZOOM_FACTOR;
    if (zoom < MIN_ZOOM_FACTOR) return MIN_ZOOM_FACTOR;
    return zoom;
  }

  /**
   * Changes the value of zoom input box to current zoom which
   * is displayed as a percentage.
   * @private
   */
  #setZoomDisplay() {
    this.components.zoomDisplay.value = this.#getZoomPercentage() + "%";
  }

  /**
   * Returns current zoom as percentage without decimal spaces.
   * @private
   * @returns {int} zoom percentage
   */
  #getZoomPercentage() {
    return Math.trunc(this.zoom * 100);
  }

  /**
   * Callback for global keyboard keyUp event
   * CTRL + ZoomIn - CTRL - ZoomOut
   * @param functionalKeys, object {ctrl: bool, alt: bool, shift: bool} indicates if one or more of this keys are pressed
   * @param key the actual key which triggers the event
   */
  #onKeyboardKeyDown = (functionalKeys, key) => {
    if (!functionalKeys.ctrl) return;
    if (key === "+") this.#zoomIn();
    else if (key === "-") this.#zoomOut();
  };

  /**
   * Callback for zoom percentage input listener. New zoom percentage
   * can be given as a number with or without percentage symbol. Given
   * input is being processed when enter is pressed.
   * @private
   * @param {Event} event
   */
  #zoomInputChanged = (event) => {
    const keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode != 13) return;

    if (!isNaN(this.components.zoomDisplay.value))
      this.#changeZoom(this.components.zoomDisplay.value / 100);
    else if (this.#isPercentageInput())
      this.#changeZoom(this.components.zoomDisplay.value.slice(0, -1) / 100);
    else this.#setZoomDisplay();
  };

  /**
   * Returns true if content of zoom percentage input contains a number
   * with percentage symbol and false otherwise.
   * @returns {boolean}
   */
  #isPercentageInput() {
    return (
      !isNaN(this.components.zoomDisplay.value.slice(0, -1)) &&
      this.components.zoomDisplay.value.slice(-1) == "%"
    );
  }

  /**
   * Resets this component - sets zoom factor to 1 and updates zoom display.
   * @private
   */
  #reset() {
    this.zoom = 1;
    this.#setZoomDisplay();
  }
}

export { ZoomComponent };
