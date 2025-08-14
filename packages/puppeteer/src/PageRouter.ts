import type { PageRouter as IPageRouter } from "@primitivestack/frontend-testing-core";
import { Page } from "puppeteer";

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
		const page = this.pages[pageId];
		this.page.goto(page.url);

		return page.pageController as TPages[TPageId]["pageController"];
	}
}
