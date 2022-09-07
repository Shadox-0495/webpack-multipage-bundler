export function mergeObjects(target: any, args: any) {
	if (Object.keys(args).length === 0) return target;
	let merge = Object.assign(target, args);
	return merge;
}

export function parentNode(element: JQuery<HTMLElement>, num: Number) {
	let current = element;
	for (var i = 0; i < num; i++) {
		current = current.parent();
	}
	return current;
}

export function htmlStringToFragment(html: string) {
	let docFragment = document.createDocumentFragment();
	let elContainer = document.createElement("div");
	elContainer.innerHTML = html;
	while (elContainer.childNodes[0]) {
		docFragment.appendChild(elContainer.childNodes[0]);
	}
	return docFragment;
}
