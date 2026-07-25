export interface QuestionOption {
	id: string;
	texto: string;
}

export interface Question {
	id: string;
	provaId: string;
	numero: number;
	enunciado: string;
	alternativas: QuestionOption[];
	gabaritoId: string;
	disciplina: string;
}

export interface Prova {
	id: string;
	titulo: string;
	orgao: string;
	cargo: string;
	banca: string;
	ano: number;
	edital: string;
	questoes: Question[];
}

export interface QuestionFilters {
	disciplina?: string;
}

export interface QuestionFilterOptions {
	disciplinas: string[];
}

export interface ProvaRepository {
	listProvas(): Promise<Prova[]>;
	getProvaById(provaId: string): Promise<Prova | null>;
	listQuestoes(provaId: string, filters?: QuestionFilters): Promise<Question[]>;
	getQuestao(provaId: string, questionId: string): Promise<Question | null>;
	getFilterOptions(provaId: string): Promise<QuestionFilterOptions>;
	getNextQuestionId(
		provaId: string,
		currentQuestionId: string,
		filters?: QuestionFilters,
	): Promise<string | null>;
}
