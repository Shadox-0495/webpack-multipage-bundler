import dataTable from "@components/js-datatable.js";
import "@sass/index.scss";
/*import "@components/js-textbox.ts";
import "@components/js-modal.ts";*/
let dt = await dataTable($(".js-dt-table"), "api/api.php", { module: "donacion", action: "registros" });
dt = dt.initTable();
