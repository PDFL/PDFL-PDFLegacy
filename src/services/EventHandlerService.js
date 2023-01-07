/**
 * This class represents the event bus across the application, it manages subscribers and publishers for each type of event.
 */
class EventHandlerService {
  static eventObject = [];

  /**
   * This function rise an event and all the registered callbacks are called.
   * @param event the event which has to fire
   * @param args arguments for the callback function
   */
  static publish(event, ...args) {
    if (!this.eventObject[event]) {
      return;
    }

    this.eventObject[event].forEach((callback) => {
      callback(...args);
    });
  }

  /**
   * Register a new callback for a specific event
   * @param event
   * @param callback callback function
   */
  static subscribe(event, callback) {
    if (!this.eventObject[event]) {
      this.eventObject[event] = [];
    }
    this.eventObject[event].push(callback);
  }
}

/**
 * Enum of possible event type (to avoid typos)
 * @type {{onShowInputView: string, onShowReaderView: string, onRenderPage: string, onShowKnowledgeGraph: string,
 * onResetReader: string, onReadNewFile: string, onShowTransparentSidePageLoader: string, onShowOpaqueSidePageLoader: string,
 * onHideSidePageLoader: string, onShowSidePageError: string, onShowHighlightTutorialWindow: string, onShowGraphTutorialWindow: string, onShowSummaryTutorialWindow: string
 * onHideTutorialWindow: string, 
 * onHideSidePageLoader: string, onShowSidePageError: string, onCreateThumbnail: string, onToggleThumbnail:string,
 * onPageChanged: string}}
 */
const PDFLEvents = {
  onShowWelcomeView: "onShowWelcomeView",
  onShowInputView: "onShowInputView",
  onShowReaderView: "onShowReaderView",
  onRenderPage: "onRenderPage",
  onShowKnowledgeGraph: "onShowKnowledgeGraph",
  onResetReader: "onResetReader",
  onReadNewFile: "onReadNewFile",
  onLinkLayerRendered: "onLinkLayerRendered",
  onNewPageRequest: "onNewPageRequest",
  onPopupContentReady: "onPopupContentReady",
  onReferencePdfOpen: "onReferencePdfOpen",
  onShowTransparentSidePageLoader: "onShowTransparentSidePageLoader",
  onShowOpaqueSidePageLoader: "onShowOpaqueSidePageLoader",
  onHideSidePageLoader: "onHideSidePageLoader",
  onShowSidePageError: "onShowSidePageError",
  onKeyboardKeyUp: "onKeyboardKeyUp",
  onKeyboardKeyDown: "onKeyboardKeyDown",
  onKeyboardKeyPress: "onKeyboardKeyPress",
  onZoomChange: "onZoomChange",
  onShowSummaryKey: "onShowSummaryKey",
  onTextSelectionReady: "onTextSelectionReady",
  onOpenSelectionSummary: "onOpenSelectionSummary",
  onShowHighlightTutorialWindow: "onShowHighlightTutorialWindow",
  onShowGraphTutorialWindow: "onShowGraphTutorialWindow",
  onShowSummaryTutorialWindow: "onShowSummaryTutorialWindow",
  onHideTutorialWindow: "onHideTutorialWindow",
  onCreateThumbnail: "onCreateThumbnail",
  onToggleThumbnail: "onToggleThumbnail",
  onPageChanged: "onPageChanged",
};

export { PDFLEvents, EventHandlerService };
