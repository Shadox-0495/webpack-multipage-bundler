import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "air-datepicker/air-datepicker.css";
import "@sass/index.scss";
import { parentNode } from "@features/utils";

export const actions: any = {
	state: {
		open: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement>) => {
			console.log($el);
		},
		beforeOpen: ($el: JQuery<HTMLElement>) => {
			if ($el.hasClass("open")) {
				actions.state.close($el);
				return;
			}
			actions.state.open($el);
		},
	},
	modal: {
		open: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement>) => {
			if ($el.hasClass("open")) {
				actions.modal.close($el);
				return;
			}
			actions.modal.open($el);
		},
	},
	dropdown: {
		open: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement>) => {
			if ($el.hasClass("open")) {
				actions.dropdown.close($el);
				return;
			}
			actions.dropdown.beforeOpen();
			actions.dropdown.open($el);
		},
		beforeOpen: () => {
			$(".js-dropdown.open").each((index, element) => {
				actions.dropdown.close($(element));
				//if (!$(element).is($el)) {}
			});
		},
	},
	collapse: {
		open: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("close").addClass("open");
		},
		close: ($el: JQuery<HTMLElement>) => {
			$el.removeClass("open").addClass("close");
		},
		toggle: ($el: JQuery<HTMLElement>) => {
			if ($el.hasClass("open")) {
				actions.collapse.close($el);
				return;
			}
			actions.collapse.beforeOpen();
			actions.collapse.open($el);
		},
		beforeOpen: () => {
			$(".js-collapse.open").each((index, element) => {
				actions.collapse.close($(element));
				//if (!$(element).is($el)) {}
			});
		},
	},
};

document.addEventListener("click", (Event) => {
	let clickedElement: any = Event.target;

	if (clickedElement.closest("[data-toggle]")) {
		//get the clicked element
		let el: JQuery<HTMLElement> = $(clickedElement).closest("[data-toggle]");
		let $target: any = el.attr("data-target") || el;
		let htmlEvent: string = el.attr("data-toggle") || "";
		//check if the element has a data-toggle attribute otherwise return the same element

		//if the target is a string
		if (typeof $target === "string") {
			//check if the string contain parent, get the parent element
			if ($target.indexOf("parent") !== -1) {
				let num = parseInt($target.split("(")[1].slice(0, -1));
				$target = parentNode(el, num);
			} else {
				//else get the element by the selector
				$target = $($target);
			}
		}
		//based on the data-toggle attribute get the action
		actions[htmlEvent].toggle($target);
	}

	if (!clickedElement.closest("[data-toggle]")) {
		actions.dropdown.beforeOpen();
	}
});
