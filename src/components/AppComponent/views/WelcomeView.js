import { AppView } from './AppView.js';
import { EventHandlerService, PDFLEvents } from "../../../services/EventHandlerService.js";


class WelcomeView extends AppView {

    component = document.getElementById('welcome-page');
    button = document.getElementById('button-file');

    Components = {
        buttonFile: document.getElementById("button-file"),
    }

    init() {
        this.cleanView();
        this.component.hidden = false;
        this.#registerEvents();
    }

    /**
     * Add event listeners for welcome view
     */
     #registerEvents = () => {
        this.Components.buttonFile.addEventListener('click', this.#changeView);
    }

    /**
    /*Function for button listener to change view
    */
    #changeView = () => {
        EventHandlerService.publish(PDFLEvents.onShowInputView);
    }



}

export { WelcomeView }