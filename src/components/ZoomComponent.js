import { EventHandlerService, PDFLEvents } from "../services/EventHandlerService";

class ZoomComponent {

    components = {
        zoomIn: document.querySelector('#zoom_in'),
        zoomOut: document.querySelector('#zoom_out'),
    }

    constructor() {
        if (ZoomComponent._instance) {
            ZoomComponent._instance.init();
            return ZoomComponent._instance;
        }
        ZoomComponent._instance = this;

        this.init();
        this.#registerEvents();
    }

    init = () => {
       this.zoom = 1;
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

    getZoom = () => {
        return this.zoom;
    }

}

export { ZoomComponent };