import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
	parseCebraspeGabarito,
	parseCesgranrioGabarito,
} from "./gabarito";

describe("parseCesgranrioGabarito", () => {
	it("parses Caixa-style block", () => {
		const text = `
PROVA 1 - TÉCNICO BANCÁRIO NOVO - GABARITO 1
1-A 2-B 3-E 4-B 5-C
6-D 7-A 8-B 9-E 10 - C
59 - E 60 - D
PROVA 1 - TÉCNICO BANCÁRIO NOVO - GABARITO 2
1-Z
`;
		const g = parseCesgranrioGabarito(text, {
			blockMarker: "PROVA 1 - TÉCNICO BANCÁRIO NOVO - GABARITO 1",
		});
		assert.equal(g[1], "a");
		assert.equal(g[10], "c");
		assert.equal(g[60], "d");
		assert.equal(g[1] === "z", false);
	});

	it("isolates CNU bloco 8 gabarito 1", () => {
		const text = `
BLOCO 7 – X – GABARITO 1
1- A
BLOCO 8 – NÍVEL INTERMEDIÁRIO – LÍNGUA PORTUGUESA – MANHÃ – GABARITO 1
1- C
2- C
15 - B
BLOCO 8 – NÍVEL INTERMEDIÁRIO – LÍNGUA PORTUGUESA – MANHÃ – GABARITO 2
1- E
`;
		const g = parseCesgranrioGabarito(text, {
			blockMarker:
				"BLOCO 8 – NÍVEL INTERMEDIÁRIO – LÍNGUA PORTUGUESA – MANHÃ – GABARITO 1",
		});
		assert.equal(Object.keys(g).length, 3);
		assert.equal(g[1], "c");
		assert.equal(g[15], "b");
	});
});

describe("parseCebraspeGabarito", () => {
	it("parses item/gabarito pairs including X", () => {
		const text = `
Item
Gabarito
1
E
2
C
49
X
50
C
`;
		const g = parseCebraspeGabarito(text);
		assert.equal(g[1], "e");
		assert.equal(g[2], "c");
		assert.equal(g[49], "x");
		assert.equal(g[50], "c");
	});

	it("parses tab-separated number/answer rows", () => {
		const text = `1 \t2 \t3 \t49 \t50
E \tC \tE \tX \tC`;
		const g = parseCebraspeGabarito(text);
		assert.equal(g[1], "e");
		assert.equal(g[49], "x");
		assert.equal(g[50], "c");
	});
});
