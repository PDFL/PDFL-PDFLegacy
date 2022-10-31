import {FileUpload} from '../../FileUploadComponent';
import { AppView } from './AppView.js';

class InputView extends AppView{

    static fileUpload = new FileUpload();

    component = document.getElementById('input-page');

}
export { InputView };