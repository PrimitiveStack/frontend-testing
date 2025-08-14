import puppeteer, {
	type Browser,
	type LaunchOptions,
	type Page,
} from "puppeteer";

export class Driver {
	private constructor(
		readonly browser: Browser,
		readonly page: Page,
	) {}

	public static async create(options?: LaunchOptions) {
		const browser = await puppeteer.launch(options);
		const page = await browser.newPage();
		return new Driver(browser, page);
	}
}
