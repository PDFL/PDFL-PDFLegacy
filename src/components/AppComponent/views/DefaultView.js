import {FileUpload} from '../../FileUploadComponent';

class DefaultView {

    static fileUpload = new FileUpload();

    components = {
        defaultView: document.getElementById('welcome-page'),
        readerView: document.getElementById("pdf-viewer")
    }

    init = () => {
        this.components.defaultView.hidden = false;
        this.components.readerView.hidden = true;
    }

}
export { DefaultView };