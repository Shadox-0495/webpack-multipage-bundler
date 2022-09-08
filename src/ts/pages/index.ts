import { dataTable } from "@components/js-datatables";
import { compileTemplate } from "@features/templates-loader";

let templateData = {
	id: "dtDB",
	type: "filter",
	haderRows: [
		[
			{ id: "t1.ID", type: "id", class: "", label: "ID" },
			{ id: "t1.Nombre", type: "string", class: "", label: "Nombre" },
			{ id: "t1.Apellido", type: "string", class: "", label: "Apellido" },
			{ id: "t1.Eddad", type: "int", class: "", label: "Edad" },
			{ id: "t1.Fecha_nacimiento", type: "date", class: "", label: "Fecha de nacimiento" },
			//{ id: "-1", type: "", class: "all", label: "" },
		],
	],
};

$("body").append(compileTemplate("dataTable", templateData));
let dt: any = await dataTable($("#dtDB"), `${process.env.API_URL}/api.php`, { module: "reporte", action: "getReport", reportName: "dummy" });
dt = dt.initTable();
//let [data, error] = await ajaxPOST(`${process.env.API_URL}/api.php`, { module: "usuario", action: "login", userName: "svargas", userPass: "SVARGAS 0495" });
//console.log(data);
