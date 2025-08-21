import type { NonEmptyPartial } from "@primitivestack/types";

export type ElementConfig = NonEmptyPartial<{
	properties: NonEmptyPartial<Record<"labelText" | "text", Property>>;
	attributes: Record<string, string>;
}>;

type Property =
	| {
			type: "argument";
	  }
	| {
			type: "const";
			value: string;
	  };
