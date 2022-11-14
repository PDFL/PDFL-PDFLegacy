import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

class ZoomComponent {

    components = {
        zoomIn: document.querySelector('#zoom-in'),
        zoomOut: document.querySelector('#zoom-out'),
    }

    constructor() {
        this.setZoom(1);
        this.#registerEvents();
    }
    
    setZoom = (zoom) => {
        this.zoom = zoom;
    }

    getZoom = () => {
        return this.zoom;
    }

    #registerEvents = () => {
        this.components.zoomIn.addEventListener('click', this.#zoomIn);
        this.components.zoomOut.addEventListener('click', this.#zoomOut);
    }

    /**
     * Callback for zoom in event
     */
    #zoomIn = () => {
        this.zoom *= 4 / 3;
        EventHandlerService.publish(PDFLEvents.onRenderPage);
    }

    /**
     * Callback for the zoom out action
     */
    #zoomOut = () => {
        this.zoom *= 2 / 3;
        EventHandlerService.publish(PDFLEvents.onRenderPage);
    }

}

export { ZoomComponent };