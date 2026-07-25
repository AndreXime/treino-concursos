import type {
	DisciplinasRange,
	EnunciadosOverrideType,
	GabaritoType,
	NotasEnunciadoType,
	TextosApoioType,
} from "../utils";

export const disciplinas: DisciplinasRange = [
	{ nome: "Língua Portuguesa", de: 1, ate: 10 },
	{ nome: "Língua Inglesa", de: 11, ate: 15 },
	{ nome: "Matemática", de: 16, ate: 20 },
	{ nome: "Atualidades do Mercado Financeiro", de: 21, ate: 25 },
	{ nome: "Matemática Financeira", de: 26, ate: 30 },
	{ nome: "Conhecimentos Bancários", de: 31, ate: 40 },
	{ nome: "Conhecimentos de Informática", de: 41, ate: 55 },
	{ nome: "Vendas e Negociação", de: 56, ate: 70 },
];

const TEXTO_BRAILE = `A história do método braile

Ler no escuro. Quem já tentou sabe que é impossível. Mas foi exatamente a isso que um francês chamado Louis Braille dedicou a vida. Nascido em Coupvray, uma pequena aldeia nos arredores de Paris, em 1809, desde cedo ele mostrou muito interesse pelo trabalho do pai. Seus olhos azuis brilhavam da admiração de vê-lo cortar, com extrema perícia, selas e arreios. Pouco depois de completar 3 anos, o menino começou a brincar na selaria do pai, cortando pequenas tiras de couro. Uma tarde, uma sovela, instrumento usado para perfurar o couro, escapou-lhe da mão e atingiu o seu olho esquerdo. O resultado foi uma infecção que, seis meses depois, afetaria também o olho direito. Aos 5 anos, o garoto estava completamente cego.

A tragédia não o impediu, porém, de frequentar a escola por dois anos e de se tornar ainda um aluno brilhante. Por essa razão, ele ganhou uma bolsa de estudos no Instituto Nacional para Jovens Cegos, em Paris, um colégio interno fundado por Valentin Haüy (1745-1822). Além do currículo normal, Haüy introduzira um sistema especial de alfabetização, no qual letras de forma impressas em relevo, em papelão, eram reconhecidas pelos contornos. Desde o início do curso, Braille destacou-se como o melhor aluno da turma e logo começou a ajudar os colegas. Em 1821, aos 12 anos, conheceu um método inventado pouco antes por Charles Barbier de La Serre, oficial do Exército francês.

O método Barbier, também chamado escrita noturna, era um código de pontos e traços em relevo impressos também em papelão. Destinava-se a enviar ordens cifradas a sentinelas em postos avançados. Estes decodificariam a mensagem até no escuro. Mas, como a ideia não pegou na tropa, Barbier adaptou o método para a leitura de cegos, com o nome de grafia sonora. O sistema permitia a comunicação entre os cegos, pois com ele era possível escrever, algo que o método de Haüy não possibilitava. O de Barbier era fonético: registrava sons e não letras. Dessa forma, as palavras não podiam ser soletradas. Além disso, o fato de um grande número de sinais ser usado para uma única palavra tornava o sistema muito complicado. Apesar dos inconvenientes, foi adotado como método auxiliar por Haüy.

Pesquisando a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la. Em 1824, seu método estava pronto. Primeiro, eliminou os traços, para evitar erros de leitura: em seguida, criou uma célula de seis pontos, divididos em duas colunas de três pontos cada, que podem ser combinados de 63 maneiras diferentes. A posição dos pontos na célula está ao lado.

Em 1826, aos 17 anos, ainda estudante, Braille começou a dar aulas. Embora seu método fizesse sucesso entre os alunos, não podia ensiná-lo na sala de aula, pois ainda não era reconhecido oficialmente. Por isso, Braille dava aulas do revolucionário sistema escondido no quarto, que logo se transformou numa segunda sala de aula.

O braile é lido passando-se a ponta dos dedos sobre os sinais de relevo. Normalmente se usa a mão direita com um ou mais dedos, conforme a habilidade do leitor, enquanto a mão esquerda procura o início da outra linha. Aplica-se a qualquer língua, sem exceção, e também à estenografia, à música – Braille, por sinal, era ainda exímio pianista – e às notações científicas em geral. A escrita é feita mediante o uso da reglete, também idealizada por Braille: trata-se de uma régua especial, de duas linhas, com uma série de janelas de seis furos cada, correspondentes às células braile.

Louis Braille morreu de tuberculose em 1852, com apenas 43 anos. Temia que seu método desaparecesse com ele, mas, finalmente, em 1854 foi oficializado pelo governo francês. No ano seguinte, foi apresentado ao mundo, na Exposição Internacional de Paris, por ordem do imperador Napoleão III (1808-1873), que programou ainda uma série de concertos de piano com ex-alunos de Braille. O sucesso foi imediato, e o sistema se espalhou pelo mundo. Em 1952, o governo francês transferiu os restos mortais de Braille para o Panthéon, em Paris, onde estão sepultados os heróis nacionais.

ATANES, Silvio. Super Interessante. Adaptado.`;

