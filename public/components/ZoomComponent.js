class ZoomElements extends HTMLElement {

	constructor() {
		super();
		this.zoomFactor = 1;
	}

	zoomIn() {
		this.zoomFactor *= 4 / 3;
		this.setAttribute('zoomFactor', this.zoomFactor);
	}

	zoomOut() {
		this.zoomFactor *= 2 / 3;
		this.setAttribute('zoomFactor', this.zoomFactor);
	}

	connectedCallback() {
		this.render();

		this.querySelector('#zoom_in').addEventListener('click', this.zoomIn.bind(this));
		this.querySelector('#zoom_out').addEventListener('click', this.zoomOut.bind(this));
	}

	disconnectedCallback() {
		console.log('disconnected', this);
	}

	render() {
		this.innerHTML =
			`<button class="zoom" id="zoom_in">
				<i class="fas fa-search-plus"></i>
			</button>
			<button class="zoom" id="zoom_out">
				<i class="fas fa-search-minus"></i>
			</button>`;
	}

}

customElements.define('zoom-buttons', ZoomElements);