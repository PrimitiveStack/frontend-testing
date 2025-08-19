import type { PageConfig } from "@primitivestack/frontend-testing-core";
import type { ElementHandle } from "puppeteer";
import { map } from "ramda";
import type { Driver } from "./Driver";

const toAttributeSelector = (name: string, value: string) =>
	`[${name}="${value}"]`;

export const toElements = <T extends PageConfig>(config: T, driver: Driver) =>
	map((value) => {
		const { properties, attributes } = value;

		return {
			async get() {
				if (attributes) {
					for (const [name, value] of Object.entries(attributes)) {
						const selector = toAttributeSelector(name, value);

						const element = await driver.page.waitForSelector(selector);
						if (element) return element;
					}
				}

				if (properties) {
					const { labelText, text } = properties;

					if (labelText) {
						const handle = await driver.page.waitForFunction(
							(labelText) => {
								const labels = document.querySelectorAll("label");
								for (const label of labels) {
									if (label.textContent.trim() === labelText) {
										const inputId = label.getAttribute("for");
										if (inputId) {
											return document.getElementById(inputId);
										}
									}
								}
							},
							{},
							labelText,
						);
						const element = handle.asElement() as ElementHandle;
						if (element) return element;
					}

					if (text) {
						const handle = await driver.page.waitForFunction(
							(text) => {
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
									if (currentNode.textContent?.trim() === text) {
										return currentNode;
									}
								}

								return null;
							},
							{},
							text,
						);
						const element = handle.asElement() as ElementHandle;
						if (element) return element;
					}
				}

				throw new Error(`Element not found.`);
			},
			async getMany() {
				if (attributes) {
					for (const [name, value] of Object.entries(attributes)) {
						const selector = toAttributeSelector(name, value);

						const elements = await driver.page.waitForFunction(() =>
							Array.from(document.querySelectorAll(selector)),
						);
						if (elements) return elements;
					}
				}

				if (properties) {
					const { labelText, text } = properties;

					if (labelText) {
						const elements = await driver.page.waitForFunction(
							(labelText) =>
								Array.from(document.querySelectorAll("label")).filter((e) => {
									if (e.textContent.trim() === labelText) {
										const inputId = e.getAttribute("for");
										if (inputId) {
											return document.getElementById(inputId);
										}
									}
								}),
							{},
							labelText,
						);
						if (elements) return elements;
					}

					if (text) {
						const elements = await driver.page.waitForFunction(
							(text) =>
								Array.from(document.querySelectorAll("*")).filter((e) => {
									if (e.textContent.includes(text)) {
										return e;
									}
								}),
							{},
							text,
						);
						if (elements) return elements;
					}
				}

				throw new Error(`Elements were not found.`);
			},
		};
	}, config);
