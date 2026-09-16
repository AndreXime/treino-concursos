import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderQuestionContent } from "./render-emphasis";

describe("renderQuestionContent", () => {
	it("keeps plain text", () => {
		assert.equal(renderQuestionContent("só texto"), "só texto");
	});

	it("renders emphasis", () => {
		const nodes = renderQuestionContent("a *b* c");
		assert.ok(Array.isArray(nodes));
		assert.equal((nodes as unknown[]).length, 1);
	});

	it("renders image when map has url", () => {
		const nodes = renderQuestionContent("Antes $$ IMAGE 7 $$ depois", {
			imagens: { "7": "/provas/x/images/image-7.png" },
		});
		assert.ok(Array.isArray(nodes));
		const wrap = (nodes as Array<{ props?: { children?: unknown } }>)[0];
		const children = wrap?.props?.children as Array<{
			props?: { src?: string; alt?: string };
		}>;
		const img = children?.find((n) => n?.props?.src);
		assert.equal(img?.props?.src, "/provas/x/images/image-7.png");
		assert.equal(img?.props?.alt, "Figura 7");
	});

	it("renders markdown table", () => {
		const text = `Antes

| A | B |
|---|---|
| 1 | 2 |

depois`;
		const nodes = renderQuestionContent(text);
		assert.ok(Array.isArray(nodes));
		const tableWrap = (
			nodes as Array<{ props?: { children?: { type?: string } } }>
		).find((n) => {
			const child = n?.props?.children;
			return (
				typeof child === "object" &&
				child !== null &&
				"type" in child &&
				child.type === "table"
			);
		});
		assert.ok(tableWrap);
	});
});
