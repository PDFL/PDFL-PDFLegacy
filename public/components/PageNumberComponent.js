class PageNumberComponent extends HTMLElement {

    constructor() {
        super();
        this.currentPage = 1;
    }

    getMaxPageNumber() {
        return parseInt(this.getAttribute('maxPageNumber'));
    }

    showPrevPage() {
        if (this.currentPage <= 1) return;
        this.currentPage--;

        this.querySelector('#current_page').value = this.currentPage;
        this.querySelector('#page_num').textContent = this.currentPage;
    }

    showNextPage() {
        if (this.currentPage >= this.getMaxPageNumber()) return;
        this.currentPage++;

        this.querySelector('#current_page').value = this.currentPage;
        this.querySelector('#page_num').textContent = this.currentPage;
    }

    keyPressed(event) {
        const keycode = event.keyCode ? event.keyCode : event.which;

        if (keycode != 13) return;

        let newValue = this.querySelector('#current_page').value;
        newValue = newValue === "" ? 1 : parseInt(newValue);

        this.currentPage = Math.min(
            Math.max(newValue, 1),
            this.getMaxPageNumber()
        );

        this.querySelector('#current_page').value = this.currentPage;
        this.querySelector('#page_num').textContent = this.currentPage;
    }

    connectedCallback() {
        this.render();

        this.querySelector('#page_num').textContent = this.currentPage;
        this.querySelector('#prev_page').addEventListener('click', this.showPrevPage.bind(this));
        this.querySelector('#next_page').addEventListener('click', this.showNextPage.bind(this));
        this.querySelector('#current_page').addEventListener('keypress', this.keyPressed.bind(this));
    }

    disconnectedCallback() {
        console.log('disconnected', this);
    }

    render() {
        this.innerHTML =
            `<a href="#" class="previous round" id="prev_page">
                <i class="fas fa-arrow-left"></i>
            </a>
            <input type="number" value="1" id="current_page" />
            <a href="#" class="next round" id="next_page">
                <i class="fas fa-arrow-right"></i>
            </a>
            Page <span id="page_num"></span> of <span id="page_count"></span>`;
    }

}

customElements.define('page-number', PageNumberComponent);