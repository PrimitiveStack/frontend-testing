import type {
	PageRouter as IPageRouter,
	Render,
} from "@primitivestack/frontend-testing-core";

export class PageRouter<
	TNode,
	TPages extends Record<
		PropertyKey,
		{
			component: TNode;
			pageController: unknown;
		}
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

		return element.pageController as TPages[TPageId]["pageController"];
	}
}
