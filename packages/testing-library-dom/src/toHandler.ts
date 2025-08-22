import userEvent from "@testing-library/user-event";

type Bind<
	T extends (...args: any[]) => any,
	BoundArgs extends readonly any[] = [],
> = T extends (...args: any[]) => infer Return
	? T extends (...args: readonly [...BoundArgs, ...infer Rest]) => any
		? (...args: Rest) => Return
		: never
	: never;

export type BoundedFunctions<
	TElementEventMap extends Record<string, (...args: any) => unknown>,
	T extends readonly any[],
> = {
	[K in keyof TElementEventMap as Bind<TElementEventMap[K], T> extends never
		? never
		: K]: Bind<TElementEventMap[K], T>;
};

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

export type TestingLibraryDOMElementHandle = BoundedFunctions<
	TestingLibraryElementUserEvents,
	[Element]
>;

export type ElementHandler<T extends Element> = {
	element: Element;
	events: BoundedFunctions<
		Pick<
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
		>,
		[T]
	>;
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
