import { dataTable } from "@components/js-datatable";
import "@sass/index.scss";
let dt: any = await dataTable($(".js-dt-table"), `${process.env.API_URL}/api.php`, { module: "inventario", action: "shipment-records" });
dt = dt.initTable();
