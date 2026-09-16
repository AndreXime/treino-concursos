# Treino Concursos

Treine por prova, com foco. Escolha um caderno oficial, filtre por disciplina se quiser e resolva uma questão por vez, com feedback imediato e histórico local no navegador.

## O que faz

- Catálogo de provas reais (múltipla escolha e Certo/Errado)
- Resolução questão a questão, com atalhos de teclado
- Mapa da prova com status (pendente, acerto, erro)
- Modo foco para isolar a questão na tela
- Filtro por disciplina
- Histórico de tentativas no próprio navegador (sem conta)

## Provas disponíveis

| Prova | Banca | Ano | Questões | Formato |
|-------|-------|-----|----------|---------|
| BB Escriturário – Agente Comercial (Prova A) | CESGRANRIO | 2023 | 70 | Múltipla |
| Caixa – Técnico Bancário Novo | CESGRANRIO | 2024 | 60 | Múltipla |
| CNU 2024 – Bloco 2 Tecnologia, Dados e Informação | CESGRANRIO | 2024 | 50 | Múltipla |
| INSS – Técnico do Seguro Social | CEBRASPE | 2022 | 120 | Certo/Errado |

No INSS, itens anulados no gabarito oficial aparecem como “Item anulado” e não pontuam.

## Como treinar

1. Abra o catálogo em **Provas**
2. Escolha uma prova
3. (Opcional) filtre por disciplina
4. Responda, confira e avance
5. Veja o progresso no mapa ou no **Histórico**

Atalhos úteis na sessão: letras das alternativas, Enter para conferir, setas para navegar.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

| Comando | Uso |
|---------|-----|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servir o build |
| `npm run lint` | Biome (check) |
| `npm run format` | Biome (formatar) |

## Dados e novas provas

As provas da app vivem em `src/data/*.json`, geradas a partir dos PDFs em `src/data/raw/`.

Para o pipeline de extração/validação (extract, build, validate), veja [`src/data/lib/README.md`](src/data/lib/README.md).

## Stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Biome.
