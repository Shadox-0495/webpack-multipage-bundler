import "@sass/index.scss";
import icon from "@img/icons.svg";
import { dataTable } from "@components/js-datatable";
//import { ajaxGET } from "@features/ajax";
let dt: any = await dataTable($(".js-dt-table"), `${process.env.API_URL}/api.php`, { module: "donacion", action: "registros" });
dt = dt.initTable();
/*let [resp, error] = await ajaxGET({}, `src/assets/img/icons.svg`, { dataType: "text" });
console.log(resp);
console.log(error);*/
$("body").prepend(icon);
