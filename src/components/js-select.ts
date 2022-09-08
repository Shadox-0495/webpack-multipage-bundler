import "select2";
import Swal from "sweetalert2";
import { mergeObjects } from "@features/utils";
import { confSelect2, confSweetAlert } from "@features/configs";

export function serverSelect2(htmlSelect: JQuery<HTMLElement>, confArgs: any = {}, url: string, ajaxArgs: any = {}) {
	let conf: any = confSelect2(confArgs);
	if (conf.multiple) conf.dropdownCssClass = `${conf.dropdownCssClass} js-select2-dropdown--multiple`;
	let parentContainer = htmlSelect.parent();
	let type = htmlSelect.attr("data-type") || "";

	if (type == "db-dt-filter") {
		conf.ajax = {
			url: url,
			method: "POST",
			dataType: "json",
			cache: false,
			delay: 250,
			data: (d: any) => {
				d.limit = 10;
				d.search = d.term || "";
				d.page = d.page || 1;
				d = mergeObjects(d, ajaxArgs);
				return JSON.stringify(d);
			},
			processResults: (data: any) => {
				return {
					results: data.results,
					pagination: { more: data.more },
				};
			},
			fail: (jqXHR: any, textStatus: any, errorThrown: any) => {
				Swal.fire(confSweetAlert("", "error", `Error al cargar los datos del select ${textStatus} - ${errorThrown} - ${jqXHR.responseText}`, { timer: 2000 }));
			},
		};
	}

	htmlSelect.select2(conf);

	parentContainer.find(">.select2").addClass("js-select2");

	if (type == "db-dt-filter") return;
	htmlSelect.on("select2:open", () => {
		let searchField = $(".select2-search--dropdown>input[type='search']");
		//loop through all the search dropdowns and add the search icon if it doesn't exist
		$(".select2-search--dropdown").each((index, element) => {
			if ($(element).find(">.svg-icon").length === 0) {
				$(element).append("<div class='svg-icon'><svg viewBox='0 0 17 17'> <use xlink:href='#svg-search'></use></svg></div>");
			}
		});
		if (typeof htmlSelect.attr("data-search-placeholder") !== "undefined") {
			searchField.attr("placeholder", htmlSelect.attr("data-search-placeholder") || "");
		}
	});
}