const TEXTO_INGLES = `Fed's Jefferson says inflation is U.S. central bank's most worrisome problem

Inflation is the most serious problem facing the Federal Reserve and "may take some time" to address, Fed Governor Philip Jefferson said on Tuesday in his first public remarks since joining the U.S. central bank's governing body.

"Restoring price stability may take some time and will likely result in a period of below-trend growth," Jefferson told a conference in Atlanta, joining the current Fed consensus for continued interest rate increases to battle price pressures.

"I want to assure you that my colleagues and I are resolute that we will bring inflation back down to 2% ... We are committed to taking the further steps necessary."

Monetary policy that stabilizes inflation "can produce long-term, noninflationary economic expansions ... that economic history suggests is an ideal framework or environment for inclusive growth," Jefferson said. "So, it is important that we get back to that kind of economy. And that is what I think the intent of the Fed is."

Fed Chair Jerome Powell has admitted that the central bank's intent to slow economic growth will cause economic "pain" and likely increased unemployment, but that the worst outcome would be to let inflation take root.

In his remarks, Jefferson said there are reasons to think rigid conditions in the labor market are already easing. Indeed new data on Tuesday showed a severe decrease in job openings in August that began to bring the number of workers sought by companies more in line with the numbers of unemployed.

That could help reduce salary growth, Jefferson said, and there were indications as well that "supply bottlenecks have, finally, begun to resolve," and could also help slow down price increases.

But it remains uncertain how that will work, and in the meantime "inflation remains elevated, and this is the problem that concerns me most," Jefferson said. "Inflation creates economic burdens for households and businesses, and everyone feels its effects."

Available at Reuters. Adapted.`;

export const textosApoio: TextosApoioType = [
	{ de: 1, ate: 10, texto: TEXTO_BRAILE },
	{ de: 11, ate: 15, texto: TEXTO_INGLES },
];

/** Correções que a camada de texto do PDF corrompe (sobrescrito vira dígito colado). */
export const notasEnunciado: NotasEnunciadoType = {
	27: "Dado: 1,01^12 = 1,1268; 1,04^12 = 1,6010",
};

/** Enunciados reescritos (tabelas do PDF ficam ilegíveis ou diferentes da versão limpa). */
export const enunciadosOverride: EnunciadosOverrideType = {
	18: `A sequência dos primeiros 2100 números inteiros positivos foi disposta em uma Tabela, da seguinte forma:
Linhas ímpares: seis números a partir da Coluna 1 (Coluna 7 vazia).
Linhas pares: seis números a partir da Coluna 2 (Coluna 1 vazia).
Ex.: Linha 1 → 1–6; Linha 2 → 7–12; Linha 3 → 13–18; Linha 4 → 19–24; Linha 5 → 25–30; e assim por diante.
Sendo assim, os números 1808 e 2023 estão escritos, respectivamente, nas seguintes colunas:`,
	19: `Três novas agências de um banco estão sendo criadas, e alguns poucos materiais ainda precisam ser comprados. A Tabela a seguir mostra esses materiais e suas respectivas quantidades, pedidas por cada uma dessas agências. Sabe-se que todos os armários são idênticos e têm o mesmo preço, o mesmo ocorrendo com as mesas e com as cadeiras.

Armário | Mesa | Cadeira | Custo total (R$)
Agência X: 4 | 7 | 10 | 7500
Agência Y: 1 | 2 | 3 | 2080
Agência Z: 2 | 2 | 2 | ?

O custo total da compra do material para a Agência Z, em R$, é de`,
	60: `Um consultor levantou o desempenho dos canais de vendas remotos de cinco empresas ao longo de uma semana e montou a Tabela apresentada a seguir.

Empresa | Compras iniciadas na semana | Compras finalizadas na semana
V | 480 | 400
W | 600 | 380
X | 800 | 450
Y | 450 | 330
Z | 580 | 430

Com base nessa Tabela, a menor taxa de abandono foi registrada pela empresa`,
};

export const gabarito: GabaritoType = {
	1: "b",
	2: "b",
	3: "e",
	4: "c",
	5: "a",
	6: "d",
	7: "b",
	8: "e",
	9: "d",
	10: "c",
	11: "b",
	12: "c",
	13: "e",
	14: "e",
	15: "b",
	16: "d",
	17: "b",
	18: "e",
	19: "d",
	20: "a",
	21: "c",
	22: "a",
	23: "b",
	24: "d",
	25: "e",
	26: "a",
	27: "c",
	28: "d",
	29: "b",
	30: "d",
	31: "a",
	32: "b",
	33: "e",
	34: "d",
	35: "c",
	36: "b",
	37: "a",
	38: "a",
	39: "e",
	40: "b",
	41: "b",
	42: "a",
	43: "a",
	44: "b",
	45: "c",
	46: "d",
	47: "e",
	48: "d",
	49: "d",
	50: "b",
	51: "a",
	52: "d",
	53: "e",
	54: "b",
	55: "d",
	56: "d",
	57: "b",
	58: "d",
	59: "c",
	60: "a",
	61: "e",
	62: "d",
	63: "c",
	64: "d",
	65: "b",
	66: "a",
	67: "a",
	68: "e",
	69: "c",
	70: "b",
};
