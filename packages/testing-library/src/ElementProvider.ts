import userEvent from "@testing-library/user-event";
import type { ArrayTail, Simplify } from "type-fest";
import type { ElementProvider as IElementProvider } from "../../core/src/ElementProvider";

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

export abstract class ElementProvider
	implements IElementProvider<DOMElementHandle>
{
	get() {
		return this.toElement(this.getHTMLElement());
	}

	getMany() {
		return this.getManyHTMLElement().map(this.toElement);
	}

	protected abstract getHTMLElement(): HTMLElement;
	protected abstract getManyHTMLElement(): HTMLElement[];

	private toElement(element: HTMLElement) {
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
		};
	}
}
