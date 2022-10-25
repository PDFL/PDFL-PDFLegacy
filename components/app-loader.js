class AppLoader {

    /**
     * @constructor
     * @param viewContainers (object) components of the view
     * @param onStateChange (function) callback for state change
     */
    constructor(viewContainers, onStateChange) {
        this.viewContainers = viewContainers;
        this.currentState = 'empty';
        this.onStateChange = onStateChange;
        this.initView();
    }

    /**
     * Initialize the view, show the file uploader and hide the reader
     */
    initView = () => {
        this.currentState = 'empty';
        this.viewContainers.readerView.hidden = true;
        this.viewContainers.uploadPage.hidden = false;
        this.onStateChange(this.currentState);
    }

    /**
     * Switch from the uploader view to the reader one
     */
    showReader = () => {
        this.currentState = 'reader';
        this.viewContainers.readerView.hidden = false;
        this.viewContainers.uploadPage.hidden = true;
        this.onStateChange(this.currentState);

    }

}


exports.AppLoader = AppLoader;

