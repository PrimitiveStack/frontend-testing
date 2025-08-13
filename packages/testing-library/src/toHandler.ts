import userEvent from "@testing-library/user-event";

export const toHandler = (element: HTMLElement) => ({
	element,
	events: {
		clear: userEvent.clear.bind(null, element),
		click: userEvent.click.bind(null, element),
		dblClick: userEvent.dblClick.bind(null, element),
		deselectOptions: userEvent.deselectOptions.bind(null, element),
		hover: userEvent.hover.bind(null, element),
		selectOptions: userEvent.selectOptions.bind(null, element),
		tripleClick: userEvent.tripleClick.bind(null, element),
		type: userEvent.type.bind(null, element),
		unhover: userEvent.unhover.bind(null, element),
		upload: userEvent.upload.bind(null, element),
	},
});

export type DOMElementHandler = ReturnType<typeof toHandler>;
