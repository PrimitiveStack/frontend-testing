import type { PageConfig } from "./PageConfig";

export type AppConfig = {
	[key: string]: PageConfig | AppConfig;
};
