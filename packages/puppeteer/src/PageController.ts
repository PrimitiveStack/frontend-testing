import type { Driver } from "./Driver";

export class PageController {
	constructor(
		private readonly url: string,
		private readonly driver: Driver,
	) {}
	async open() {
		await this.driver.page.goto(this.url);
	}
}
