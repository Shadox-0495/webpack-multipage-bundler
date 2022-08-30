export function mergeObjects(target: any, args: any) {
	if (Object.keys(args).length === 0) return target;
	let merge = Object.assign(target, args);
	return merge;
}

export function confDataTables(args: Object = {}) {
	let conf = {
		order: [[0, "desc"]],
		dom: `<'js-dt-toolbar'
					f
					<'js-dt-toolbar__add'>
					<'js-dt-toolbar__filter'>
					<'js-dt-toolbar__export js-dropdown'B>
					<'js-dt-toolbar__info'li>
			   >
			   <t>
			   p`,
		pagingType: "full_numbers",
		deferRender: true,
		processing: true,
		pageLength: parseInt(localStorage.getItem("dtRecordsLength") || "10"),
		serverSide: true,
		ajax: {
			type: "POST",
			datatype: "json",
			error: (xhr: XMLHttpRequest) => {
				if (xhr.status >= 200 && xhr.status <= 299) {
					return;
				}
				console.log(`HTTP request error: ${xhr.status}`);
			},
		},
		responsive: {
			details: {
				renderer: (api: DataTables.Api, rowIdx: number, columns: DataTables.ColumnMethods) => {
					let data = $.map(columns, (col: any, i) => {
						//let hidden = typeof $($htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") !== "undefined" ? $(htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") : "-1";
						return col.hidden ? `<tr data-dt-row='${col.rowIndex}' data-dt-column='${col.columnIndex}'><td>${col.title}:</td><td>${col.data}</td></tr>` : "";
					}).join("");
					return data ? $("<div class='slider' />").append($("<table class='js-datatable__details' />").append(data)) : false;
				},
				display: (row: DataTables.RowMethods, update: Boolean, render: Function) => {
					if (update) return;

					if (row.child.isShown()) {
						$("div.slider", row.child()).slideUp(225, () => {
							row.child(false);
							$(row.node()).removeClass("parent shown");
						});
						return;
					}

					if (!row.child.isShown()) {
						row.child(render(), "child").show();
						$(row.node()).addClass("parent shown");
						$("div.slider", row.child()).slideDown(225);
						return;
					}
				},
			},
		},
		error: () => {
			return "asd";
		},
		language: {
			lengthMenu: "_MENU_",
			paginate: {
				first: `<i class="fa-solid fa-angles-left"></i>`,
				previous: `<i class="fa-solid fa-angle-left"></i>`,
				next: `<i class="fa-solid fa-angle-right"></i>`,
				last: `<i class="fa-solid fa-angles-right"></i>`,
			},
			infoEmpty: "Sin registros.",
			zeroRecords: "Sin registros.",
			info: "_START_ - _END_ de _TOTAL_",
			search: "",
			searchPlaceholder: "Buscar",
			infoFiltered: "(_MAX_)",
			loadingRecords: "Cargando...",
			aria: { sortAscending: ": Order asc.", sortDescending: ": Order desc." },
		},
		columnDefs: [{ targets: 0, class: "dtDetails" }],
		buttons: {
			dom: { container: { className: "js-dropdown__menu" } },
			buttons: [
				{
					extend: "excelHtml5",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-1 -1.5 15 18"> <use xlink:href="#svg-excel-file"></use></svg></div><span>Excel</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
				},
				{
					extend: "csvHtml5",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-1 -1.5 15 18"> <use xlink:href="#svg-file-alt"></use></svg></div><span>CSV</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
				},
				{
					extend: "print",
					title: "",
					className: "dtExport",
					text: `<div class="svg-icon"><svg viewBox="-0.5 0 16 16"> <use xlink:href="#svg-print"></use></svg></div><span>Imprimir</span>`,
					exportOptions: { columns: "th:not([data-export='n'])" },
					customize: (win: Window) => {
						$(win.document.body).css("font-size", "0.95rem");
						$(win.document.body).find("h1").remove();
						$(win.document.body).find("div").remove();
					},
				},
			],
		},
	};
	return mergeObjects(conf, args);
}

export function confSweetAlert(
	title: String = "",
	icon: String = "info",
	html: String = "<div class='js-loading-spinner'><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>",
	args: Object = {}
) {
	let obj = { title: title, icon: icon, html: html, showConfirmButton: false, showCancelButton: false, allowOutsideClick: false, cancelButtonText: "Cancelar" };
	return (obj = mergeObjects(obj, args));
}
export function confDatePicker(args: Object = {}) {
	let obj = {
		format: "Y/m/d",
		timepicker: false,
		mask: true,
		scrollInput: false,
		className: "js-datepicker",
		onGenerate: function () {
			$(this).find(".xdsoft_today_button").html("<div></div>");
		},
	};
	return mergeObjects(obj, args);
}
export function confDropZone(args: Object = {}) {
	let obj = {
		url: "api/api.php",
		method: "POST",
		acceptedFiles: "image/*",
		maxFiles: 1,
		autoProcessQueue: false,
		addRemoveLinks: true,
		dictDefaultMessage: "Haga click aqui para buscar el archivo, o arrastre el archivo aqui.",
		dictFileTooBig: "El archivo es muy pesado.",
		dictInvalidFileType: "Archivo incorrecto, solo se aceptan imagenes.",
		dictCancelUpload: "<i class='fa-solid fa-ban'></i>",
		dictRemoveFile: "<i class='fa-solid fa-circle-xmark'></i>",
		dictMaxFilesExceeded: "Se excedio la cantidad maxima de archivos.",
		renameFile: (file: File) => {},
		init: (file: File) => {},
	};
	return mergeObjects(obj, args);
}
export function confSelect2(args: Object = {}) {
	let obj = {
		dropdownCssClass: "js-select2-dropdown",
		multiple: false,
		placeholder: "Seleccione una opcion",
		allowClear: false,
		language: {
			errorLoading: () => {
				return "Error al cargar";
			},
			inputTooLong: () => {
				return "Muy largo";
			},
			inputTooShort: () => {
				return "Muy Corto";
			},
			loadingMore: () => {
				return "Cargando mas";
			},
			maximumSelected: () => {
				return "Maximo selecionados";
			},
			noResults: () => {
				return "Sin resultados";
			},
			searching: () => {
				return "Buscando...";
			},
		},
	};
	return mergeObjects(obj, args);
}
