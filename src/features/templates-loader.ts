import Handlebars from "handlebars";
import template from "@assets/templates/templates.html";
import { ajaxGET } from "@features/ajax";
let [templatesHtml, templatesError] = await ajaxGET(template, { contentType: "", dataType: "text" });
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
