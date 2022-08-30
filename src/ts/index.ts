import "@sass/index.scss";
import { dataTable } from "@components/js-datatable.exclude";
//import { ajaxGET } from "@features/ajax";
let dt: any = await dataTable($(".js-dt-table"), `${process.env.API_URL}/api.php`, { module: "donacion", action: "registros" });
dt = dt.initTable();
/*let [resp, error] = await ajaxGET({}, `${process.env.API_URL}/api.php`, {});
console.log(resp);
console.log(error);*/
