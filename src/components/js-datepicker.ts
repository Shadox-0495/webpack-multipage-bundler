import AirDatepicker from "air-datepicker";
import { confDatePicker } from "@features/configs";

export function datePicker(element: any, args: any = {}) {
	let conf = confDatePicker(args);
	let datePicker = new AirDatepicker(element, conf);
	return datePicker;
}
