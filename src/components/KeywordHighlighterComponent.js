import {
  EventHandlerService,
  PDFLEvents,
} from "../services/EventHandlerService";

class KeywordHighlighterComponent {
  constructor() {
    this.keywords = [];

    this.#registerEvents();
  }

  setKeywords(keywords) {
    this.keywords = keywords;
  }

  turnOn() {
    // TODO: show highlights
  }

  turnOff() {
    // TODO: hide highlights
  }

  #registerEvents() {
    EventHandlerService.subscribe(
      PDFLEvents.onTextLayerRendered,
      this.#onTextLayerRendered.bind(this)
    );
  }

  #onTextLayerRendered(textLayer) {
    for (let textLayerElement of textLayer.children) {
      if (textLayerElement.tagName == "SPAN") {
        let content = textLayerElement.innerHTML;
        for (let keyword of this.keywords) {
          if (content.includes(keyword)) {
            let newContent = content.replace(
              keyword,
              `<span class='topic-highlighted-text'>${keyword}</span>`
            );
            textLayerElement.innerHTML = newContent;

            let newHighlight = textLayerElement.children[0];
            newHighlight.style.height = textLayerElement.style.fontSize;
          }
        }
      }
    }
  }
}

export { KeywordHighlighterComponent };
