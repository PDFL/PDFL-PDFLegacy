class AppLoader {

    constructor(onStateChange) {
        this.currentState = 'empty';
        this.onStateChange = onStateChange;
        this.uploadPage = document.getElementById('welcome-page');
        this.readerView = document.getElementById("pdf-viewer");
        this.initView();
    }

    initView = () => {
        this.currentState = 'empty';
        this.readerView.hidden = true;
        this.uploadPage.hidden = false;
        this.onStateChange(this.currentState);
    }

    showReader = () => {
        this.currentState = 'reader';
        this.readerView.hidden = false;
        this.uploadPage.hidden = true;
        this.onStateChange(this.currentState);
    }

}

exports.AppLoader = AppLoader;
