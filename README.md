# EcoImpacto – Sustentabilidade em Ação

Site educativo que mostra como hábitos do dia a dia afetam o meio ambiente e a sociedade, com um checklist que devolve dicas personalizadas.

- **Site publicado (HTTPS):** https://ecoimpacto.onrender.com/index.html
- **Repositório:** https://github.com/bielg3r/EcoImpacto
- **Disciplina:** Desenvolvimento Front-End para Web · UNICID · 2026.2
- **Professor:** Paulo Fratta
- **Atividade:** AV A1, 2ª entrega (site final)

## Equipe

| Integrante | Papel |
|---|---|
| Diogo Mariano França da Silva | Código, slides |
| Gabriel Rocha de Melo | Código e ReadMe |
| Matheus Fernando Garcia de Oliveira | Código e Escopo |

## Contexto

O projeto aborda a falta de conscientização sobre hábitos sustentáveis e seus impactos ambientais e sociais. O público-alvo são estudantes, jovens e adultos, incluindo pessoas com deficiência. O site se relaciona com os ODS 11 (cidades e comunidades sustentáveis), 12 (consumo e produção responsáveis) e 13 (ação contra a mudança global do clima).

## Páginas (11)

| Página | Arquivo |
|---|---|
| Home | `index.html` |
| Sobre (inclui ODS) | `sobre.html` |
| Checklist sustentável | `check_list.html` |
| Impacto ambiental e social | `Impacto_Ambiental_e_Social.html` |
| Projetos sustentáveis | `Projetos_Sustententaveis.html` |
| Galeria | `Galeria.html` |
| Mídia (vídeo em iframe) | `Midia.html` |
| Notícias | `Noticias.html` |
| Pontos de coleta | `pontos_de_coleta.html` |
| Contato, voluntariado e apoio | `contato.html` |
| Acessibilidade | `acessibilidade.html` |

## Tecnologias

HTML5, CSS3 (variáveis, Grid e Flexbox) e JavaScript puro, sem frameworks. Versionamento no GitHub e hospedagem no Render.

## JavaScript

- `script.js`: checklist (dicas por resposta), formulário de contato com validação (`preventDefault`, mensagem de erro e borda em destaque), rascunho e histórico no `localStorage`, botão de compartilhar.
- `acessibilidade.js`: botão flutuante (tamanho do texto, alto contraste, destaque de links), com a escolha salva no `localStorage`.

## Acessibilidade

`lang="pt-BR"`, texto alternativo nas imagens, contraste AA, navegação completa por teclado com foco visível, link "Pular para o conteúdo", `aria-live` nos resultados e página dedicada (`acessibilidade.html`). Detalhes e testes em `docs/testes.md`.

## Como rodar

Não há dependências nem etapa de build.

1. Clone o repositório: `git clone https://github.com/bielg3r/EcoImpacto.git`
2. Abra `index.html` no navegador (ou use uma extensão como Live Server no VS Code).

## Estrutura de pastas

```
EcoImpacto/
├─ index.html … contato.html   (11 páginas)
├─ teste.css                   (estilos base e variáveis)
├─ paginas.css                 (estilos das páginas internas)
├─ script.js                   (checklist e contato)
├─ acessibilidade.js           (botão de acessibilidade)
├─ Icones/                     (ilustrações SVG)
├─ Prompts/                    (prints dos prompts de IA)
├─ docs/                       (documentação)
└─ README.md
```

## Documentação (`/docs`)

| Arquivo | Conteúdo |
|---|---|
| `escopo.md` | Escopo atualizado, com planejado × entregue |
| `plano_paginas.txt` | Plano de conteúdo das páginas (versão do MVP) |
| `diario_de_bordo.md` | Diário datado de decisões e evidências |
| `orcamento_hospedagem.html` | Orçamento e justificativa da hospedagem |
| `testes.md` | Evidências de testes (W3C, contraste, links, teclado) |
| `melhorias_mvp.md` | Pontos do MVP e como foram resolvidos |
| `uso_de_ia.md` | Registro do uso de IA (prompts, aceito, corrigido) |

## Fontes e créditos

Fotos da Galeria e da Mídia: Wikimedia Commons, com link para o arquivo original em cada legenda. Vídeo: PNUMA, no YouTube. Dado de reciclagem: ABRELPE, via O Povo (jun/2022). Informações da página de coleta: Prefeitura de São Paulo e Metrô, conforme listado na própria página. Os dados de contato do site são fictícios (trabalho acadêmico).

*EcoImpacto – Sustentabilidade em Ação · Projeto acadêmico UNICID 2026*
