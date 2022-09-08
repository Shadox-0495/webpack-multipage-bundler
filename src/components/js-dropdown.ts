import { htmlStringToFragment } from "@features/utils";

export default class jsDropDown extends HTMLElement {
	constructor() {
		super();
	}

	static get observedAttributes() {
		return ["data-icon", "data-viewbox", "data-label", "data-drop", "data-class", "data-menu-class"];
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.classList.add("js-dropdown");
		let dropdownIcon = this.getAttribute("data-icon") || "";
		let dropdownIconViewbox = this.getAttribute("data-viewbox") || "";
		let dropdownLabel = this.getAttribute("data-label") || "";
		let childs = htmlStringToFragment(this.innerHTML);
		this.innerHTML = `<div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'>
                                ${
									dropdownIcon == "" && dropdownIconViewbox == ""
										? ""
										: `<div class="svg-icon">
                                            <svg viewBox="${dropdownIconViewbox}"> <use xlink:href="${dropdownIcon}"></use></svg>
                                           </div>`
								}
                                ${dropdownLabel == "" ? "" : `<span>${dropdownLabel}</span>`}
                          </div>
                          <div class='js-dropdown__menu'></div>`;
		let menu: HTMLElement | null = this.querySelector(".js-dropdown__menu");
		if (menu === null) return;
		menu.appendChild(childs);
		for (let child of Array.from(menu?.children)) {
			child.classList.add("js-dropdown__menu-item");
		}
	}
}
