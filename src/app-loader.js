import {EventBus, PDFLEvents} from './event-bus.js';

/**
 * This class manages the main ui state of the application.
 * In particular if a file exists and the reader has to be shown or if the upload screen has to be displayed.
 */
class AppLoader {

    /**
     * @constructor
     * @param viewContainers (object) src of the view
     */
    constructor(viewContainers) {
        this.viewContainers = viewContainers;
        this.currentState = 'empty';
        this.initView();
    }

    /**
     * Initialize the view, show the file uploader and hide the reader
     */
    initView = () => {
        this.currentState = 'empty';
        this.viewContainers.readerView.hidden = true;
        this.viewContainers.uploadPage.hidden = false;
        EventBus.publish(PDFLEvents.onAppStateChange, this.currentState);
    }

    /**
     * Switch from the uploader view to the reader one
     */
    showReader = () => {
        this.currentState = 'reader';
        this.viewContainers.readerView.hidden = false;
        this.viewContainers.uploadPage.hidden = true;
        EventBus.publish(PDFLEvents.onAppStateChange, this.currentState);

    }

}


export {AppLoader};

