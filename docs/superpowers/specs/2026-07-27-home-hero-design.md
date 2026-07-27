# Hero home — Design Spec

Data: 2026-07-27  
Status: aprovado em conversa; aguardando revisão do arquivo

## Contexto

A home de **Treino Concursos** mistura texto introdutório e lista de provas no mesmo bloco. A marca aparece só como eyebrow, o hero não tem atmosfera e o CTA principal não aponta para a ação principal (começar pelo catálogo de provas).

## Objetivos

- Hero full-bleed atmosférico em teal na primeira viewport.
- Marca **Treino Concursos** como sinal hero-level.
- Orçamento do hero: marca, headline, uma frase, grupo de CTAs (sem lista de provas, sem cards, sem stats).
- Lista de provas imediatamente abaixo do hero (`#provas`).

## Não objetivos

- Redesign do player, histórico ou header global além do necessário para contraste sobre o hero.
- Troca de fontes do design system (manter Fraunces + Source Sans 3).
- Modo escuro global.
- Imagens fotográficas ou ilustrações geradas.

## Decisões

| Decisão | Escolha |
|---------|---------|
| Direção | Atmosférico teal (C) |
| Layout | Full-bleed de sessão (1) |
| Provas | Logo abaixo do hero (A) |
| CTA primário | `Ver provas` → `#provas` |
| CTA secundário | `Meu histórico` → `/historico` |

## Copy

- Marca: `Treino Concursos`
- Headline: `Treine por prova, com foco.`
- Apoio: `Escolha uma prova, filtre por disciplina se quiser e resolva uma questão por vez.`
- Primário: `Ver provas`
- Secundário: `Meu histórico`

## Composição

### Hero

1. Faixa full-bleed sob o header (`min-height` ~ viewport menos header).
2. Fundo em camadas: radial + linear (`--accent-strong` → `--accent` → toque `--accent-soft`).
3. Overlay de grain/noise estático (~4–6% opacidade).
4. Conteúdo no container: marca (Fraunces, maior), headline, apoio, CTAs.
5. Texto claro (branco / off-white); apoio ~80% branco.
6. CTA primário: fundo branco, texto `--accent-strong`.
7. CTA secundário: borda clara, texto branco, hover suave.
8. Mobile-first: coluna única; sem split horizontal antes de `lg` (e o hero em si não usa split).

### Seção Provas

- Fora do hero, fundo `--background`.
- `id="provas"` para âncora do CTA.
- Lista existente reutilizada; blocos de prova como containers de interação (fora do hero).

## Motion

1. Entrada staggered (marca → headline → apoio/CTAs) via CSS `animation-delay`.
2. Hover do CTA primário com transição de cor/sombra leve.
3. Grain estático (sem parallax ou loop ruidoso).

## Tokens / arquivos

- Reutilizar variáveis em `src/app/globals.css`; classes utilitárias do hero podem viver no mesmo arquivo (ex. `.home-hero`, `.home-hero-grain`).
- Implementação principal: `src/app/page.tsx`.
- Header: se o contraste falhar sobre o teal, manter surface sólido (já é o padrão); não obrigar header transparente.

## Critérios de pronto

- Na dobra (~375px e desktop), a marca é o sinal tipográfico dominante.
- Lista de provas não aparece dentro do plano visual do hero.
- CTA primário rola até `#provas`.
- Sem cards, badges flutuantes ou stats no hero.
- Respeita `lg:` para qualquer layout horizontal da página (provas podem continuar empilhadas).

## Fora desta revisão

Plano de implementação detalhado e código. Após aprovação deste arquivo, segue `writing-plans`.
