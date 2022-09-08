import AirDatepicker from "air-datepicker";
import "air-datepicker/locale/en.js";
import { confDatePicker } from "@features/configs";

export function datePicker(element: any, args: any = {}) {
	let conf = confDatePicker(args);
	return new AirDatepicker(element, conf);
}

export function destroyDatePicker(element: any) {
	console.log(element);
}
