import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "datatables.net";
import "datatables.net-responsive";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

export default async function dataTable($htmlTable, url, ajaxArgs = {}) {
	if ($htmlTable.length == 0 || $htmlTable.length > 1) return;
	let type = $htmlTable.attr("data-type");
	if (!type) return;
	let tableId = $htmlTable.attr("id");
	let tableStart = $htmlTable.offset().top - 5;
	let totalRecords = 0;
	let columns = [];
	let conf = {};

	$htmlTable.find("thead>tr>th").each((index, header) => {
		header = $(header);
		let { name, type } = header.data();
		header.attr("data-num", index);
		//replace the spaces in the name for underscore for backend purpose.
		if (!name) {
			name = header.text() != "" ? header.text().replace(" ", "_") : "-1";
			header.attr("data-name", name);
		}
		columns.push({ name, num: index, text: header.text(), type: type ? type : "-1" });
	});

	conf = {
		drawCallback: (settings) => {
			if (settings._iDisplayStart != tableStart) {
				var targetOffset = tableStart;
				if ($("body").scrollTop() > targetOffset) $("body").animate({ scrollTop: targetOffset }, 500);
			}
		},
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
		pageLength: parseInt(localStorage.getItem("dtRecordsLength") || 10),
		/*serverSide: true,
		ajax: {
			type: "POST",
			url: url,
			data: (d) => {
				if (Object.keys(ajaxArgs).length !== 0) {
					for (const key in ajaxArgs) {
						d[key] = ajaxArgs[key];
					}
				}
				d.totalRecords = totalRecords;
				//d.filters = getFilters(`#dtFilter_${tableId}`);
				//d.filters = filter.get();
				return JSON.stringify(d);
			},
			dataSrc: function (d) {
				if (totalRecords == 0) {
					totalRecords = d.recordsTotal;
				}
				d.recordsTotal = totalRecords;
				return d.data;
			},
			beforeSend: function () {
				if ($htmlTable.find("tbody tr.js-datatable__loading").length !== 0) {
					return;
				}
				let loadingSpinner = `<tr class='js-datatable__loading' style='${$htmlTable.find("tbody>tr").length <= 0 ? "height:10rem;" : ""}' >
                                        <td colspan='${$htmlTable.find(">thead th").length}'>
                                            <div class='js-loading-spinner-pseudo' data-type='full-space' data-effect='blur'></div>
                                        </td>
                                      </tr>`;
				if ($htmlTable.find("tbody>tr").length > 0) {
					$htmlTable.find("tbody").prepend(loadingSpinner);
				} else {
					$htmlTable.find("tbody").html(loadingSpinner);
				}
			},
			datatype: "json",
			error: (xhr, status, error) => {
				if (xhr.status >= 200 && xhr.status <= 299) {
					return;
				}
				console.log(`HTTP request error: ${xhr.status}`);
			},
		},*/
		responsive: {
			details: {
				renderer: (api, rowIdx, columns) => {
					let data = $.map(columns, (col, i) => {
						//let hidden = typeof $($htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") !== "undefined" ? $(htmlTable.find(`thead>tr>th[data-num='${col.columnIndex}']`)[0]).attr("data-hidden") : "-1";
						return col.hidden ? `<tr data-dt-row='${col.rowIndex}' data-dt-column='${col.columnIndex}'><td>${col.title}:</td><td>${col.data}</td></tr>` : "";
					}).join("");
					return data ? $("<div class='slider' />").append($("<table class='js-datatable__details' />").append(data)) : false;
				},
				display: (row, update, render) => {
					if (update) {
						return;
					}

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
		columnDefs: [
			{ targets: 0, class: "dtDetails" },
			{
				targets: -1,
				width: "1px",
				orderable: false,
				searchable: false,
				data: null,
				class: "js-datatable-actions",
				render: () => {
					return `<div class='js-dropdown drop-down-left'>
                    <div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'>
						<div class="svg-icon">
							<svg viewBox="-6.5 -1.5 16 16"> <use xlink:href="#svg-ellipsis-v"></use></svg>
						</div>
                    </div>
                    <div class='js-dropdown__menu'>
                      ${$("html").attr("data-eliminar") ? `<a class='js-dropdown__menu-item' data-cmd='Eliminar'><div class="svg-icon"><svg viewBox="-1.5 0 16 16"> <use xlink:href="#svg-delete"></use></svg></div>Eliminar</a>` : ""}
                      ${$("html").attr("data-modificar") ? `<a class='js-dropdown__menu-item' data-cmd='Modificar'><div class="svg-icon"><svg viewBox="0 0 16.5 18"> <use xlink:href="#svg-edit"></use></svg></div>Modificar</a>` : ""}
                    </div>
                  </div>`;
				},
			},
		],
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
					customize: (win) => {
						$(win.document.body).css("font-size", "0.95rem");
						$(win.document.body).find("h1").remove();
						$(win.document.body).find("div").remove();
					},
				},
			],
		},
	};

	function getColumn(columnName) {
		return columns
			.filter((column, index) => {
				return column.name == columnName;
			})
			.map((column) => parseInt(column.num));
	}

	return {
		conf,
		getColumn,
		initTable: () => {
			//create the DataTable object
			let dataTable = $htmlTable.DataTable(conf);
			//reference the DataTable's wrapper
			let dataTableContainer = $htmlTable.closest(".dataTables_wrapper");
			dataTableContainer.addClass("js-dt-wrapper").attr("data-view", "records");
			return dataTable;
			/*dataTable.on("error.dt", function (e, settings, techNote, message) {
				Swal.fire(cFormats.sweetalert("", "error", message, { showConfirmButton: true }));
				return;
			});
			$(`#dtFilter_${tableId}`)
				.find("[data-cmd='apply-filters']")
				.attr({ "data-toggle": "modal", "data-target": `#dtFilter_${tableId}` })
				.on("click", () => {
					dataTable.ajax.reload();
				});
			dataTableContainer.find(".dataTables_filter>label").prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`); //adds search icon
			dataTableContainer.find(".dataTables_filter input").addClass("js-dt-toolbar__search");
			dataTableContainer
				.find(".js-dt-toolbar__export")
				.prepend(`<div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'><div class="svg-icon"><svg viewBox="0 0 18 18"> <use xlink:href="#svg-download"></use></svg></div><span>Exportar</span></div>`);
			dataTableContainer.find(".dt-button").addClass("js-dropdown__menu-item");
			dataTableContainer
				.find(".js-dt-toolbar__filter")
				.append(
					`<div class="svg-icon">
						<svg viewBox="0 0 17 17"> <use xlink:href="#svg-filter"></use></svg>
					 </div>
					 <span>Filtros</span>`
				)
				.attr({ "data-toggle": "modal", "data-target": `#dtFilter_${tableId}` });
			dataTableContainer.find(".js-dt-toolbar__add").append(`<div class="svg-icon"><svg viewBox="-1 -1.5 15 15"> <use xlink:href="#svg-plus"></use></svg></div><span>Nuevo registro</span>`);
			return dataTable;*/
		},
	};
}
