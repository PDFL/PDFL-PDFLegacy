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
    for (let currentPresentation of textLayer.children) {
      if (currentPresentation.tagName == "SPAN") {
        let content = currentPresentation.innerHTML;
        for (let keyword of this.keywords) {
          let keywordIndex = content.indexOf(keyword);
          if (keywordIndex != -1) {
            let dotIndex = currentPresentation.innerHTML.indexOf(". ");
            if (dotIndex == -1) {
              this.#highlightUntilLeftDot(currentPresentation);
              this.#highlightUntilRightDot(
                currentPresentation.nextElementSibling
              );
            } else {
              if (keywordIndex > dotIndex) {
                this.#highlightToLeftDot(currentPresentation);
                this.#highlightUntilRightDot(
                  currentPresentation.nextElementSibling
                );
              } else {
                this.#hightlightToRightDot(currentPresentation);
                this.#highlightUntilLeftDot(
                  currentPresentation.previousElementSibling
                );
              }
            }
          }
        }
      }
    }
  }

  #hightlightWholePresentation(currentPresentation) {
    currentPresentation.innerHTML =
      "<span class='topic-highlighted-text'>" + currentPresentation.innerHTML;
    currentPresentation.innerHTML += "</span>";

    this.#setHighlightHeight(currentPresentation);
  }

  #hightlightToRightDot(currentPresentation) {
    if (currentPresentation.innerHTML.includes("<span")) {
      return;
    }
    currentPresentation.innerHTML =
      "<span class='topic-highlighted-text'>" + currentPresentation.innerHTML;

    let dotIndex = currentPresentation.innerHTML.indexOf(". ");
    currentPresentation.innerHTML =
      currentPresentation.innerHTML.slice(0, dotIndex) +
      "</span>" +
      currentPresentation.innerHTML.slice(dotIndex);

    this.#setHighlightHeight(currentPresentation);
  }

  #highlightToLeftDot(currentPresentation) {
    if (currentPresentation.innerHTML.includes("</span>")) {
      return;
    }
    let dotIndex = currentPresentation.innerHTML.indexOf(". ");
    currentPresentation.innerHTML =
      currentPresentation.innerHTML.slice(0, dotIndex + 2) +
      "<span class='topic-highlighted-text'>" +
      currentPresentation.innerHTML.slice(dotIndex + 2);
    currentPresentation.innerHTML += "</span>";

    this.#setHighlightHeight(currentPresentation);
  }

  #highlightUntilLeftDot(currentPresentation) {
    if (!currentPresentation) {
      return;
    }
    if (currentPresentation.tagName != "SPAN") {
      this.#highlightUntilLeftDot(currentPresentation.previousElementSibling);
      return;
    }
    let dotIndex = currentPresentation.innerHTML.indexOf(". ");
    if (dotIndex == -1) {
      this.#hightlightWholePresentation(currentPresentation);

      this.#highlightUntilLeftDot(currentPresentation.previousElementSibling);
    } else {
      this.#highlightToLeftDot(currentPresentation);
    }
  }

  #highlightUntilRightDot(currentPresentation) {
    if (!currentPresentation) {
      return;
    }
    if (currentPresentation.tagName != "SPAN") {
      this.#highlightUntilRightDot(currentPresentation.nextElementSibling);
      return;
    }
    let dotIndex = currentPresentation.innerHTML.indexOf(". ");
    if (dotIndex == -1) {
      this.#hightlightWholePresentation(currentPresentation);

      this.#highlightUntilRightDot(currentPresentation.nextElementSibling);
    } else {
      this.#hightlightToRightDot(currentPresentation);
    }
  }

  #setHighlightHeight(currentPresentation) {
    let newHighlight = currentPresentation.children[0];
    newHighlight.style.height = currentPresentation.style.fontSize;
  }
}

export { KeywordHighlighterComponent };
