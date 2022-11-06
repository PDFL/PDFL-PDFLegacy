import { AppView } from './AppView.js';
import { EventHandlerService, PDFLEvents } from "../../../services/EventHandlerService.js";

class WelcomeView extends AppView {

    components = {
        view: document.getElementById('welcome-page'),
        buttonFile: document.getElementById("button-file")
    }

    init() {
        this.cleanView();
        this.components.view.hidden = false;
        this.#registerEvents();
    }

    /**
     * Add event listeners for welcome view
     */
    #registerEvents = () => {
        this.components.buttonFile.addEventListener('click', this.#changeView);
    }

    /**
    /*Function for button listener to change view
    */
    #changeView = () => {
        EventHandlerService.publish(PDFLEvents.onShowInputView);
    }

}

export { WelcomeView }