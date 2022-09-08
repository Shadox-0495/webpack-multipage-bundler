import AirDatepicker from "air-datepicker";
import { confDatePicker } from "@features/configs";

export function datePicker(element: any, args: any = {}) {
	let conf = confDatePicker(args);
	return new AirDatepicker(element, conf);
}
