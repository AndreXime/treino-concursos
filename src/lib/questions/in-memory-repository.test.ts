import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InMemoryProvaRepository } from "./in-memory-repository";
import type { Prova } from "./types";

function stubProva(partial: Partial<Prova> & Pick<Prova, "id" | "area">): Prova {
	return {
		titulo: "T",
		orgao: "O",
		cargo: "C",
		banca: "B",
		ano: 2024,
		edital: "E",
		questoes: [],
		...partial,
	};
}

const provas: Prova[] = [
	stubProva({ id: "bb", area: "Bancário", titulo: "BB" }),
	stubProva({ id: "caixa", area: "Bancário", titulo: "Caixa" }),
	stubProva({ id: "inss", area: "Previdência", titulo: "INSS" }),
	stubProva({
		id: "cnu",
		area: "Administração pública",
		titulo: "CNU",
	}),
];

describe("InMemoryProvaRepository listagem por área", () => {
	const repo = new InMemoryProvaRepository(provas);

	it("listProvas sem filtro retorna todas", async () => {
		const list = await repo.listProvas();
		assert.equal(list.length, 4);
	});

	it("listProvas com area filtra por match exato", async () => {
		const list = await repo.listProvas({ area: "Bancário" });
		assert.deepEqual(
			list.map((p) => p.id).sort(),
			["bb", "caixa"],
		);
	});

	it("listProvas com area inexistente retorna vazio", async () => {
		const list = await repo.listProvas({ area: "Militar" });
		assert.deepEqual(list, []);
	});

	it("listAreas retorna únicas ordenadas", async () => {
		const areas = await repo.listAreas();
		assert.deepEqual(areas, [
			"Administração pública",
			"Bancário",
			"Previdência",
		]);
	});
});
