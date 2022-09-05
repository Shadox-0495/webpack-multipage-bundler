import { dataTable } from "@components/js-datatable";
import { compileTemplate } from "@features/templates-loader";
import "@sass/index.scss";

let templateData = {
	id: "dtDB",
	type: "filter",
	haderRows: [
		[
			{ id: "t1.ID", type: "id", class: "none", label: "ID" },
			{ id: "t2.Num", type: "int", class: "none", label: "ContenedorID" },
			{ id: "t1.Embarque", type: "string", class: "all", label: "Embarque" },
			{ id: "t2.Codigo", type: "string", class: "all", label: "Contenedor" },
			{ id: "t3.Nombre", type: "string", class: "all", label: "Bodega" },
			{ id: "-1", type: "", class: "all", label: "" },
		],
	],
};

$("body").append(compileTemplate("dataTable", templateData));
let dt: any = await dataTable($("#dtDB"), `${process.env.API_URL}/api.php`, { module: "inventario", action: "shipment-records" });
dt = dt.initTable();
//let [data, error] = await ajaxPOST(`${process.env.API_URL}/api.php`, { module: "usuario", action: "login", userName: "svargas", userPass: "SVARGAS 0495" });
//console.log(data);
