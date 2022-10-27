import {PDFLEvents, EventBus} from "../event-bus";


/**
 * This class contains the logic to zoom in and out a pdf page
 */
class ZoomComponent {

    /**
     * Class constructor
     * @param viewComponents the components
     * @param readerState the application state reference
     */
    constructor(viewComponents, readerState) {
        this.viewComponents = viewComponents;
        this.readerState = readerState;
        this.#setListener();
    }

    /**
     * Add listener to html components
     */
    #setListener = () => {
        this.viewComponents.zoomIn.addEventListener('click', this.#zoomIn.bind(this));
        this.viewComponents.zoomOut.addEventListener('click', this.#zoomOut.bind(this));
    }

    /**
     * Callback for zoom in event
     * @param event
     */
    #zoomIn = (event) => {
        if (this.readerState.document === null) return;
        this.readerState.zoom *= 4 / 3;
        EventBus.publish(PDFLEvents.onRenderRequest);
    }

    /**
     * Callback for the zoom out action
     * @param event
     */
    #zoomOut = (event) => {
        if (this.readerState.document === null) return;
        this.readerState.zoom *= 2 / 3;
        EventBus.publish(PDFLEvents.onRenderRequest);
    }
}

export {ZoomComponent}