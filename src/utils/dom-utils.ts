export function parentNode(element: JQuery<HTMLElement>, num: Number) {
	let current = element;
	for (var i = 0; i < num; i++) {
		current = current.parent();
	}
	return current;
}
