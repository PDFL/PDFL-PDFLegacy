import {EventHandler, PDFLEvents} from './app-events.js';

class AppLoader {

    /**
     * @constructor
     * @param viewContainers (object) components of the view
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
        EventHandler.fireEvent(PDFLEvents.onAppStateChange, this.currentState);
    }

    /**
     * Switch from the uploader view to the reader one
     */
    showReader = () => {
        this.currentState = 'reader';
        this.viewContainers.readerView.hidden = false;
        this.viewContainers.uploadPage.hidden = true;
        EventHandler.fireEvent(PDFLEvents.onAppStateChange, this.currentState);

    }

}


export {AppLoader};

