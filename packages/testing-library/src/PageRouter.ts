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
		const page = this.pages[pageId];
		this.render(page.component);

		return page.pageController as TPages[TPageId]["pageController"];
	}
}
