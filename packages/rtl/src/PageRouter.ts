import type {
	ElementSelector,
	PageRouter as IPageRouter,
	Render,
} from "@primitivestack/frontend-testing-core";

export class PageRouter<
	TNode,
	TPages extends Record<
		PropertyKey,
		{ component: TNode; selector: ElementSelector<unknown, unknown> }
	>,
> implements IPageRouter<keyof TPages>
{
	constructor(
		private readonly pages: TPages,
		private readonly render: Render<TNode>,
	) {}

	navigate<TPageId extends keyof TPages>(pageId: TPageId) {
		const element = this.pages[pageId];
		this.render(element.component);

		return element.selector as unknown as TPages[TPageId]["selector"];
	}
}
