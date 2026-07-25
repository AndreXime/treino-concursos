import type { Prova, Question } from "@/lib/questions/types"

const PROVA_ID = "bb-ac-2022-a-g1"

const COMENTARIO =
  "Gabarito oficial Cesgranrio — Prova A, Gabarito 1 (BB Escriturário Agente Comercial, Seleção Externa 2022/001)."

const TEXTO_BRAILE = `A história do método braile

Ler no escuro. Quem já tentou sabe que é impossível. Mas foi exatamente a isso que um francês chamado Louis Braille dedicou a vida. Nascido em Coupvray, uma pequena aldeia nos arredores de Paris, em 1809, desde cedo ele mostrou muito interesse pelo trabalho do pai. Seus olhos azuis brilhavam da admiração de vê-lo cortar, com extrema perícia, selas e arreios. Pouco depois de completar 3 anos, o menino começou a brincar na selaria do pai, cortando pequenas tiras de couro. Uma tarde, uma sovela, instrumento usado para perfurar o couro, escapou-lhe da mão e atingiu o seu olho esquerdo. O resultado foi uma infecção que, seis meses depois, afetaria também o olho direito. Aos 5 anos, o garoto estava completamente cego.

A tragédia não o impediu, porém, de frequentar a escola por dois anos e de se tornar ainda um aluno brilhante. Por essa razão, ele ganhou uma bolsa de estudos no Instituto Nacional para Jovens Cegos, em Paris, um colégio interno fundado por Valentin Haüy (1745-1822). Além do currículo normal, Haüy introduzira um sistema especial de alfabetização, no qual letras de forma impressas em relevo, em papelão, eram reconhecidas pelos contornos. Desde o início do curso, Braille destacou-se como o melhor aluno da turma e logo começou a ajudar os colegas. Em 1821, aos 12 anos, conheceu um método inventado pouco antes por Charles Barbier de La Serre, oficial do Exército francês.

O método Barbier, também chamado escrita noturna, era um código de pontos e traços em relevo impressos também em papelão. Destinava-se a enviar ordens cifradas a sentinelas em postos avançados. Estes decodificariam a mensagem até no escuro. Mas, como a ideia não pegou na tropa, Barbier adaptou o método para a leitura de cegos, com o nome de grafia sonora. O sistema permitia a comunicação entre os cegos, pois com ele era possível escrever, algo que o método de Haüy não possibilitava. O de Barbier era fonético: registrava sons e não letras. Dessa forma, as palavras não podiam ser soletradas. Além disso, o fato de um grande número de sinais ser usado para uma única palavra tornava o sistema muito complicado. Apesar dos inconvenientes, foi adotado como método auxiliar por Haüy.

Pesquisando a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la. Em 1824, seu método estava pronto. Primeiro, eliminou os traços, para evitar erros de leitura: em seguida, criou uma célula de seis pontos, divididos em duas colunas de três pontos cada, que podem ser combinados de 63 maneiras diferentes. A posição dos pontos na célula está ao lado.

Em 1826, aos 17 anos, ainda estudante, Braille começou a dar aulas. Embora seu método fizesse sucesso entre os alunos, não podia ensiná-lo na sala de aula, pois ainda não era reconhecido oficialmente. Por isso, Braille dava aulas do revolucionário sistema escondido no quarto, que logo se transformou numa segunda sala de aula.

O braile é lido passando-se a ponta dos dedos sobre os sinais de relevo. Normalmente se usa a mão direita com um ou mais dedos, conforme a habilidade do leitor, enquanto a mão esquerda procura o início da outra linha. Aplica-se a qualquer língua, sem exceção, e também à estenografia, à música – Braille, por sinal, era ainda exímio pianista – e às notações científicas em geral. A escrita é feita mediante o uso da reglete, também idealizada por Braille: trata-se de uma régua especial, de duas linhas, com uma série de janelas de seis furos cada, correspondentes às células braile.

Louis Braille morreu de tuberculose em 1852, com apenas 43 anos. Temia que seu método desaparecesse com ele, mas, finalmente, em 1854 foi oficializado pelo governo francês. No ano seguinte, foi apresentado ao mundo, na Exposição Internacional de Paris, por ordem do imperador Napoleão III (1808-1873), que programou ainda uma série de concertos de piano com ex-alunos de Braille. O sucesso foi imediato, e o sistema se espalhou pelo mundo. Em 1952, o governo francês transferiu os restos mortais de Braille para o Panthéon, em Paris, onde estão sepultados os heróis nacionais.

ATANES, Silvio. Super Interessante. Adaptado.`

const TEXTO_INGLES = `Fed's Jefferson says inflation is U.S. central bank's most worrisome problem

Inflation is the most serious problem facing the Federal Reserve and "may take some time" to address, Fed Governor Philip Jefferson said on Tuesday in his first public remarks since joining the U.S. central bank's governing body.

"Restoring price stability may take some time and will likely result in a period of below-trend growth," Jefferson told a conference in Atlanta, joining the current Fed consensus for continued interest rate increases to battle price pressures.

"I want to assure you that my colleagues and I are resolute that we will bring inflation back down to 2% ... We are committed to taking the further steps necessary."

Monetary policy that stabilizes inflation "can produce long-term, noninflationary economic expansions ... that economic history suggests is an ideal framework or environment for inclusive growth," Jefferson said. "So, it is important that we get back to that kind of economy. And that is what I think the intent of the Fed is."

Fed Chair Jerome Powell has admitted that the central bank's intent to slow economic growth will cause economic "pain" and likely increased unemployment, but that the worst outcome would be to let inflation take root.

In his remarks, Jefferson said there are reasons to think rigid conditions in the labor market are already easing. Indeed new data on Tuesday showed a severe decrease in job openings in August that began to bring the number of workers sought by companies more in line with the numbers of unemployed.

That could help reduce salary growth, Jefferson said, and there were indications as well that "supply bottlenecks have, finally, begun to resolve," and could also help slow down price increases.

But it remains uncertain how that will work, and in the meantime "inflation remains elevated, and this is the problem that concerns me most," Jefferson said. "Inflation creates economic burdens for households and businesses, and everyone feels its effects."

Available at Reuters. Adapted.`

function q(
  numero: number,
  disciplina: string,
  gabaritoId: string,
  enunciado: string,
  alternativas: [string, string, string, string, string],
): Question {
  return {
    id: `${PROVA_ID}-q${String(numero).padStart(2, "0")}`,
    provaId: PROVA_ID,
    numero,
    enunciado,
    alternativas: [
      { id: "a", texto: alternativas[0] },
      { id: "b", texto: alternativas[1] },
      { id: "c", texto: alternativas[2] },
      { id: "d", texto: alternativas[3] },
      { id: "e", texto: alternativas[4] },
    ],
    gabaritoId,
    comentario: COMENTARIO,
    disciplina,
  }
}

