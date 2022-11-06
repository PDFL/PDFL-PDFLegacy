import { AppView } from './AppView.js';
import { PdfReaderComponent } from '../../PdfReaderComponent.js';

class ReaderView extends AppView {

    static reader = new PdfReaderComponent();

    component = document.getElementById('pdf-viewer');

}

export { ReaderView }