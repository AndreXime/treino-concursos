import caixa2024Json from "@/data/Caixa - 2024 - Tecnico Bancario Novo.json";
import inss2022Json from "@/data/INSS - 2022 - Tecnico do Seguro Social.json";
import provaAJson from "@/data/PROVA A - AGENTE COMERCIAL - GABARITO 1.json";
import type { Prova } from "@/lib/questions/types";

export const provas: Prova[] = [
	provaAJson as Prova,
	caixa2024Json as Prova,
	inss2022Json as Prova,
];
