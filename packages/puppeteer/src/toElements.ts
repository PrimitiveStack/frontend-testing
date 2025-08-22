import type { ComponentConfig } from "@primitivestack/frontend-testing-core";
import type { Driver } from "@primitivestack/frontend-testing-puppeteer";
import type {
	ElementHandle,
	FrameWaitForFunctionOptions,
	JSHandle,
	WaitForSelectorOptions,
} from "puppeteer";
import { map } from "ramda";
import type { SimplifyDeep } from "type-fest";

type ConvertPageConfig<
	TConfig extends ComponentConfig,
	TOne,
	TAll,
> = SimplifyDeep<{
	[K in keyof TConfig]: (TConfig[K] extends {
		attributes: Record<string, string>;
	}
		? {
				get(): Promise<TOne>;
				find(): Promise<TOne | null>;
				waitFor(
					options?: WaitForSelectorOptions | undefined,
				): Promise<TOne | undefined>;
				waitForAll(
					options?: FrameWaitForFunctionOptions,
				): Promise<TAll | undefined>;
			}
		: {}) &
		(TConfig[K] extends { properties: { text: infer P } }
			? P extends { type: "argument" }
				? {
						getByText(value: string): Promise<TOne>;
						findByText(value: string): Promise<TOne | null>;
						waitForByText(
							value: string,
							options?: FrameWaitForFunctionOptions,
						): Promise<TOne | undefined>;
						waitForAllByText(
							value: string,
							options?: FrameWaitForFunctionOptions,
						): Promise<TAll | undefined>;
					}
				: {
						getByText(): Promise<TOne>;
						findByText(): Promise<TOne | null>;
						waitForByText(
							options?: FrameWaitForFunctionOptions,
						): Promise<TOne | undefined>;
						waitForAllByText(
							options?: FrameWaitForFunctionOptions,
						): Promise<TAll | undefined>;
					}
			: {}) &
		(TConfig[K] extends { properties: { labelText: infer P } }
			? P extends { type: "argument" }
				? {
						getByLabelText(value: string): Promise<TOne>;
						findByLabelText(value: string): Promise<TOne | null>;
						waitForByLabelText(
							value: string,
							options?: FrameWaitForFunctionOptions,
						): Promise<TOne | undefined>;
						waitForAllByLabelText(
							value: string,
							options?: FrameWaitForFunctionOptions,
						): Promise<JSHandle<HTMLLabelElement[]> | undefined>;
					}
				: {
						getByLabelText(): Promise<TOne>;
						findByLabelText(): Promise<TOne | null>;
						waitForByLabelText(
							options?: FrameWaitForFunctionOptions,
						): Promise<TOne | undefined>;
						waitForAllByLabelText(
							options?: FrameWaitForFunctionOptions,
						): Promise<JSHandle<HTMLLabelElement[]> | undefined>;
					}
			: {});
}>;

const toAttributeSelector = (name: string, value: string) =>
	`[${name}="${value}"]`;

