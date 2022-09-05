import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "datatables.net";
import "datatables.net-responsive";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import { mergeObjects, confDataTables, confSweetAlert } from "@features/configs";

import Swal from "sweetalert2";

export async function dataTable($htmlTable: JQuery, url: string = "", ajaxArgs: any = {}) {
	if ($htmlTable.length == 0 || $htmlTable.length > 1 || typeof $htmlTable == undefined) return;
	let type = $htmlTable.attr("data-type");
	if (!type) return;

	let tableId = $htmlTable.attr("id");
	//let tableStart = $htmlTable.offset().top - 5;
	let totalRecords = 0;

	let columns = $htmlTable.find("thead>tr>th").map((index, colHeader) => {
		let { name, type } = $(colHeader).data();
		$(colHeader).attr("data-num", `${index}`);
		//replace the spaces in the name for underscore for backend purpose.
		if (!name) {
			name = $(colHeader).text() != "" ? $(colHeader).text().replace(" ", "_") : "-1";
			$(colHeader).attr("data-name", name);
		}
		return { name: `${name}`, num: index, text: $(colHeader).text(), type: `${type ? type : -1}` };
	});
	let conf: any = confDataTables();
	conf.columns = columns;

	let tableTypes: any = {
		filter: () => {
			/*conf.drawCallback = (settings: any) => {
				if (settings._iDisplayStart != tableStart) {
					var targetOffset = tableStart;
					if ($("body").scrollTop() > targetOffset) $("body").animate({ scrollTop: targetOffset }, 500);
				}
			};*/
			conf.ajax.url = url;
			conf.ajax.data = (dataSent: any) => {
				dataSent = mergeObjects(dataSent, ajaxArgs);
				dataSent.totalRecords = totalRecords;
				//d.filters = getFilters(`#dtFilter_${tableId}`);
				//d.filters = filter.get();
				return JSON.stringify(dataSent);
			};
			conf.ajax.dataSrc = (dataResponse: any) => {
				if (totalRecords == 0) {
					totalRecords = dataResponse.recordsTotal;
				}
				dataResponse.recordsTotal = totalRecords;
				return dataResponse.data;
			};
			conf.ajax.beforeSend = () => {
				if ($htmlTable.find("tbody tr.js-datatable__loading").length !== 0) return;
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
			};
			conf.columnDefs.push({
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
			});

			/*$("body").append(`<div class="js-modal" data-title="Filtros" data-modal="" id="dtFilter_${tableId}"></div>`);
			await modalLoader();
			$(`#dtFilter_${tableId}`).addClass("js-datatable__modal");
			$(`#dtFilter_${tableId}`).find(".js-modal__content-footer").append(`<button data-type="success" data-cmd='apply-filters'>Aplicar</button>`);
			let modalBody = $(`#dtFilter_${tableId}`).find(".js-modal__content-body");
			modalBody.append(`<ul class="dt-filter-container"><li class="dt-filter-container__item" data-name="empty">Sin Filtros</li></ul>`);
			modalBody.append(`<button data-type="success" data-cmd='add-filter'><div class="svg-icon"><svg viewBox="-1 -1.5 15 15"> <use xlink:href="#svg-plus"></use></svg></div><span>Agregar Filtro</span></button>`);

			let controls = {
				date: () => {
					return `<label class="js-textbox outlined" data-date="start">
								<input class="js-textbox__input js-datepicker" data-name="value" type="text" placeholder="Desde">
							</label>
							<span data-name="separator"></span>
							<label class="js-textbox outlined" data-date="end">
								<input class="js-textbox__input js-datepicker" data-name="value" type="text" placeholder="Hasta">
							</label>`;
				},
				int: () => {
					return `<label class="js-textbox outlined">
								<input class="js-textbox__input" data-name="value" type="number" placeholder="">
							</label>`;
				},
				string: () => {
					return `<select data-type="db-dt-filter"  data-name="value"></select>`;
				},
				id: () => {
					return `<select data-type="db-dt-filter" data-name="value"></select>`;
				},
			};

			let filter = {
				"add-filter": (el) => {
					let options = "";
					availableFields.forEach((field) => {
						options += `<option value="${field.name}" data-type="${field.type}">${field.text}</option>`;
					});
					modalBody.find(">.dt-filter-container").append(`
						<li class="dt-filter-container__item" data-value-type="">
							<div class="dt-filter-container__item_header">
								<div data-name="title">
									<button data-cmd="delete-filter" data-type="danger"><div class="svg-icon"><svg viewBox="0 0 12 12"> <use xlink:href="#svg-times"></use></svg></div></button>
									<select class="js-select" data-name="column-select">
										<option value='' data-type='null'></option>
										${options}
									</select>
									<button data-toggle="collapse" data-target="parent(3)"> <div class="svg-icon"><svg viewBox="0 0 12 7"> <use xlink:href="#svg-angle-down"></use></svg></div> </button>
								</div>
							</div>
							<div class="dt-filter-container__item_body"></div>
						</li>
					`);
				},
				"delete-filter": (el) => {
					let filter = el.closest(".dt-filter-container__item");
					if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");
					if (filter.find(".js-datepicker[data-name='value']").length > 0) filter.find(".js-datepicker[data-name='value']").datetimepicker("destroy");
					filter.remove();
				},
				"add-controls": (el) => {
					let valueType = el.find(":selected").attr("data-type");
					if (valueType == "null") return;
					let container = el.closest(".dt-filter-container");
					let column = el.val();
					let duplicated = false;
					container.find(`select[data-name="column-select"]`).each((index, element) => {
						if (element == el[0]) return;
						duplicated = $(element).val() == column;
						if (duplicated) return false;
					});
					if (duplicated) {
						el.val("");
						Swal.fire(cFormats.sweetalert("", "error", `Esa columna ya esta seleccionada.`, { timer: 3000 }));
						return;
					}
					let filter = el.closest(".dt-filter-container__item");
					//if there is a control already, remove it
					if (filter.find(`ul[data-name="db-dt-filter-list"]`).length > 0 && (valueType != "string" || valueType != "id")) filter.find(`ul[data-name="db-dt-filter-list"]`).remove();
					if (filter.find(">.dt-filter-container__item_body>*").length > 0) {
						if (filter.find("select[data-name='value']").length > 0) filter.find("select[data-name='value']").select2("destroy");
						if (filter.find(".js-datepicker[data-name='value']").length > 0) filter.find(".js-datepicker[data-name='value']").datetimepicker("destroy");
						filter.find(">.dt-filter-container__item_body").empty();
					}
					filter.addClass("open").attr("data-value-type", valueType);
					filter.find(">.dt-filter-container__item_body").append(controls[valueType]());

					if (valueType == "string" || valueType == "id") {
						if (filter.find(`ul[data-name="db-dt-filter-list"]`).length == 0) filter.find(">.dt-filter-container__item_header").append(`<ul data-name="db-dt-filter-list"></ul>`);
						let searchOptions = filter.find(`ul[data-name="db-dt-filter-list"]`);
						let select = filter.find("[data-name='value']");
						let params = {
							module: extraParams.module,
							action: extraParams.action,
							type: "select2",
							column: column,
						};
						if (extraParams.reportName) params.reportName = extraParams.reportName;
						if (extraParams.maintenanceCategory) params.maintenanceCategory = extraParams.maintenanceCategory;
						customSelect2(select, "api/api.php", params).init({
							placeholder: "Buscar",
							dropdownParent: filter.find(">.dt-filter-container__item_body"),
							closeOnSelect: false,
							multiple: true,
						});
						let searchBox = filter.find(`input[type="search"]`);
						if (searchBox.parent().find(">.svg-icon").length == 0) searchBox.parent().prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`);
						select
							.on("select2:select", (e) => {
								setTimeout(() => {
									searchBox.attr("placeholder", "Buscar");
								}, 5);
							})
							.on("select2:selecting", (e) => {
								searchOptions.append(`<li data-value="${e.params.args.data.id}"> <div class="svg-icon" data-cmd="delete-option"><svg viewBox="0 0 12 12"> <use xlink:href="#svg-times"></use></svg></div> ${e.params.args.data.id}</li>`);
							})
							.on("select2:unselecting", (e) => {
								searchOptions.find(`>li[data-value="${e.params.args.data.id}"]`).remove();
							})
							.on("select2:open", function (e) {
								const evt = "scroll.select2";
								$(e.target).parents().off(evt);
								$(window).off(evt);
							})
							.on("select2:closing", function (e) {
								e.preventDefault();
							})
							.on("select2:closed", function (e) {
								select.select2("open");
							})
							.on("change", function (e) {
								searchBox.attr("placeholder", "Buscar");
								select.data("select2").results.setClasses();
							});
						select.select2("open");
					}
					if (valueType == "date") {
						let dateStart = filter.find(`[data-date="start"]>.js-datepicker`);
						let dateEnd = filter.find(`[data-date="end"]>.js-datepicker`);

						dateStart
							.datetimepicker(
								cFormats.datepicker({
									onShow: function () {
										this.setOptions({
											maxDate: dateEnd.val() ? dateEnd.val() : false,
										});
									},
								})
							)
							.val("");
						dateEnd
							.datetimepicker(
								cFormats.datepicker({
									onShow: function () {
										this.setOptions({
											minDate: dateStart.val() ? dateStart.val() : false,
										});
									},
								})
							)
							.val("");
					}
				},
				"delete-option": (el) => {
					let value = el.parent().attr("data-value");
					let filter = el.closest(".dt-filter-container__item");
					let select = filter.find("select[data-name='value']");
					select.val(select.val().filter((item) => item != value)).trigger("change");
					el.parent().remove();
				},
				get: (el) => {
					let dtFilters = [];
					try {
						modalBody.find(`.dt-filter-container__item:not([data-name="empty"])`).each((index, item) => {
							let column = $(item).find(`[data-name="column-select"] :selected`).val(); //backend column name
							let type = $(item).attr("data-value-type"); //column data type int/string/id/date
							let values = [];
							if (type == "string" || type == "id") values = $(item).find(`.dt-filter-container__item_body > [data-name="value"]`).val();
							if (type == "date") {
								if ($(item).find(`[data-date="start"]>.js-datepicker`).val() != "") values.push($(item).find(`[data-date="start"]>.js-datepicker`).val());
								if ($(item).find(`[data-date="end"]>.js-datepicker`).val() != "") values.push($(item).find(`[data-date="end"]>.js-datepicker`).val());
							}
							if (type == "int") values.push($(item).find(`.js-textbox__input`).val());
							if (values.length == 0) return;
							dtFilters.push({
								column: column,
								type: $(item).attr("data-value-type"),
								values: values,
							});
						});
					} catch (e) {
						console.log(e);
						dtFilters = [];
					}
					return dtFilters;
				},
			};

			modalBody.on("click", (Event) => {
				if (Event.target.closest("[data-cmd]")) {
					let el = $(Event.target.closest("[data-cmd]"));
					if (!filter[el.attr("data-cmd")]) return;
					filter[el.attr("data-cmd")](el);
				}
			});

			modalBody.on("change", (e) => {
				if (e.target.closest(`[data-name="column-select"]`)) {
					let el = $(e.target.closest(`[data-name="column-select"]`));
					filter["add-controls"](el);
				}
			});*/
		},
		simple: () => {},
		records: () => {},
	};
	tableTypes[type]();

	function getColumn(columnName: string) {
		return columns
			.filter((index, column) => {
				return column.name == columnName;
			})
			.map((index, column) => column.num);
	}

	return {
		conf,
		getColumn,
		initTable: () => {
			//create the DataTable object
			let dataTable = $htmlTable.DataTable(conf);
			//reference the DataTable's wrapper
			let dataTableContainer = $htmlTable.closest(".dataTables_wrapper");
			dataTableContainer.addClass("js-dt-wrapper").attr("data-view", `${type}`);
			dataTable.on("error.dt", function (e, settings, techNote, message) {
				Swal.fire(confSweetAlert("", "error", message, { showConfirmButton: true }));
				return;
			});
			/*$(`#dtFilter_${tableId}`)
				.find("[data-cmd='apply-filters']")
				.attr({ "data-toggle": "modal", "data-target": `#dtFilter_${tableId}` })
				.on("click", () => {
					dataTable.ajax.reload();
				});*/
			dataTableContainer.find(".dataTables_filter>label").prepend(`<div class="svg-icon"><svg viewBox="0 0 17 17"> <use xlink:href="#svg-search"></use></svg></div>`); //adds search icon

			dataTableContainer.find(".dataTables_filter input").addClass("js-dt-toolbar__search");

			dataTableContainer.find(".js-dt-toolbar__export").prepend(`<div class='js-dropdown__button' data-toggle='dropdown' data-target='parent(1)'>
																			<div class="svg-icon">
																				<svg viewBox="0 0 18 18"> <use xlink:href="#svg-download"></use></svg>
																			</div>
																			<span>Exportar</span>
																		</div>`);

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
			return dataTable;
		},
	};
}
