import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	buildProvasListHref,
	parseProvasListSearchParams,
} from "./list-url";

describe("provas list url", () => {
	it("buildProvasListHref sem area retorna /provas", () => {
		assert.equal(buildProvasListHref(), "/provas");
		assert.equal(buildProvasListHref(""), "/provas");
		assert.equal(buildProvasListHref(undefined), "/provas");
	});

	it("buildProvasListHref com area encodeia query", () => {
		assert.equal(
			buildProvasListHref("Bancário"),
			`/provas?${new URLSearchParams({ area: "Bancário" }).toString()}`,
		);
		assert.equal(
			buildProvasListHref("Administração pública"),
			`/provas?${new URLSearchParams({ area: "Administração pública" }).toString()}`,
		);
	});

	it("parseProvasListSearchParams ignora vazio", () => {
		assert.deepEqual(parseProvasListSearchParams({}), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "" }), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "   " }), {});
		assert.deepEqual(parseProvasListSearchParams({ area: "Bancário" }), {
			area: "Bancário",
		});
	});
});
