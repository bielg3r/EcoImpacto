/* ==========================================================
   EcoImpacto - acessibilidade.js
   Botão flutuante de acessibilidade, presente em todas as páginas.
   Opções: tamanho do texto (4 níveis), alto contraste e destaque de links.
   A escolha da pessoa fica salva no localStorage e vale para todas as páginas.
   Os estilos (.acess-widget, .acess-painel, html.alto-contraste, etc.) estão no teste.css.
   ========================================================== */
"use strict";

(function () {
  const CHAVE = "ecoimpacto:acessibilidade";
  const NIVEIS_TEXTO = [100, 115, 130, 150]; // porcentagem do tamanho de fonte da página

  // Estado padrão; o que estiver salvo no navegador sobrescreve.
  const estado = { nivel: 0, contraste: false, links: false };

  /* ---------- localStorage protegido (pode estar bloqueado em modo privado) ---------- */
  function carregar() {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) || "{}");
      if (Number.isInteger(salvo.nivel) && salvo.nivel >= 0 && salvo.nivel < NIVEIS_TEXTO.length) estado.nivel = salvo.nivel;
      estado.contraste = salvo.contraste === true;
      estado.links = salvo.links === true;
    } catch (erro) {
      /* sem armazenamento ou dado inválido: usa o padrão */
    }
  }

  function salvar() {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch (erro) {
      /* sem armazenamento: a escolha vale só nesta página */
    }
  }

  /* ---------- aplica o estado na página ---------- */
  const raiz = document.documentElement;

  function aplicar() {
    // Texto: muda o tamanho base; como o site usa rem/em, tudo cresce junto.
    raiz.style.fontSize = estado.nivel === 0 ? "" : NIVEIS_TEXTO[estado.nivel] + "%";
    raiz.classList.toggle("alto-contraste", estado.contraste);
    raiz.classList.toggle("destacar-links", estado.links);
  }

  // Aplica o que já estava salvo antes de montar o painel, para evitar "piscar" a página.
  carregar();
  aplicar();

  /* ---------- monta o botão e o painel ---------- */
  function criar(tag, classe, texto) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (texto) el.textContent = texto;
    return el;
  }

  function montar() {
    const widget = criar("div", "acess-widget");

    // Botão redondo (ícone de acessibilidade universal)
    const botao = criar("button", "acess-botao");
    botao.type = "button";
    botao.setAttribute("aria-label", "Abrir opções de acessibilidade");
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-controls", "acess-painel");
    botao.innerHTML =
      '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true" focusable="false">' +
      '<circle cx="12" cy="4.5" r="2.2"/>' +
      '<path d="M4 8.2h16v2.2h-5.6v3.4l2 6.8h-2.3L12 15.6l-2.1 5H7.6l2-6.8v-3.4H4z"/></svg>';

    // Painel com as opções (começa escondido)
    const painel = criar("div", "acess-painel");
    painel.id = "acess-painel";
    painel.hidden = true;
    painel.setAttribute("role", "group");
    painel.setAttribute("aria-label", "Opções de acessibilidade");

    painel.appendChild(criar("p", "acess-titulo", "Acessibilidade"));

    // Linha do tamanho do texto: [A-] [Texto: 100%] [A+]
    const linha = criar("div", "acess-linha");
    const menos = criar("button", "acess-opcao", "A-");
    menos.type = "button";
    menos.setAttribute("aria-label", "Diminuir o texto");
    const nivel = criar("span", "acess-nivel");
    nivel.setAttribute("role", "status"); // o leitor de tela anuncia o novo tamanho
    const mais = criar("button", "acess-opcao", "A+");
    mais.type = "button";
    mais.setAttribute("aria-label", "Aumentar o texto");
    linha.append(menos, nivel, mais);

    // Opções liga/desliga: aria-pressed informa o estado ao leitor de tela
    const contraste = criar("button", "acess-opcao", "Alto contraste");
    contraste.type = "button";
    const links = criar("button", "acess-opcao", "Destacar links");
    links.type = "button";

    const pagina = criar("a", "acess-pagina", "Sobre a acessibilidade do site");
    pagina.href = "acessibilidade.html";

    painel.append(linha, contraste, links, pagina);
    // O botão vem primeiro no HTML: o Tab vai do botão para o painel (o CSS mostra o painel acima).
    widget.append(botao, painel);
    document.body.appendChild(widget);

    // Atualiza os rótulos e estados dos controles conforme o estado atual
    function atualizarControles() {
      nivel.textContent = "Texto: " + NIVEIS_TEXTO[estado.nivel] + "%";
      menos.disabled = estado.nivel === 0;
      mais.disabled = estado.nivel === NIVEIS_TEXTO.length - 1;
      contraste.setAttribute("aria-pressed", String(estado.contraste));
      links.setAttribute("aria-pressed", String(estado.links));
    }

    function mudar() {
      aplicar();
      salvar();
      atualizarControles();
    }

    /* ---------- eventos ---------- */
    botao.addEventListener("click", () => {
      const abrir = painel.hidden;
      painel.hidden = !abrir;
      botao.setAttribute("aria-expanded", String(abrir));
      botao.setAttribute("aria-label", abrir ? "Fechar opções de acessibilidade" : "Abrir opções de acessibilidade");
    });

    // Esc fecha o painel e devolve o foco ao botão
    widget.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !painel.hidden) {
        painel.hidden = true;
        botao.setAttribute("aria-expanded", "false");
        botao.setAttribute("aria-label", "Abrir opções de acessibilidade");
        botao.focus();
      }
    });

    menos.addEventListener("click", () => { if (estado.nivel > 0) { estado.nivel--; mudar(); } });
    mais.addEventListener("click", () => { if (estado.nivel < NIVEIS_TEXTO.length - 1) { estado.nivel++; mudar(); } });
    contraste.addEventListener("click", () => { estado.contraste = !estado.contraste; mudar(); });
    links.addEventListener("click", () => { estado.links = !estado.links; mudar(); });

    atualizarControles();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();
