/*import { ajaxGET } from "@features/ajax";*/
import { dataTable } from "@components/js-datatable";
import "@sass/index.scss";
//let template = await ajaxGET("/src/templates/pages.hbs");

let dt: any = await dataTable($(".js-dt-table"), `${process.env.API_URL}/api.php`, { module: "inventario", action: "shipment-records" });
dt = dt.initTable();

//let [data, error] = await ajaxPOST(`${process.env.API_URL}/api.php`, { module: "usuario", action: "login", userName: "svargas", userPass: "SVARGAS 0495" });
//console.log(data);
