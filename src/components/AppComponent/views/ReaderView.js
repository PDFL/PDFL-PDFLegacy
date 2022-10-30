import { DefaultView } from './DefaultView.js';

class ReaderView extends DefaultView {

    init = () => {
        this.components.defaultView.hidden = true;
        this.components.readerView.hidden = false;
    }
}

export { ReaderView }