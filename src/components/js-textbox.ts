export default class jsTextbox extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["type", "variation"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.classList.add("js-textbox");
		this.innerHTML = `<input class="js-textbox__input" type="text">
                          <div class="js-textbox__label">label for the input</div>`;
		this.addEventListener("click", () => {
			let textBox: HTMLElement | null = this.querySelector(".js-textbox__input");
			if (textBox == null) return;
			textBox.focus();
		});
	}
}
