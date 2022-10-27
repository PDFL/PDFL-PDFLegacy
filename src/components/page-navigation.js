import {EventBus, PDFLEvents} from "../event-bus";
import {ReaderState} from "../pdf-reader";

class PageNavigation extends HTMLElement {

    constructor(container) {
        super();
        this.container = container;
        this.initComponent()
        this.render()
    }

    initComponent() {
        const prevButton = document.createElement("a");
        prevButton.setAttribute("class", "btn");
        prevButton.innerHTML = "<i class=\"fas fa-arrow-left\"></i>";
        prevButton.addEventListener('click', this.showPrevPage.bind(this));
        this.prevButton = prevButton;


        const nextButton = document.createElement("a");
        nextButton.setAttribute("class", "btn");
        nextButton.innerHTML = "<i class=\"fas fa-arrow-right\"></i>";
        nextButton.addEventListener('click', this.showNextPage.bind(this));
        this.nextButton = nextButton;



        const pageNumber = document.createElement("input");
        pageNumber.setAttribute("type", "number");
        pageNumber.value = ReaderState.currentPage;
        pageNumber.addEventListener('keypress', this.keyPressed.bind(this));
        this.pageNumber = pageNumber;
    }

    showPrevPage() {
        if (ReaderState.currentPage <= 1){
            return;
        }
        ReaderState.currentPage--;

        this.pageNumber.value = ReaderState.currentPage;
        //this.querySelector('#page_num').value = this.currentPage;
        EventBus.fireEvent(PDFLEvents.onRenderRequest);
    }

    showNextPage() {
        if (ReaderState.currentPage >= ReaderState.pageCount) {
            //return;
        }
        ReaderState.currentPage++;

        this.pageNumber.value = ReaderState.currentPage;
        //this.querySelector('#page_num').value = this.currentPage;
        EventBus.fireEvent(PDFLEvents.onRenderRequest);
    }

    keyPressed(event) {
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode != 13) return;

        let newValue = this.pageNumber.value;
        newValue =  newValue === "" ? 1 : parseInt(newValue);

        ReaderState.currentPage = Math.min(
            Math.max(parseInt(newValue), 1),
            ReaderState.pageCount
        );

        this.pageNumber.value = ReaderState.currentPage;
        //this.querySelector('#page_num').value = ReaderState.currentPage;
        EventBus.fireEvent(PDFLEvents.onRenderRequest);
    }


    render() {
        this.container.appendChild(this.prevButton);
        this.container.appendChild(this.pageNumber);
        this.container.appendChild(this.nextButton);
    }

}

export {PageNavigation};

customElements.define('page-navigation', PageNavigation);