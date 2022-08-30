export {};
class jsModal extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["type"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		let content = this.innerHTML;
		this.classList.add("js-modal");
		this.innerHTML = `<div class="js-modal__content">
                            <div class="js-modal__content-header">
                                <h5 class="js-modal__content-header-title"></h5>
                                <button class="js-modal__content-header-close-btn" data-type="danger" data-toggle="modal" data-target="">X</button>
                            </div>
                            <div class="js-modal__content-body">${content}</div>
                            <div class="js-modal__content-footer"></div>
                        </div>`;
	}
}

customElements.define("js-modal", jsModal);
