import Handlebars from "handlebars";
import template from "@assets/templates/templates.html";
import { ajaxGET } from "@features/ajax";
let [templatesHtml, templatesError] = await ajaxGET(template, { contentType: "", dataType: "text", cache: true });
if (templatesError) console.log(`Error while fetching the templates:${templatesError}`);
templatesHtml = new DOMParser().parseFromString(templatesHtml, "text/html");

export default templatesHtml;

export function compileTemplate(templateID: string = "", templateData: any = {}) {
	if (templatesError || templateID === "") return "";
	let templateScript = $(templatesHtml).find(`#${templateID}`).html();
	let compileTemplate: any = Handlebars.compile(templateScript);
	if (Object.keys(templateData).length !== 0) compileTemplate = compileTemplate(templateData);
	return compileTemplate;
}

export function loadModals() {
	$("html")
		.find(`[data-modal]`)
		.each((i: Number, modalContainer: any) => {
			//check if the modal its already with all its content
			modalContainer = $(modalContainer);
			let { id, title, modal } = modalContainer.data();

			//if the modal will be loaded in the page's body, get the html template and add it to the body
			if (modalContainer.prop("tagName").toLowerCase() == "body") {
				if (modalContainer.find(`[data-modal="${modal}"]`).length > 0) return;
				modalContainer.append(templatesHtml.find(`[data-modal="${modal}"]`).clone());
				return;
			}

			//if the report will be loaded in the modal
			if (modalContainer.find(">*").length > 0) return;

			if (modalContainer.hasClass("js-modal")) {
				let templateScript = $(templatesHtml).find(`#modal`).html();
				let compileTemplate: any = Handlebars.compile(templateScript);
				compileTemplate = compileTemplate({ id, title });
				modalContainer.append(compileTemplate);
			}

			/*if (modal && modal != "") {
				modalContainer.find(".js-modal__content-body").append(templatesHtml.find(`[data-modal="${modal}"]`).clone());
			}*/
		});
}
