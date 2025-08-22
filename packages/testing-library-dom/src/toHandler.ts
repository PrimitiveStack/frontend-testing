import userEvent from "@testing-library/user-event";

export type TestingLibraryElementUserEvents = Pick<
	typeof userEvent,
	| "clear"
	| "click"
	| "dblClick"
	| "deselectOptions"
	| "hover"
	| "selectOptions"
	| "tripleClick"
	| "type"
	| "unhover"
	| "upload"
>;

type BoundFunction<T> = T extends (
	element: any,
	...args: infer Args
) => infer Return
	? (...args: Args) => Return
	: never;

type BaseEvents = {
	[K in Exclude<
		keyof TestingLibraryElementUserEvents,
		"upload"
	>]: BoundFunction<TestingLibraryElementUserEvents[K]>;
};

type UploadEvent<T extends Element> = T extends HTMLElement
	? { upload: BoundFunction<TestingLibraryElementUserEvents["upload"]> }
	: {};

export type ElementHandler<T extends Element> = {
	element: T;
	events: BaseEvents & UploadEvent<T>;
};

export const toHandler = <T extends Element>(element: T) =>
	({
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
			upload:
				element instanceof HTMLElement
					? userEvent.upload.bind(null, element)
					: undefined,
		},
	}) as unknown as ElementHandler<T>;
