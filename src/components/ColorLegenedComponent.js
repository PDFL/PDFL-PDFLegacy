import { FIELD_OF_STUDY_COLOR } from "../Constants";

/**
 * Component within knowledge graph responsible for creating a color legend. Color legend
 * displays field of study and color representing it. This class creates a legend based on
 * {@link FIELD_OF_STUDY_COLOR} object.
 *
 * @property {Object} object that holds elements within this component
 * @property {HTMLElement} placeholder element that contains slides with color legend
 *
 */
class ColorLegenedComponent {
  components = {
    placeholder: document.querySelector("#field-colors"),
  };

  /**
   * Creates new filled color legend.
   * @constructor
   */
  constructor() {
    this.#fillLegend();
  }

  /**
   * Creates slides that contain color legend and adds them to slider.
   * Finally this method creates a header with actions to change slide.
   *
   * @private
   */
  #fillLegend = () => {
    let fieldColors = this.#getFieldOfStudyColors();
    let slidesTotal = Math.ceil((fieldColors.length - 1) / 6);

    for (let i = 0; i < slidesTotal; i++) {
      let slide = this.#createSlide(i + 1, fieldColors.slice(i * 6, i * 6 + 6));
      this.components.placeholder.innerHTML += slide;
    }

    this.components.placeholder.innerHTML += this.#createHeader(slidesTotal);
  };

  /**
   * Returs {@link FIELD_OF_STUDY_COLOR} object as array. Every element
   * in object is turned into array with two elements. Filtering out
   * missing color.
   *
   * @private
   * @returns {Array.<string[]>}
   */
  #getFieldOfStudyColors = () => {
    return Object.entries(FIELD_OF_STUDY_COLOR);
  };

  /**
   * Creates a slide with a legend for six colors/field
   * of study. Slide is returned as string.
   *
   * @private
   * @param {int} slide slide number
   * @param {Array.<string[]>} fieldColors
   * @returns {string}
   */
  #createSlide = (slide, fieldColors) => {
    let fields = "";
    for (let fieldColor of fieldColors)
      fields += `<div id="rect" style="background-color: ${fieldColor[1]}">${fieldColor[0]}</div>`;

    return `<input id="slide-${slide}" type="radio" name="slides" ${
      slide == 1 ? "checked" : ""
    } hidden>
            <section class="slide slide-${slide}">
                ${fields}
            </section>`;
  };

  /**
   * Creates a header with actions which enable
   * switching between slides.
   *
   * @private
   * @param {int} slidesNum total number of slides
   * @returns {string}
   */
  #createHeader = (slidesNum) => {
    let labels = "";
    for (let i = 1; i <= slidesNum; i++)
      labels += `<label for="slide-${i}" id="slide-${i}"></label>`;

    return `<header>${labels}</label>`;
  };
}

export { ColorLegenedComponent };
