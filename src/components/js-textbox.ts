import { AsyncDependenciesBlock } from "webpack";

class jsTextbox extends HTMLElement {
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
		this.classList.add("js-textbox");
		this.innerHTML = `<input class="js-textbox__input" type="text">
                          <div class="js-textbox__label">lebel for the input</div>`;
	}
}

customElements.define("js-textbox", jsTextbox);
