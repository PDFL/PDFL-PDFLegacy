import { FileUploadComponent } from '../../FileUploadComponent';
import { AppView } from './AppView.js';

class InputView extends AppView {

    static FileUploadComponent = new FileUploadComponent();

    component = document.getElementById('input-page');

}

export { InputView };