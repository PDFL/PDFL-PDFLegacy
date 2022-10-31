import {FileUpload} from '../../FileUploadComponent';
import { AppView } from './AppView.js';

class DefaultView extends AppView{

    static fileUpload = new FileUpload();

    component = document.getElementById('welcome-page');

}
export { DefaultView };