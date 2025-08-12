import type { ElementSelector as IElementSelector } from "@primitivestack/frontend-testing-core";
import userEvent from "@testing-library/user-event";
import type { ArrayTail, Simplify } from "type-fest";

type UserEventsWithBoundedElements<
	TElementEventMap extends Record<string, (...args: any) => unknown>,
> = Simplify<{
	[K in keyof TElementEventMap]: (
		...args: ArrayTail<Parameters<TElementEventMap[K]>>
	) => ReturnType<TElementEventMap[K]>;
}>;

type ElementUserEvents = Pick<
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

type DOMElementHandle = HTMLElement &
	UserEventsWithBoundedElements<ElementUserEvents>;
export type DOMElementSelector<TElementKey> = IElementSelector<
	TElementKey,
	DOMElementHandle
>;

export class ElementSelector<
	TElementId extends PropertyKey,
	TElement extends DOMElementHandle,
	TSelectorConfig extends Record<TElementId, () => HTMLElement>,
> implements DOMElementSelector<TElementId>
{
	constructor(private readonly config: TSelectorConfig) {}

	async get(key: TElementId) {
		const baseHtmlElement = this.config[key]();

		return {
			...baseHtmlElement,
			clear: userEvent.clear.bind(null, baseHtmlElement),
			click: userEvent.click.bind(null, baseHtmlElement),
			dblClick: userEvent.dblClick.bind(null, baseHtmlElement),
			deselectOptions: userEvent.deselectOptions.bind(null, baseHtmlElement),
			hover: userEvent.hover.bind(null, baseHtmlElement),
			selectOptions: userEvent.selectOptions.bind(null, baseHtmlElement),
			tripleClick: userEvent.tripleClick.bind(null, baseHtmlElement),
			type: userEvent.type.bind(null, baseHtmlElement),
			unhover: userEvent.unhover.bind(null, baseHtmlElement),
			upload: userEvent.upload.bind(null, baseHtmlElement),
		} as TElement;
	}
}
