import "@sass/index.scss";
//import { confDataTables } from "@features/configs";
import { dataTable } from "@components/js-datatable";
let dt: any = await dataTable($(".js-dt-table"), "api/api.php", { module: "donacion", action: "registros" });
dt = dt.initTable();
