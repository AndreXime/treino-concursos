import { provas } from "@/data/provas";
import type {
	Prova,
	ProvaListFilters,
	ProvaRepository,
	Question,
	QuestionFilterOptions,
	QuestionFilters,
} from "@/lib/questions/types";

function matchesFilters(
	question: Question,
	filters?: QuestionFilters,
): boolean {
	if (!filters?.disciplina) {
		return true;
	}
	return question.disciplina === filters.disciplina;
}

export class InMemoryProvaRepository implements ProvaRepository {
	constructor(private readonly allProvas: Prova[]) {}

	async listProvas(filters?: ProvaListFilters): Promise<Prova[]> {
		if (!filters?.area) {
			return this.allProvas;
		}
		return this.allProvas.filter((prova) => prova.area === filters.area);
	}

	async listAreas(): Promise<string[]> {
		return [...new Set(this.allProvas.map((prova) => prova.area))].sort(
			(a, b) => a.localeCompare(b, "pt-BR"),
		);
	}

	async getProvaById(provaId: string): Promise<Prova | null> {
		return this.allProvas.find((prova) => prova.id === provaId) ?? null;
	}

	async listQuestoes(
		provaId: string,
		filters?: QuestionFilters,
	): Promise<Question[]> {
		const prova = await this.getProvaById(provaId);
		if (!prova) {
			return [];
		}
		return prova.questoes.filter((question) =>
			matchesFilters(question, filters),
		);
	}

	async getQuestao(
		provaId: string,
		questionId: string,
	): Promise<Question | null> {
		const prova = await this.getProvaById(provaId);
		if (!prova) {
			return null;
		}
		return (
			prova.questoes.find((question) => question.id === questionId) ?? null
		);
	}

	async getFilterOptions(provaId: string): Promise<QuestionFilterOptions> {
		const prova = await this.getProvaById(provaId);
		if (!prova) {
			return { disciplinas: [] };
		}
		const disciplinas = [
			...new Set(prova.questoes.map((q) => q.disciplina)),
		].sort();
		return { disciplinas };
	}

	async getNextQuestionId(
		provaId: string,
		currentQuestionId: string,
		filters?: QuestionFilters,
	): Promise<string | null> {
		const filtered = await this.listQuestoes(provaId, filters);
		const currentIndex = filtered.findIndex(
			(question) => question.id === currentQuestionId,
		);

		if (currentIndex === -1 || currentIndex >= filtered.length - 1) {
			return null;
		}

		return filtered[currentIndex + 1]?.id ?? null;
	}
}

export function getProvaRepository(): ProvaRepository {
	return new InMemoryProvaRepository(provas);
}
