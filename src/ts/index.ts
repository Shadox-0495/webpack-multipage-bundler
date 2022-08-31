import { dataTable } from "@components/js-datatable";
import allIcons from "@img/all-icons.svg";
import "@sass/index.scss";
$("body").prepend(allIcons);
let dt: any = await dataTable($(".js-dt-table"), `${process.env.API_URL}/api.php`, { module: "inventario", action: "shipment-records" });
dt = dt.initTable();
