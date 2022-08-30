import { mergeObjects, confSweetAlert } from "@features/configs";
import Swal from "sweetalert2";

export async function ajaxGET(data: any = {}, url: string, args: JQueryAjaxSettings = {}) {
	let obj: JQueryAjaxSettings = { type: "GET", url: url };
	if (Object.keys(data).length !== 0) obj.data = JSON.stringify(data);
	obj = mergeObjects(obj, args);
	return createAjax(obj);
}

export async function ajaxPOST(data: any = {}, url: string, args: JQueryAjaxSettings = {}) {
	let obj: JQueryAjaxSettings = { type: "POST", url: url };
	if (Object.keys(data).length !== 0) obj.data = JSON.stringify(data);
	obj = mergeObjects(obj, args);
	return createAjax(obj);
}

export async function ajaxPUT(data: any = {}, url: string, args: JQueryAjaxSettings = {}) {
	let obj: JQueryAjaxSettings = { type: "PUT", url: url };
	if (Object.keys(data).length !== 0) obj.data = JSON.stringify(data);
	obj = mergeObjects(obj, args);
	return createAjax(obj);
}

export async function ajaxDELETE(data: any = {}, url: string, args: JQueryAjaxSettings = {}) {
	let obj: JQueryAjaxSettings = { type: "DELETE", url: url };
	if (Object.keys(data).length !== 0) obj.data = JSON.stringify(data);
	obj = mergeObjects(obj, args);
	return createAjax(obj);
}

export async function createAjax(args: JQueryAjaxSettings = {}) {
	let obj = {
		dataType: "json",
		contentType: "application/json; charset=utf-8",
		timeout: 3000,
	};
	obj = mergeObjects(obj, args);
	try {
		let resp = await $.ajax(obj);
		return [resp, null];
	} catch (e: any) {
		Swal.fire(confSweetAlert("Ajax request error", "error", e.responseText, { timer: 3000 }));
		return [null, e];
	}
}
