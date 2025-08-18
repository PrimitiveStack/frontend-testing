import type { NonEmptyPartial } from "@primitivestack/types";

export type ElementConfig = NonEmptyPartial<{
	properties: NonEmptyPartial<Record<"labelText" | "text", string>>;
	attributes: Record<string, string>;
}>;