const questoes: Question[] = [
  q(1, "Língua Portuguesa", "b", `${TEXTO_BRAILE}\n\nA partir da leitura do texto, constata-se que Braille`, [
    "queria seguir o ofício do pai.",
    "estudou com bolsa de estudos.",
    "trabalhava em selarias quando criança.",
    "foi adotado por Valentin Haüy depois da tragédia.",
    "começou a dar aulas quando atingiu a maioridade.",
  ]),
  q(2, "Língua Portuguesa", "b", `${TEXTO_BRAILE}\n\nDiferentemente do método de Barbier, o método de Haüy`, [
    "possibilitava a escrita.",
    "usava letras em relevo.",
    "apresentava pontos e traços.",
    "impossibilitava soletrar palavras.",
    "era conhecido como grafia sonora.",
  ]),
  q(
    3,
    "Língua Portuguesa",
    "e",
    `${TEXTO_BRAILE}\n\nConsidere a expressão em destaque da seguinte passagem do parágrafo 3:\n\nO método Barbier, também chamado escrita noturna, era um código de pontos e traços em relevo impressos também em papelão. Destinava-se a enviar ordens cifradas a sentinelas em postos avançados. Estes decodificariam a mensagem até no escuro. Mas como a ideia não pegou na tropa, Barbier adaptou o método para a leitura de cegos, com o nome de grafia sonora. O sistema permitia a comunicação entre os cegos.\n\nNo trecho, por meio do processo de coesão textual, a expressão destacada retoma`,
    [
      "“um código de pontos e traços em relevo impressos também em papelão”",
      "“ordens cifradas”",
      "“a mensagem”",
      "“a ideia”",
      "“grafia sonora”",
    ],
  ),
  q(
    4,
    "Língua Portuguesa",
    "c",
    `${TEXTO_BRAILE}\n\nO trecho do parágrafo 4 “Pesquisando a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la” pode ser reescrito, sem alterar o sentido que apresenta no texto, como:`,
    [
      "Para pesquisar a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la.",
      "Embora pesquisasse a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la.",
      "Quando pesquisava a fundo a grafia sonora, Braille percebeu suas limitações e pôs-se a aperfeiçoá-la.",
      "Apesar de pesquisar a fundo a grafia sonora, Braille percebia suas limitações e punha-se a aperfeiçoá-la.",
      "Se pesquisasse a fundo a grafia sonora, Braille perceberia suas limitações e pôr-se-ia a aperfeiçoá-la.",
    ],
  ),
  q(
    5,
    "Língua Portuguesa",
    "a",
    `${TEXTO_BRAILE}\n\nEm “No ano seguinte, foi apresentado ao mundo, na Exposição Internacional de Paris, por ordem do imperador Napoleão III (1808-1873), que programou ainda uma série de concertos de piano com ex-alunos de Braille” (parágrafo 7), a palavra em destaque apresenta o mesmo sentido que em:`,
    [
      "Louis Braille criou um método revolucionário e ainda era excelente pianista.",
      "Vencer barreiras relacionadas à acessibilidade ainda é um desafio.",
      "O método Braille ainda era desconhecido por muitas pessoas.",
      "Os restos mortais de Braille ainda estão no Panthéon.",
      "A reglete ainda é usada por deficientes visuais.",
    ],
  ),
  q(
    6,
    "Língua Portuguesa",
    "d",
    `${TEXTO_BRAILE}\n\nNo trecho do parágrafo 2, “conheceu um método inventado pouco antes por Charles Barbier de La Serre, oficial do Exército francês”, a vírgula está empregada com a mesma função que em:`,
    [
      "A cegueira não o impediu, no entanto, de estudar.",
      "Perspicaz, Braille percebeu falhas no método de Barbier.",
      "A infecção, seis meses depois, afetou o segundo olho de Braille.",
      "Escrita noturna, método de Barbier, não teve sucesso quando criado.",
      "No Instituto Nacional para Jovens Cegos, Braille desenvolveu seus estudos.",
    ],
  ),
  q(
    7,
    "Língua Portuguesa",
    "b",
    `${TEXTO_BRAILE}\n\nEm “Mas, como a ideia não pegou na tropa, Barbier adaptou o método para a leitura de cegos” (parágrafo 3), a oração destacada apresenta o valor semântico de`,
    ["fim", "causa", "tempo", "proporção", "consequência"],
  ),
  q(
    8,
    "Língua Portuguesa",
    "e",
    `${TEXTO_BRAILE}\n\nDe acordo com a norma-padrão da língua portuguesa, o sinal indicativo de crase está corretamente empregado em:`,
    [
      "Braille foi forçado à superar sua cegueira.",
      "O professor referiu-se à um aluno brilhante: Braille.",
      "Braille não foi reconhecido até que se consolidasse à oficialização de seu método.",
      "Ele queria ensinar à todos os alunos o seu sistema de escrita.",
      "Todos estavam à espera de que o valor de Braille fosse reconhecido.",
    ],
  ),
  q(
    9,
    "Língua Portuguesa",
    "d",
    `${TEXTO_BRAILE}\n\nA frase em que a palavra destacada respeita as regras da concordância nominal de acordo com a norma-padrão da língua portuguesa é:`,
    [
      "Hoje, Braille e seu método são muitos conhecidos.",
      "Depois do acidente, Braille e sua família não ficaram só.",
      "Há bastante razões para se considerar Braille um herói nacional.",
      "Os alunos ficavam meio desorientados com o método de Barbier.",
      "O sistema de códigos de Braille tinha menas limitações que o de Barbier.",
    ],
  ),
  q(
    10,
    "Língua Portuguesa",
    "c",
    `${TEXTO_BRAILE}\n\nO pronome oblíquo átono está colocado de acordo com a norma-padrão da língua portuguesa em:`,
    [
      "Me surpreende a história de vida de Braille.",
      "Seu método não trouxe-lhe reconhecimento em vida.",
      "O menino cego aos cinco anos tornar-se-ia um herói nacional na França.",
      "Quantos impressionaram-nos como Braille?",
      "Braille recebia os alunos e sempre auxiliava-os com o método criado.",
    ],
  ),
  q(11, "Língua Inglesa", "b", `${TEXTO_INGLES}\n\nThe main purpose of the text is to`, [
    "argue that slowing the economic growth will definitely cause inflation to take root.",
    "indicate that inflation is a serious problem, and it needs to be adequately dealt with.",
    "suggest that restoring price stability will certainly increase inflation.",
    "show that controlling inflation is a minor concern, compared to unemployment.",
    "inform that the U.S. central bank’s monetary policy has already decreased inflation to 2%.",
  ]),
  q(
    12,
    "Língua Inglesa",
    "c",
    `${TEXTO_INGLES}\n\nIn the segment of 5th paragraph “the worst outcome would be to let inflation take root”, the words would be signal`,
    [
      "a certain future",
      "a definite past",
      "a hypothetical possibility",
      "an indefinite present",
      "an inevitable destiny",
    ],
  ),
  q(
    13,
    "Língua Inglesa",
    "e",
    `${TEXTO_INGLES}\n\nIn the fragment of 5th paragraph “the worst outcome would be to let inflation take root”, the expression take root could be replaced, with no change in meaning, by`,
    [
      "be extinguished.",
      "become inactive.",
      "come to an agreement.",
      "be disconsidered.",
      "become established.",
    ],
  ),
  q(
    14,
    "Língua Inglesa",
    "e",
    `${TEXTO_INGLES}\n\nIn the section of last paragraph “it remains uncertain how that will work, and in the meantime inflation remains elevated”, the expression in the meantime is synonymous with`,
    ["in the past", "sometimes", "in the future", "always", "for now"],
  ),
  q(
    15,
    "Língua Inglesa",
    "b",
    `${TEXTO_INGLES}\n\nThe fragment of last paragraph “Inflation creates economic burdens for households and businesses” means that inflation`,
    [
      "alleviates families and jobs.",
      "oppresses families and companies.",
      "stimulates institutions and commerce.",
      "supports institutions and jobs.",
      "promotes savings and investments.",
    ],
  ),
  q(
    16,
    "Matemática",
    "d",
    `As 2023 assertivas a seguir estão escritas em um caderno.
1) Só 1 assertiva é falsa neste caderno.
2) Só 2 assertivas são falsas neste caderno.
3) Só 3 assertivas são falsas neste caderno.
...
n) Só n assertivas são falsas neste caderno.
...
2022) Só 2022 assertivas são falsas neste caderno.
2023) Só 2023 assertivas são falsas neste caderno.
Considerando-se essas 2023 assertivas, o número de assertivas verdadeiras é`,
    ["2023", "2022", "1011", "1", "0"],
  ),
  q(
    17,
    "Matemática",
    "b",
    `J convenceu o diretor de um curso preparatório a abrir uma turma especialmente para o concurso em que ele pretende se inscrever, e comprometeu-se a trazer mais alunos para formar essa turma. O diretor do curso estabeleceu a seguinte condição:
— Uma sala com 70 lugares, ou seja, com capacidade para até 70 estudantes, será disponibilizada para a turma, desde que cada estudante, incluindo você, J, pague mensalmente R$ 660,00, mais R$ 30,00 por cada lugar vago.
Considerando-se a condição estabelecida pelo diretor, para que o curso tenha arrecadação mensal máxima com essa turma, ela deverá ter exatamente x estudantes.
Dividindo-se x por 5, obtém-se resto igual a`,
    ["0", "1", "2", "3", "4"],
  ),
  q(
    18,
    "Matemática",
    "e",
    `A sequência dos primeiros 2100 números inteiros positivos foi disposta em uma Tabela, da seguinte forma:
Linhas ímpares: seis números a partir da Coluna 1 (Coluna 7 vazia).
Linhas pares: seis números a partir da Coluna 2 (Coluna 1 vazia).
Ex.: Linha 1 → 1–6; Linha 2 → 7–12; Linha 3 → 13–18; Linha 4 → 19–24; Linha 5 → 25–30; e assim por diante.
Sendo assim, os números 1808 e 2023 estão escritos, respectivamente, nas seguintes colunas:`,
    ["6 e 4", "3 e 3", "6 e 3", "6 e 2", "3 e 2"],
  ),
  q(
    19,
    "Matemática",
    "d",
    `Três novas agências de um banco estão sendo criadas, e alguns poucos materiais ainda precisam ser comprados. A Tabela a seguir mostra esses materiais e suas respectivas quantidades, pedidas por cada uma dessas agências. Sabe-se que todos os armários são idênticos e têm o mesmo preço, o mesmo ocorrendo com as mesas e com as cadeiras.

Armário | Mesa | Cadeira | Custo total (R$)
Agência X: 4 | 7 | 10 | 7500
Agência Y: 1 | 2 | 3 | 2080
Agência Z: 2 | 2 | 2 | ?

O custo total da compra do material para a Agência Z, em R$, é de`,
    ["2.200,00", "2.380,00", "2.460,00", "2.520,00", "2.740,00"],
  ),
  q(
    20,
    "Matemática",
    "a",
    `Um investidor muito supersticioso escolhe, mensalmente, um conjunto de três tipos de investimento para aplicar alguma quantia. Ele toma por regra dispor apenas dos mesmos nove tipos de investimentos e nunca repetir, em um mesmo mês, o mesmo conjunto de três tipos já usados em qualquer mês anterior. Por exemplo, se no 1º mês ele escolheu os investimentos de tipos A, B e C; no 2º mês, A, B e D; e no 3º mês, E, F e G, então ele não poderá investir novamente, num mesmo mês, por exemplo, no conjunto dos investimentos de tipos A, B e C, por já tê-lo usado no 1º mês.
Considerando-se as condições descritas, o número máximo de meses em que o investidor poderá fazer esses investimentos é`,
    ["84", "60", "56", "48", "35"],
  ),
  q(21, "Atualidades do Mercado Financeiro", "c", `No Brasil, uma característica do modelo de negócios dos bancos na era digital é a`, [
    "maior proximidade física com os clientes nas agências bancárias.",
    "dispensa de regulação por parte do Banco Central do Brasil.",
    "disseminação das plataformas on-line.",
    "lentidão dos canais de comunicação.",
    "menor oferta de produtos e serviços aos clientes.",
  ]),
  q(
    22,
    "Atualidades do Mercado Financeiro",
    "a",
    `Quando um indivíduo, ao comprar um produto em uma loja, efetua o pagamento utilizando papel-moeda (cash), a moeda estará cumprindo, nessa operação, a função de`,
    [
      "meio de troca",
      "unidade de medida de valor",
      "reserva de valor",
      "financiamento",
      "precaução",
    ],
  ),
  q(
    23,
    "Atualidades do Mercado Financeiro",
    "b",
    `O Internet banking facilita a realização de transações bancárias, mas também oferece risco para usuários finais que são pessoas naturais. Para minimizar os riscos, o Banco Central do Brasil determina que os participantes provedores de conta transacional do Pix devem estabelecer limites máximos de valor para iniciação de um Pix com finalidade de compra ou de transferência, por conta transacional, e possibilidade de diferenciação do limite estabelecido para o período diurno e para o período noturno.
Os participantes poderão, a seu critério, ofertar funcionalidade para que o usuário final possa solicitar que o período noturno compreenda o período entre`,
    [
      "21 horas e 6 horas",
      "22 horas e 6 horas",
      "23 horas e 6 horas",
      "0 hora e 7 horas",
      "1 hora e 7 horas",
    ],
  ),
  q(
    24,
    "Atualidades do Mercado Financeiro",
    "d",
    `Existem grupos que trabalham cooperativamente para validar as transações na Blockchain, por meio da solução de cálculos complexos, e que concordam em dividir, proporcionalmente, recompensas de bloco entre eles, de acordo com sua contribuição nesse trabalho.
Tais grupos são denominados`,
    [
      "grupos de data lake",
      "redes de extração",
      "cooperativas de blocos",
      "pools de mineração",
      "pools de distribuição",
    ],
  ),
  q(
    25,
    "Atualidades do Mercado Financeiro",
    "e",
    `O Banco Central tem dedicado atenção às entidades identificadas como shadow banking (bancos sombra).
Essas entidades já se encontram sob alguma regulação e supervisão, feita por autoridades com jurisdição nacional, como a(o)`,
    [
      "Banco Caixa Econômica",
      "Banco do Brasil",
      "Banco SICRED",
      "Open finance",
      "CVM",
    ],
  ),
  q(
    26,
    "Matemática Financeira",
    "a",
    `Um cliente tem duas opções para investir R$ 100.000,00 em um prazo de 2 anos. A primeira opção oferece um retorno de 12% ao ano no regime de juros compostos, mas há cobrança de 15% de imposto sobre os juros proporcionados pelo investimento. Já a segunda opção oferece um retorno de 10% ao ano no regime de juros compostos, mas sem qualquer cobrança de imposto.
Ao escolher a opção mais lucrativa, ao final de exatos dois anos de investimento, esse cliente receberá a mais, em relação à opção menos lucrativa, uma quantia, em R$, igual a`,
    ["624,00", "824,00", "1.524,00", "2.940,00", "4.440,00"],
  ),
  q(
    27,
    "Matemática Financeira",
    "c",
    `Um banco oferece para um cliente um investimento que lhe proporcionará uma taxa de juros de 1% ao mês, no regime de juros compostos. Esse mesmo banco também disponibiliza, para o mesmo cliente, uma linha de crédito de fácil acesso chamada cheque especial, cobrando uma taxa de juros de 4% ao mês, no regime de juros compostos.
Para esse cliente, a diferença entre a taxa anual da operação financeira disponível no cheque especial e a taxa anual da operação financeira disponível no investimento oferecido é

Dado: 1,01^12 = 1,1268; 1,04^12 = 1,6010`,
    ["12,68%", "36,00%", "47,42%", "48,68%", "60,10%"],
  ),
  q(
    28,
    "Matemática Financeira",
    "d",
    `O capital de um cliente do segmento ultra-especial ficou aplicado durante 50 dias a uma taxa de juros simples de 1,5% ao mês. Ao final desse prazo, o cliente resgatou tudo e pagou R$ 4.500,00, referentes a 22,5% de imposto de renda sobre os juros proporcionados pelo investimento.
Considerando-se o mês com 30 dias, o valor aplicado nessa operação, em R$, foi`,
    ["450.000,00", "700.000,00", "750.000,00", "800.000,00", "950.000,00"],
  ),
  q(
    29,
    "Matemática Financeira",
    "b",
    `A empresa XYZ planeja comprar um equipamento em janeiro de 2023, cujo preço à vista é R$ 300.000,00, pagando com uma entrada e mais duas parcelas. A entrada, correspondente à primeira parcela, será paga em janeiro de 2023 (no ato da compra); a segunda parcela, em janeiro de 2024, no valor de R$ 150.000,00; e a terceira parcela, em janeiro de 2025, também no valor de R$ 150.000,00.
Considerando-se a equivalência financeira a juros compostos, se a taxa de juros cobrada pelo vendedor é de 10% ao ano, o valor da entrada (primeira parcela no ato da compra), em R$, será, aproximadamente,`,
    ["20.000,00", "39.670,00", "48.750,00", "54.280,00", "63.000,00"],
  ),
  q(
    30,
    "Matemática Financeira",
    "d",
    `Uma empresa tomou um empréstimo de R$ 50.000,00 em janeiro de 2022, a uma taxa de juros compostos de 5% ao mês. Para amortizar parte da dívida, a empresa pagou R$ 30.000,00 em março de 2022, e R$ 20.000,00 em abril de 2022.
No que se refere a esse empréstimo, o valor, em R$, do saldo devedor dessa empresa, em maio de 2022, era, aproximadamente,`,
    ["3.625,00", "3.806,00", "6.381,00", "6.700,00", "7.201,00"],
  ),
  q(
    31,
    "Conhecimentos Bancários",
    "a",
    `Um consultor financeiro capta clientela para investir em instituição financeira legalmente autorizada a funcionar pelo Banco Central do Brasil, sendo eficiente na sua atividade. Em determinado momento, é informado pelo seu contato na referida instituição de que um dos indivíduos indicados estaria realizando operações de aportes de recursos em descompasso com sua capacidade financeira.
Nos termos da Carta Circular nº 4.001, de 29 de janeiro de 2020, os fatos descritos pertinentes aos aportes constituem a ocorrência de indícios de suspeita de lavagem de dinheiro para fins dos procedimentos relacionados às suas atividades financeiras de`,
    ["monitoramento", "bloqueio", "interdição", "exclusão", "análise"],
  ),
  q(
    32,
    "Conhecimentos Bancários",
    "b",
    `Uma funcionária de determinada instituição financeira segue religião de matriz africana, fato conhecido dos demais colegas de trabalho. Após reunião com a equipe da qual participa, é surpreendida com afirmações desairosas em relação aos que são integrantes da referida religião. Diante disso, formula reclamação ao Coordenador Geral do grupo de trabalho, assentando sua inconformidade com o evento.
Essa situação não ocorreria facilmente no Banco do Brasil, uma vez que, nos termos do seu Código de Ética, as relações devem ser pautadas pelo respeito a várias diferenças, dentre as quais figuram as diferenças`,
    ["pessoais", "religiosas", "cambiais", "preventivas", "alteradas"],
  ),
  q(
    33,
    "Conhecimentos Bancários",
    "e",
    `Um pesquisador em ciências da informação busca descobrir como os vários sistemas financeiros nacionais tratam a proteção dos seus bancos de dados contra ataques cibernéticos que se tornaram comuns na contemporaneidade.
Nos termos da Resolução CMN nº 4.658, de 26 de abril de 2018, que dispõe sobre a política de segurança cibernética aplicável às instituições financeiras, devem ser observados, no mínimo, os controles específicos, incluindo os voltados para a rastreabilidade da informação, que busquem garantir a segurança das`,
    [
      "relações empresariais",
      "situações sigilosas",
      "bases financeiras",
      "questões litigiosas",
      "informações sensíveis",
    ],
  ),
  q(
    34,
    "Conhecimentos Bancários",
    "d",
    `Se os preços das mercadorias produzidas no Brasil e nos Estados Unidos forem calculados em uma mesma moeda comum (por exemplo, em Dólar americano) e, na pressuposição de que todos os demais fatores permaneçam constantes, uma desvalorização real da moeda brasileira em relação ao Dólar americano`,
    [
      "desestimulará as exportações brasileiras para os Estados Unidos.",
      "tornará relativamente mais baratas as viagens turísticas dos brasileiros para os Estados Unidos.",
      "encarecerá relativamente os produtos exportados do Brasil para os Estados Unidos.",
      "barateará relativamente os produtos exportados do Brasil para os Estados Unidos.",
      "manterá inalterados os preços dos produtos exportados do Brasil para os Estados Unidos.",
    ],
  ),
  q(35, "Conhecimentos Bancários", "c", `A função principal das operações de Tesouraria bancária é`, [
    "aprimorar a qualidade de atendimento aos clientes.",
    "ampliar o uso de serviços digitais nas transações financeiras.",
    "administrar os fluxos de despesas e receitas da instituição financeira, visando a controlar os gastos e a maximizar os lucros.",
    "aumentar a carteira de serviços financeiros oferecidos aos clientes.",
    "gerenciar as atividades de marketing, publicidade e propaganda da instituição financeira.",
  ]),
  q(
    36,
    "Conhecimentos Bancários",
    "b",
    `O comportamento das taxas de câmbio nominais e reais é fundamental para a tomada de decisões por parte de produtores e investidores. Enquanto as taxas de câmbio nominais são cotadas diariamente nos mercados de câmbio, as taxas de câmbio reais são determinadas pelas forças subjacentes à paridade real do poder de compra entre a moeda nacional e a moeda estrangeira.
Considere o conceito de paridade relativa real do poder de compra. Considere, também, que, no início de um determinado período, a taxa de câmbio nominal R$/US$ seja igual à paridade relativa real do poder de compra.
Nesse contexto, para que a paridade relativa real do poder de compra (ou seja, a taxa de câmbio real R$/US$) fique constante, entre o início e o final daquele período, será preciso que a taxa de desvalorização nominal do Real brasileiro em relação ao Dólar americano seja`,
    [
      "igual à diferença entre as taxas de inflação americana e brasileira, acumuladas no período.",
      "igual à diferença entre as taxas de inflação brasileira e americana, acumuladas no período.",
      "igual à taxa de inflação brasileira acumulada no período.",
      "igual à taxa de inflação americana acumulada no período.",
      "livremente cotada no mercado de câmbio, sem relação com as taxas de inflação brasileira e americana, acumuladas no período.",
    ],
  ),
  q(
    37,
    "Conhecimentos Bancários",
    "a",
    `A oferta da moeda (meios de pagamento M1) no Brasil tende a se expandir se as autoridades monetárias`,
    [
      "comprarem liquidamente títulos públicos em operações de mercado aberto.",
      "aumentarem a taxa de recolhimento de reserva compulsória sobre os depósitos nos bancos.",
      "aumentarem a taxa do redesconto dos empréstimos de liquidez.",
      "aumentarem os dividendos pagos pelas empresas públicas.",
      "diminuírem os impostos indiretos incidentes sobre os bens de investimento.",
    ],
  ),
  q(
    38,
    "Conhecimentos Bancários",
    "a",
    `Considerando-se o atual regime cambial brasileiro, uma redução pronunciada da taxa de juros dos Estados Unidos, relativamente à taxa de juros no Brasil, tenderia a fazer com que`,
    [
      "a moeda brasileira, o Real, se valorizasse cambialmente em relação ao Dólar americano.",
      "as exportações brasileiras para os Estados Unidos fossem cambialmente estimuladas.",
      "as reservas brasileiras de divisas em Dólar americano diminuíssem.",
      "os fluxos de capitais financeiros brasileiros para os Estados Unidos aumentassem.",
      "as importações brasileiras originárias dos Estados Unidos fossem cambialmente desestimuladas.",
    ],
  ),
  q(
    39,
    "Conhecimentos Bancários",
    "e",
    `No caso de um regime de taxa de câmbio fixa entre o Real e o Dólar americano, verifica-se que as`,
    [
      "diferenças de taxa de inflação entre o Brasil e os Estados Unidos não alterariam a taxa de câmbio real entre as moedas desses dois países.",
      "políticas monetárias expansionistas nos Estados Unidos causariam recessão no Brasil.",
      "políticas monetárias no Brasil e nos Estados Unidos seriam sempre contracionistas.",
      "taxas de câmbio entre o Real e a moeda europeia seriam fixas.",
      "taxas de juros no Brasil e nos Estados Unidos seriam muito próximas, se houvesse muita mobilidade de capital financeiro entre esses dois países.",
    ],
  ),
  q(
    40,
    "Conhecimentos Bancários",
    "b",
    `O Conselho Monetário Nacional (CMN) é um órgão importante do Sistema Financeiro Nacional.
As atribuições do CMN são inúmeras, entre as quais`,
    [
      "regular os serviços de compensação de cheques e outros papéis.",
      "autorizar a emissão de papel moeda.",
      "determinar, via Comitê de Política Monetária, a taxa de juros Selic.",
      "autorizar o funcionamento das instituições financeiras operando no país.",
      "emitir títulos do CMN, responsabilizando-se pelo seu resgate.",
    ],
  ),
  q(
    41,
    "Conhecimentos de Informática",
    "b",
    `Sejam os seguintes dados de uma planilha confeccionada no Excel 365:
Na célula C10 dessa planilha, está inserida a seguinte fórmula:
=CONT.SE(B2:B6;"<=R$ 10,00")
Ao executar essa fórmula, o valor que aparecerá na célula C10 é`,
    ["2", "3", "4", "5", "6"],
  ),
  q(
    42,
    "Conhecimentos de Informática",
    "a",
    `Uma equipe está utilizando o Microsoft Teams e deseja-se agrupar as conversas dessa equipe por assunto, formando um tópico de discussão.
Para isso, é necessário criar, para essa equipe, um(a)`,
    ["Canal", "Grupo", "Reunião", "Atividade", "Sub-equipe"],
  ),
  q(
    43,
    "Conhecimentos de Informática",
    "a",
    `A ferramenta de Webmail viabiliza o uso do serviço de correio eletrônico de empresas utilizando um navegador Web. Após a composição de uma nova mensagem de correio eletrônico, o usuário deve fazer a submissão do formulário para o servidor Web que, por sua vez, fará a submissão do conteúdo da mensagem para a fila do servidor de correio eletrônico.
Os protocolos de comunicação utilizados nestas duas etapas são, respectivamente,`,
    ["HTTP e SMTP", "SMTP e HTTP", "POP3 e SMTP", "SMTP e POP3", "HTTP e POP3"],
  ),
  q(
    44,
    "Conhecimentos de Informática",
    "b",
    `As estações de trabalho de uma empresa estão sujeitas a ataques que podem provocar vazamentos ou destruição completa dos dados. Uma boa prática de segurança é utilizar uma amostra biométrica para se conectar aos seus dispositivos, aplicativos, serviços on-line e redes. O Windows 10 possui um recurso de segurança de entrada que possibilita usar uma amostra biométrica do rosto, da íris e da impressão digital, ou, ainda, um PIN (Personal Identification Number).
Tal recurso é o`,
    [
      "Windows Security",
      "Windows Hello",
      "Advanced Login",
      "Enhanced Login",
      "Enhanced Authentication",
    ],
  ),
  q(
    45,
    "Conhecimentos de Informática",
    "c",
    `Um colaborador de uma empresa precisa restaurar uma versão específica de um documento que está sendo editado no aplicativo Word do Microsoft Office 365.
Para verificar as versões do documento que estão disponíveis para a restauração, o colaborador deve selecionar o menu`,
    [
      "Arquivo, escolher a opção Histórico e selecionar a opção Controle de Versões.",
      "Arquivo, escolher a opção Sobre e selecionar a opção Controle de Versões.",
      "Arquivo, escolher a opção Informações e selecionar a opção Histórico de Versões.",
      "Revisão, selecionar a opção Controlar Alterações e selecionar a opção De todas as Pessoas.",
      "Revisão, selecionar a opção Controlar Alterações e selecionar a opção Somente as Minhas.",
    ],
  ),
  q(
    46,
    "Conhecimentos de Informática",
    "d",
    `Os mecanismos de segurança combinam técnicas e ações de segurança para prover a proteção de usuários e de dados.
O mecanismo de segurança que consiste em definir as ações que uma determinada entidade pode executar, ou a quais informações essa entidade pode ter acesso, é o de`,
    ["identificação", "integridade", "autenticação", "autorização", "confidencialidade"],
  ),
  q(
    47,
    "Conhecimentos de Informática",
    "e",
    `Os sistemas de arquivos permitem a organização dos dados em arquivos e pastas nos dispositivos de armazenamento. A quantidade máxima de dados armazenados por cada arquivo e a quantidade máxima de pastas variam entre os diversos sistemas de arquivos.
O sistema de arquivos nativo do Windows 10 que permite o armazenamento de um arquivo com mais de 8GB de dados é o`,
    ["ReiserFS", "EXT4", "FAT16", "FAT32", "NTFS"],
  ),
  q(
    48,
    "Conhecimentos de Informática",
    "d",
    `O som de uma música pode ser digitalizado e armazenado em um arquivo de computador. Suponha que em seu computador exista um arquivo de áudio que contém uma música e que foi codificado em um determinado formato (ex: MP3).
Para poder reproduzir esse arquivo de áudio, no seu computador, é necessário ter um(a)`,
    [
      "bom monitor de vídeo.",
      "microfone adequado.",
      "programa antivírus atualizado e em funcionamento.",
      "programa que faça a decodificação correta do arquivo.",
      "ligação com a internet em funcionamento.",
    ],
  ),
  q(
    49,
    "Conhecimentos de Informática",
    "d",
    `Sistemas de suporte à decisão podem ser utilizados no nível gerencial de uma empresa, por exemplo na busca de maior eficiência e produtividade, e também podem ser utilizados no nível estratégico.
Os sistemas de apoio à decisão no nível estratégico de uma empresa via de regra utilizam apenas dados`,
    [
      "internos, da própria empresa.",
      "externos, do mercado onde a empresa atua.",
      "detalhados, dos concorrentes da empresa.",
      "internos, da própria empresa, complementados por dados externos, do mercado onde a empresa atua.",
      "externos, do mercado onde a empresa atua, complementados por dados detalhados dos concorrentes da empresa.",
    ],
  ),
  q(
    50,
    "Conhecimentos de Informática",
    "b",
    `O Google Drive é uma das várias ferramentas da empresa Google que existem na nuvem.
Essa ferramenta é particularmente adequada para`,
    [
      "administrar agendas.",
      "compartilhar arquivos de qualquer formato.",
      "enviar e receber mensagens de correio eletrônico.",
      "realizar apresentações ao vivo via internet.",
      "realizar reuniões remotas via internet em tempo real.",
    ],
  ),
  q(
    51,
    "Conhecimentos de Informática",
    "a",
    `Uma situação que ocorre no dia a dia da utilização de correio eletrônico é uma pessoa A (emissor), após enviar uma mensagem X para uma outra pessoa B (destinatário), receber uma resposta automática que informa que a caixa de correio do destinatário está cheia.
Isso significa que a(o)`,
    [
      "espaço ocupado por mensagens na caixa de correio do destinatário atingiu o limite autorizado.",
      "quantidade de mensagens na caixa de correio do destinatário atingiu o limite autorizado.",
      "quantidade de mensagens enviadas pelo emissor atingiu o limite autorizado.",
      "quantidade máxima de mensagens que podem ser recebidas pelo destinatário naquele dia foi atingida.",
      "espaço ocupado pela mensagem X é muito grande, e seu envio não foi autorizado pela infraestrutura do emissor.",
    ],
  ),
  q(
    52,
    "Conhecimentos de Informática",
    "d",
    `Uma prática comum e recomendada para proteção de estações de trabalho é que programas do tipo antivírus e antimalware sejam mantidos atualizados nessas estações e computadores em geral.
Essas atualizações são necessárias principalmente para que esses programas`,
    [
      "possuam uma interface moderna com o usuário.",
      "ocupem o menor espaço possível em disco.",
      "funcionem, porque versões desatualizadas não funcionam.",
      "possam identificar vírus e problemas mais recentes.",
      "sejam executados de forma mais rápida e eficiente.",
    ],
  ),
  q(
    53,
    "Conhecimentos de Informática",
    "e",
    `Sistemas de inteligência de negócio fornecem várias funcionalidades analíticas para atender à necessidade de entender rapidamente uma situação e tomar a decisão correta sobre ela.
Dentre essas funcionalidades, está a conhecida como dashboard, que é uma ferramenta`,
    [
      "de consulta ad-hoc em SQL aos dados mantidos no data warehouse da empresa, por meio de técnicas no-code ou low-code.",
      "de mineração de dados que permite fazer previsões sobre o desempenho da empresa.",
      "que permite operações OLAP ad-hoc e é ligada diretamente ao banco de dados centralizado e operacional da empresa.",
      "que permite aos usuários criar relatórios com tabelas de cruzamento de dados, do tipo pivot-table, a partir de parâmetros que são definidos previamente.",
      "visual, para apresentar dados de desempenho pré-definidos pelos usuários.",
    ],
  ),
  q(
    54,
    "Conhecimentos de Informática",
    "b",
    `Segundo o Resumo Técnico do Censo da Educação Superior 2020, publicado pelo INEP, em 2020, pela primeira vez, o número de ingressantes de graduação na modalidade de ensino a distância (EaD) superou o de ingressantes na modalidade presencial.
A modalidade de EaD, atualmente, é uma opção real para o estudante de graduação brasileiro, graças a características que facilitam o acesso ao saber, como a(o)`,
    [
      "eliminação da necessidade da interação social para a aprendizagem.",
      "autoaprendizagem mediada por recursos didáticos em diferentes suportes de informação.",
      "supervisão direta do docente por meio de sistemas tecnológicos inibidores da autonomia.",
      "sincronismo e a delimitação física do espaço geográfico dos encontros entre docente e discentes.",
      "uso de vias de mão única para a comunicação entre docente e discente.",
    ],
  ),
  q(
    55,
    "Conhecimentos de Informática",
    "d",
    `A utilização de computadores compartilhados aumenta o nível de risco da segurança da informação. Para reduzir tais riscos, pode-se ativar a navegação privativa, que não salva as informações de navegação, como histórico e cookies, e não deixa rastros após o término da sessão.
Para navegar de forma privativa no Mozilla Firefox, o usuário deve abrir uma nova janela privativa, pressionando a seguinte combinação de teclas:`,
    ["Ctrl+N", "Ctrl+P", "Ctrl+T", "Ctrl+Shift+P", "Ctrl+Shift+A"],
  ),
  q(
    56,
    "Vendas e Negociação",
    "d",
    `D é um deficiente visual e necessita realizar atendimento presencial em determinada agência bancária. Dirige-se ao local onde possui conta corrente e vários investimentos com seu acompanhante vidente, que também necessita do mesmo serviço. Ao ingressar no estabelecimento bancário, verifica a existência de longa fila para obtenção de idêntico serviço. O gerente da agência, constatando a necessidade do correntista, pessoalmente disponibiliza um caixa, que presta os serviços a D, bem como ao seu acompanhante.
Nos termos da Lei nº 13.146, de 06 de julho de 2015, a providência do gerente`,
    [
      "confronta com o princípio da igualdade entre os correntistas.",
      "caracteriza um privilégio que deve ser reprimido.",
      "está em dissonância com o posto na norma por privilegiar o acompanhante.",
      "realiza o direito a receber atendimento prioritário.",
      "é medida sem proteção pelo estatuto legal.",
    ],
  ),
  q(
    57,
    "Vendas e Negociação",
    "b",
    `Um indivíduo é correntista de determinada instituição financeira que lhe apresenta, através dos responsáveis internos, proposta para investimento no mercado de renda variável, apresentando o mercado de capitais como capaz de superar o rendimento fixo de várias aplicações financeiras, sem apresentar as desvantagens e perigos desse setor da economia.
Nesse contexto, nos termos da Lei nº 8.078/1990, a atuação dos prepostos da instituição financeira estaria violando a regra da`,
    [
      "lucratividade planejada",
      "informação adequada",
      "menor onerosidade",
      "capacidade econômica",
      "conservação de valores",
    ],
  ),
  q(
    58,
    "Vendas e Negociação",
    "d",
    `Um cliente da instituição financeira M.O. apresenta reclamação sobre lançamentos indevidos na sua conta corrente sobre os quais solicitou esclarecimento. A instituição quedou-se inerte, tendo o cliente renovado seu pleito por vinte outras vezes. Sem esmorecer, procurou saber quais seriam as alternativas previstas na legislação para amparar sua pretensão, uma vez que foram esgotados os meios normais de acesso ao cliente previstos.
Nos termos da Resolução CMN nº 4.860, de 23 de outubro de 2020, o caso deve merecer a intervenção da`,
    [
      "Presidência da instituição",
      "Auditoria da instituição",
      "Diretoria da instituição",
      "Ouvidoria da instituição",
      "Corregedoria da instituição",
    ],
  ),
  q(
    59,
    "Vendas e Negociação",
    "c",
    `Um vendedor do departamento de seguros de um banco foi chamado para atender um cliente que desejava informações a respeito de renovação de apólice de seguro de vida. Antes de encontrá-lo, o vendedor foi orientado pelo supervisor a acessar uma base de dados com informações pessoais dos clientes que o banco mantinha ilicitamente. Ao explorar essa base de dados, o vendedor descobriu que o cliente era acometido de uma enfermidade crônica que comprometia em muito a sua saúde. De posse dessa informação, o vendedor alterou sua estratégia de negociação e impôs condições para renovação que eram bem mais desfavoráveis ao cliente.
O problema ético observado nesse caso é caracterizado como`,
    ["propina", "aliciamento", "espionagem", "desafio tácito", "conflito de interesses"],
  ),
  q(
    60,
    "Vendas e Negociação",
    "a",
    `Um consultor levantou o desempenho dos canais de vendas remotos de cinco empresas ao longo de uma semana e montou a Tabela apresentada a seguir.

Empresa | Compras iniciadas na semana | Compras finalizadas na semana
V | 480 | 400
W | 600 | 380
X | 800 | 450
Y | 450 | 330
Z | 580 | 430

Com base nessa Tabela, a menor taxa de abandono foi registrada pela empresa`,
    ["V", "W", "X", "Y", "Z"],
  ),
  q(
    61,
    "Vendas e Negociação",
    "e",
    `A gerência de uma agência bancária analisou os padrões de qualidade no atendimento aos clientes ao longo de um mês, e, como resultado, iniciou uma série de treinamentos focados na execução dos serviços prometidos aos clientes de forma segura e precisa.
Dessa forma, a gerência está propondo tratar da dimensão da qualidade denominada`,
    ["entrega", "empatia", "resposta", "tangibilidade", "confiabilidade"],
  ),
  q(
    62,
    "Vendas e Negociação",
    "d",
    `O diretor de um banco está preocupado com a jornada do cliente e tem concentrado atenção na fase da assimilação, a qual considera a mais importante.
Levando-se em conta o caminho dos 5As do cliente, na fase de assimilação, o consumidor`,
    [
      "processa as mensagens das marcas e é atraído por algumas dessas mensagens.",
      "pesquisa mais informações a respeito das marcas ofertadas no mercado.",
      "decide qual marca e onde comprar o produto ou serviço desejado.",
      "é exposto às marcas a partir de experiências, anúncios e recomendações.",
      "passa a dar preferência por uma marca específica e torna-se leal a essa marca.",
    ],
  ),
  q(
    63,
    "Vendas e Negociação",
    "c",
    `A empresa X fabrica bijuterias de prata há mais de dez anos e conseguiu um empréstimo bancário que será usado em ações para ampliar as suas vendas. A diretora de marketing decidiu que parte dos recursos será gasto em novas estratégias de comunicação da empresa e solicitou que a equipe de marketing desenvolvesse uma proposta de inbound marketing.
A proposta que atende à solicitação da diretora e corresponde a uma ação de inbound marketing é a seguinte:`,
    [
      "Contratar consultores para a avaliação de todo o processo produtivo, visando à redução dos custos de produção e, consequentemente, à redução dos preços.",
      "Reunir os revendedores espalhados por todo o país via videoconferência e promover um treinamento focado em argumentos de persuasão.",
      "Produzir vídeos que ensinam como manter e customizar bijuterias de prata e disponibilizar esse material para livre acesso em redes sociais.",
      "Solicitar aos engenheiros de produto que eles desenvolvam ligas de prata mais resistentes e apresentar essa nova característica do produto em propagandas.",
      "Montar uma rede própria de lojas e tratar internamente de todo o processo de comercialização das bijuterias para fortalecer o marketing de relacionamento.",
    ],
  ),
  q(
    64,
    "Vendas e Negociação",
    "d",
    `Uma característica do atendimento bancário, que interfere decisivamente na percepção dos clientes, é a inseparabilidade – cuja importância se manifesta no fato de que o prestador de serviço é o serviço.
Sendo assim, para administrar corretamente essa característica, o agente comercial deve estar preparado para`,
    [
      "assumir totalmente os fatos que ocorrem em sua agência.",
      "completar o estoque pleno dos serviços prestados.",
      "compreender seus próprios benefícios e anseios.",
      "orientar os clientes na escolha de produtos adequados.",
      "tornar tangíveis os serviços ofertados aos clientes.",
    ],
  ),
  q(
    65,
    "Vendas e Negociação",
    "b",
    `Frequentemente, os bancos realizam pesquisas de satisfação dos clientes com o objetivo de`,
    [
      "acompanhar o passo a passo do cotidiano de suas equipes.",
      "aperfeiçoar o atendimento prestado por seus funcionários.",
      "fornecer parâmetros éticos para suas ações sociais.",
      "fortalecer a vigilância sobre a equipe de atendimento.",
      "monitorar o trabalho que vem dos seus fornecedores.",
    ],
  ),
  q(
    66,
    "Vendas e Negociação",
    "a",
    `Para aumentar o valor percebido pelo cliente, o agente comercial deve reduzir os custos da transação, incluindo aqueles que vão além dos fatores financeiros, como, por exemplo, o`,
    [
      "desgaste emocional até a definição do negócio.",
      "impacto da aquisição no orçamento familiar.",
      "montante em dinheiro investido ao longo do tempo.",
      "parcelamento do total investido, quando houver.",
      "preço dos produtos ofertados pelos concorrentes.",
    ],
  ),
  q(
    67,
    "Vendas e Negociação",
    "a",
    `Uma instituição bancária criou três contas únicas que não existiam no mercado financeiro: Digital, para movimentação exclusiva pelos seus canais de conveniência, Universitária, para pessoas que estão cursando o Ensino Superior, e Agrícola, para produtores rurais, com concessão de crédito e benefícios exclusivos.
Essa ação é denominada`,
    [
      "estratégia de posicionamento",
      "tecnografia",
      "personalização em massa",
      "hospitalidade",
      "vantagem competitiva sustentável",
    ],
  ),
  q(
    68,
    "Vendas e Negociação",
    "e",
    `Na sua prática publicitária para venda de um produto/serviço, uma instituição bancária vem adotando gatilhos mentais.
Ela acionou o gatilho da escassez e da urgência quando ofereceu um(a)`,
    [
      "plano de previdência de acordo com a renda do cliente que foi contratado por cinco de seus colegas.",
      "recomendação de um especialista em finanças pessoais que já trabalhou com o pessoal da empresa do cliente para a compra de um seguro de vida.",
      "e-book gratuito e um podcast sobre investimentos para os clientes que se subscrevem em seu canal/plataforma.",
      "exposição de cases, entrevistas com especialistas do banco com conteúdos informativos para conhecer a sua marca.",
      "compra de um número limitado de cotas de um fundo agrícola, disponível para o cliente apenas nas 48 horas subsequentes ao oferecimento.",
    ],
  ),
  q(
    69,
    "Vendas e Negociação",
    "c",
    `Na venda de um cartão de crédito, um corretor ficou preocupado em ajudar o cliente a identificar os riscos da decisão de compra. Para tanto, enfatizou três aspectos para o cliente: este não perderia dinheiro se fizesse essa compra; esse cartão seria aceito sempre e onde o cliente desejasse realizar uma compra; os colegas de trabalho do cliente aprovariam a escolha dessa bandeira renomada.
Esses três argumentos utilizados pelo corretor para reduzir as inseguranças do cliente podem minimizar três tipos de riscos percebidos na pré-compra:`,
    [
      "físico, sensorial, temporal",
      "psicológico, físico, biológico",
      "financeiro, funcional, social",
      "ergonômico, mecânico, sensorial",
      "estratégico, operacional, de conformidade",
    ],
  ),
  q(
    70,
    "Vendas e Negociação",
    "b",
    `O diretor operacional de um banco destacou que, para tomar decisões estratégicas inteligentes, é preciso entender como o esforço de vendas está alinhado às variáveis do ambiente interno do sistema de marketing organizacional, tais como as seguintes:`,
    [
      "demografia e fatores legais e políticos",
      "estrutura de preços e sistema de distribuição",
      "fatores socioculturais e planejamento do produto",
      "competição e ambiente físico",
      "condições econômicas e tecnologia",
    ],
  ),
]

export const bbAgenteComercial2022Prova: Prova = {
  id: PROVA_ID,
  titulo: "BB Escriturário – Agente Comercial (Prova A · Gabarito 1)",
  orgao: "Banco do Brasil",
  cargo: "Escriturário – Agente Comercial",
  banca: "CESGRANRIO",
  ano: 2023,
  edital: "Seleção Externa 2022/001",
  questoes,
}