export const toElements = <T extends ComponentConfig>(
	config: T,
	driver: Driver,
) =>
	map((value) => {
		const { properties, attributes } = value;

		let element = {} as Record<PropertyKey, unknown>;

		if (attributes) {
			for (const [name, value] of Object.entries(attributes)) {
				const selector = toAttributeSelector(name, value);

				element = {
					...element,
					async get() {
						const handle = await driver.page.$(selector);
						if (!handle) throw new Error();
						return handle;
					},
					find: () => driver.page.$(selector),
					async waitFor(options?: WaitForSelectorOptions) {
						const element = await driver.page.waitForSelector(
							selector,
							options,
						);
						if (element) return element;
					},
					async waitForAll(options?: FrameWaitForFunctionOptions) {
						const elements = await driver.page.waitForFunction(
							(selector) => Array.from(document.querySelectorAll(selector)),
							options,
							selector,
						);
						if (elements) return elements;
					},
				};
			}
		}

		if (properties) {
			const { labelText, text } = properties;

			if (labelText) {
				function select(value: string) {
					const labels = document.querySelectorAll("label");
					for (const label of labels) {
						if (label.textContent.trim() === value) {
							const inputId = label.getAttribute("for");
							if (inputId) {
								return document.getElementById(inputId);
							}
						}
					}
				}

				function selectMany(value: string) {
					return Array.from(document.querySelectorAll("label")).filter((e) => {
						if (e.textContent.trim() === value) {
							const inputId = e.getAttribute("for");
							if (inputId) {
								return document.getElementById(inputId);
							}
						}
					});
				}

				if (labelText.type === "const") {
					const { value } = labelText;

					element = {
						...element,
						async getByLabelText() {
							const handle = await driver.page.evaluateHandle(select, value);

							const element = handle.asElement() as ElementHandle | null;
							if (!element) throw new Error();

							return element;
						},
						async findByLabelText() {
							const handle = await driver.page.evaluateHandle(select, value);

							return handle.asElement() as ElementHandle | null;
						},
						async waitForByLabelText(options?: FrameWaitForFunctionOptions) {
							const handle = await driver.page.waitForFunction(
								select,
								options,
								value,
							);
							const element = handle.asElement() as ElementHandle;
							if (element) return element;
						},
						async waitForAllByLabelText(options?: FrameWaitForFunctionOptions) {
							const elements = await driver.page.waitForFunction(
								selectMany,
								options,
								value,
							);
							if (elements) return elements;
						},
					};
				}

				element = {
					...element,
					async getByLabelText(value: string) {
						const handle = await driver.page.evaluateHandle(select, value);

						const element = handle.asElement() as ElementHandle | null;
						if (!element) throw new Error();

						return element;
					},
					async findByLabelText(value: string) {
						const handle = await driver.page.evaluateHandle(select, value);

						return handle.asElement() as ElementHandle | null;
					},
					async waitForByLabelText(
						value: string,
						options?: FrameWaitForFunctionOptions,
					) {
						const handle = await driver.page.waitForFunction(
							select,
							options,
							value,
						);
						const element = handle.asElement() as ElementHandle;
						if (element) return element;
					},
					async waitForAllByLabelText(
						value: string,
						options?: FrameWaitForFunctionOptions,
					) {
						const elements = await driver.page.waitForFunction(
							selectMany,
							options,
							value,
						);
						if (elements) return elements;
					},
				};
			}

			if (text) {
				function select(value: string) {
					const walker = document.createTreeWalker(
						document.body,
						NodeFilter.SHOW_ELEMENT,
						{
							acceptNode: (node: Element) => {
								const hasChildElements = node.children.length > 0;
								return hasChildElements
									? NodeFilter.FILTER_SKIP
									: NodeFilter.FILTER_ACCEPT;
							},
						},
					);

					let currentNode: Element | null;
					while ((currentNode = walker.nextNode() as Element)) {
						if (currentNode.textContent?.trim() === value) {
							return currentNode;
						}
					}

					return null;
				}

				function selectMany(value: string) {
					return Array.from(document.querySelectorAll("*")).filter((e) => {
						if (e.textContent.includes(value)) {
							return e;
						}
					});
				}

				if (text.type === "const") {
					const { value } = text;

					element = {
						...element,
						async getByText() {
							const handle = await driver.page.evaluateHandle(select, value);

							const element = handle.asElement() as ElementHandle | null;
							if (!element) throw new Error();

							return element;
						},
						async findByText() {
							const handle = await driver.page.evaluateHandle(select, value);

							return handle.asElement() as ElementHandle | null;
						},
						async waitForByText(options?: FrameWaitForFunctionOptions) {
							const handle = await driver.page.waitForFunction(
								select,
								options,
								value,
							);
							const element = handle.asElement() as ElementHandle;
							if (element) return element;
						},
						async waitForAllByText(options?: FrameWaitForFunctionOptions) {
							const elements = await driver.page.waitForFunction(
								selectMany,
								options,
								value,
							);
							if (elements) return elements;
						},
					};
				}

				element = {
					...element,
					async getByText(value: string) {
						const handle = await driver.page.evaluateHandle(select, value);

						const element = handle.asElement() as ElementHandle | null;
						if (!element) throw new Error();

						return element;
					},
					async findByText(value: string) {
						const handle = await driver.page.evaluateHandle(select, value);

						return handle.asElement() as ElementHandle | null;
					},
					async waitForByText(
						value: string,
						options?: FrameWaitForFunctionOptions,
					) {
						const handle = await driver.page.waitForFunction(
							select,
							options,
							value,
						);
						const element = handle.asElement() as ElementHandle;
						if (element) return element;
					},
					async waitForAllByText(
						value: string,
						options?: FrameWaitForFunctionOptions,
					) {
						const elements = await driver.page.waitForFunction(
							selectMany,
							options,
							value,
						);
						if (elements) return elements;
					},
				};
			}
		}

		return element;
	}, config) as ConvertPageConfig<
		T,
		ElementHandle<Element>,
		JSHandle<Element[]>
	>;
