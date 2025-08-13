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

type DOMElementHandle = {
	element: HTMLElement;
	events: UserEventsWithBoundedElements<ElementUserEvents>;
};
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
		const element = this.config[key]();

		return {
			element: element,
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
		} as TElement;
	}
}
