import type { Page } from "@playwright/test";
import type { PageRouter as IPageRouter } from "@primitivestack/frontend-testing-core";

export class PageRouter<
	TPages extends Record<
		PropertyKey,
		{
			url: string;
			pageController: unknown;
		}
	>,
> implements IPageRouter<keyof TPages>
{
	constructor(
		private readonly pages: TPages,
		private readonly page: Page,
	) {}

	navigate<TPageId extends keyof TPages>(pageId: TPageId) {
		const element = this.pages[pageId];
		this.page.goto(element.url);

		return element.pageController as TPages[TPageId]["pageController"];
	}
}
