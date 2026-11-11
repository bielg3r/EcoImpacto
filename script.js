/* ==========================================================
   EcoImpacto - script.js
   JavaScript do site (arquivo externo, usado em contato.html e check_list.html).
   Seções:
   1) Funções de localStorage
   2) Formulário de contato (validação, rascunho e histórico)
   3) Área de apoio (compartilhar o site e atalhos para o formulário)
   4) Checklist sustentável
   ========================================================== */
"use strict";

/* ---------- 1. localStorage (protegido contra erros) ---------- */
// O navegador pode bloquear o localStorage (modo privado, por exemplo).
// Por isso todo acesso passa por estas três funções, com try/catch.
function lerStorage(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch (erro) {
    return padrao;
  }
}

function gravarStorage(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
    return true;
  } catch (erro) {
    return false;
  }
}

function apagarStorage(chave) {
  try {
    localStorage.removeItem(chave);
  } catch (erro) {
    /* sem armazenamento disponível: nada a apagar */
  }
}

/* ---------- 2. Formulário de contato ---------- */
const CHAVE_RASCUNHO = "ecoimpacto:rascunho-contato";   // texto digitado, ainda não enviado
const CHAVE_HISTORICO = "ecoimpacto:mensagens";          // mensagens já enviadas

const ASSUNTOS = {
  contato: "Contato geral",
  voluntariado: "Voluntariado",
  parceria: "Parceria ou doação"
};

// Rótulo do campo extra, que só aparece para voluntariado e parceria/doação
const TEXTO_EXTRA = {
  voluntariado: "Qual é a sua disponibilidade? (dias e horários)",
  parceria: "Como você ou sua organização gostaria de apoiar?"
};

function iniciarContato() {
  const form = document.getElementById("form-contato");
  if (!form) return; // esta página não tem o formulário

  const nomes = ["nome", "email", "telefone", "assunto", "extra", "mensagem"];
  const status = document.getElementById("status-envio");
  const avisoRascunho = document.getElementById("aviso-rascunho");
  const contador = document.getElementById("contador");
  const blocoExtra = document.getElementById("extra-bloco");
  const rotuloExtra = document.getElementById("extra-label");
  const lista = document.getElementById("lista-historico");
  const vazio = document.getElementById("historico-vazio");
  const botaoLimpar = document.getElementById("limpar-historico");
  const tituloHistorico = document.getElementById("titulo-historico");

  // Cada regra devolve a mensagem de erro, ou "" quando o valor é válido.
  const regras = {
    nome: (v) => (v.length < 3 ? "Informe seu nome completo (mínimo de 3 caracteres)." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Informe um e-mail válido, como nome@exemplo.com."),
    telefone: (v) => {
      if (v === "") return ""; // telefone é opcional
      const digitos = v.replace(/\D/g, "");
      return digitos.length === 10 || digitos.length === 11 ? "" : "Informe o telefone com DDD, 10 ou 11 dígitos. Ex.: (11) 91234-5678.";
    },
    assunto: (v) => (v === "" ? "Escolha um assunto." : ""),
    extra: (v) => {
      const tipo = form.elements.assunto.value;
      if (tipo !== "voluntariado" && tipo !== "parceria") return ""; // campo escondido
      return v.length < 5 ? "Preencha este campo (mínimo de 5 caracteres)." : "";
    },
    mensagem: (v) => (v.length < 10 ? "Escreva uma mensagem com pelo menos 10 caracteres." : "")
  };

  // Mostra (ou limpa) a mensagem de erro e o destaque visual de um campo.
  function mostrarErro(nome, mensagem) {
    const campo = form.elements[nome];
    const alvo = document.getElementById("erro-" + nome);
    alvo.textContent = mensagem;
    campo.classList.toggle("invalido", mensagem !== "");
    campo.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");
  }

  // Valida um campo e devolve true se estiver correto.
  function validarCampo(nome) {
    const valor = form.elements[nome].value.trim();
    const mensagem = regras[nome](valor);
    mostrarErro(nome, mensagem);
    return mensagem === "";
  }

  // Mostra ou esconde o campo extra conforme o assunto escolhido (evento change).
  function atualizarExtra() {
    const tipo = form.elements.assunto.value;
    const precisa = tipo === "voluntariado" || tipo === "parceria";
    blocoExtra.hidden = !precisa;
    if (precisa) {
      rotuloExtra.textContent = TEXTO_EXTRA[tipo];
    } else {
      form.elements.extra.value = "";
      mostrarErro("extra", "");
    }
  }

  function atualizarContador() {
    contador.textContent = form.elements.mensagem.value.length + "/500";
  }

  /* --- rascunho no localStorage --- */
  function salvarRascunho() {
    const dados = {};
    let temAlgo = false;
    nomes.forEach((n) => {
      dados[n] = form.elements[n].value;
      if (dados[n] !== "") temAlgo = true;
    });
    if (temAlgo) gravarStorage(CHAVE_RASCUNHO, dados);
    else apagarStorage(CHAVE_RASCUNHO);
  }

  function restaurarRascunho() {
    const dados = lerStorage(CHAVE_RASCUNHO, null);
    if (!dados) return;
    let temAlgo = false;
    nomes.forEach((n) => {
      if (typeof dados[n] === "string" && dados[n] !== "") {
        form.elements[n].value = dados[n];
        temAlgo = true;
      }
    });
    if (temAlgo) {
      atualizarExtra();
      atualizarContador();
      avisoRascunho.textContent = "Recuperamos o rascunho da sua última visita. Use o botão Limpar para apagá-lo.";
    }
  }

  /* --- histórico de mensagens no localStorage --- */
  function criarItemHistorico(item) {
    const li = document.createElement("li");
    li.className = "item-historico";

    const titulo = document.createElement("h3");
    titulo.textContent = (ASSUNTOS[item.assunto] || "Mensagem") + " - " + item.data;

    const corpo = document.createElement("p");
    corpo.textContent = item.mensagem;

    const detalhes = document.createElement("p");
    detalhes.className = "detalhes";
    const partes = [item.nome, item.email, item.telefone];
    if (item.extra) partes.push("Detalhe: " + item.extra);
    detalhes.textContent = partes.filter(Boolean).join(" · ");

    const excluir = document.createElement("button");
    excluir.type = "button";
    excluir.textContent = "Excluir";
    excluir.setAttribute("aria-label", "Excluir a mensagem de " + item.data);
    excluir.addEventListener("click", () => {
      const restantes = lerStorage(CHAVE_HISTORICO, []).filter((m) => m.id !== item.id);
      gravarStorage(CHAVE_HISTORICO, restantes);
      renderizarHistorico();
      tituloHistorico.focus(); // mantém o foco em um lugar previsível para teclado e leitor de tela
    });

    li.append(titulo, corpo, detalhes, excluir);
    return li;
  }

  // Redesenha a lista (mais recente primeiro). Usa textContent, nunca innerHTML,
  // para que nada digitado no formulário vire HTML.
  function renderizarHistorico() {
    const mensagens = lerStorage(CHAVE_HISTORICO, []);
    lista.textContent = "";
    mensagens.slice().reverse().forEach((item) => lista.appendChild(criarItemHistorico(item)));
    vazio.hidden = mensagens.length > 0;
    botaoLimpar.hidden = mensagens.length === 0;
  }

  /* --- eventos --- */
  // Cada tecla digitada: revalida o campo se ele já estava com erro e salva o rascunho.
  form.addEventListener("input", (e) => {
    const nome = e.target.name;
    if (!nome) return;
    if (e.target.classList.contains("invalido")) validarCampo(nome);
    if (nome === "mensagem") atualizarContador();
    avisoRascunho.textContent = "";
    salvarRascunho();
  });

  // Troca do assunto: mostra o campo extra quando necessário.
  form.addEventListener("change", (e) => {
    if (e.target.name === "assunto") {
      atualizarExtra();
      validarCampo("assunto");
      salvarRascunho();
    }
  });

  // Ao sair de um campo, valida na hora (feedback imediato).
  nomes.forEach((n) => {
    form.elements[n].addEventListener("blur", () => {
      if (!form.elements[n].closest("[hidden]")) validarCampo(n);
    });
  });

  // Envio: preventDefault impede o recarregamento; se houver erro, foca o primeiro campo inválido.
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.textContent = "";

    let primeiroInvalido = null;
    nomes.forEach((n) => {
      if (!validarCampo(n) && !primeiroInvalido) primeiroInvalido = form.elements[n];
    });
    if (primeiroInvalido) {
      primeiroInvalido.focus();
      return;
    }

    const mensagem = {
      id: Date.now(),
      data: new Date().toLocaleString("pt-BR"),
      nome: form.elements.nome.value.trim(),
      email: form.elements.email.value.trim(),
      telefone: form.elements.telefone.value.trim(),
      assunto: form.elements.assunto.value,
      extra: form.elements.extra.value.trim(),
      mensagem: form.elements.mensagem.value.trim()
    };

    const historico = lerStorage(CHAVE_HISTORICO, []);
    historico.push(mensagem);
    const salvou = gravarStorage(CHAVE_HISTORICO, historico);

    form.reset(); // também apaga o rascunho (ver evento reset abaixo)
    renderizarHistorico();

    status.textContent = salvou
      ? "Obrigado, " + mensagem.nome.split(" ")[0] + "! Sua mensagem (" + ASSUNTOS[mensagem.assunto] +
        ") foi registrada neste navegador. Este é um projeto acadêmico: nada é enviado a terceiros."
      : "Não foi possível salvar a mensagem: o armazenamento do navegador está bloqueado.";
    status.focus();
  });

  // Botão Limpar: apaga rascunho, erros e avisos.
  form.addEventListener("reset", () => {
    apagarStorage(CHAVE_RASCUNHO);
    avisoRascunho.textContent = "";
    status.textContent = "";
    // o reset só zera os valores depois do evento, por isso o setTimeout
    setTimeout(() => {
      nomes.forEach((n) => mostrarErro(n, ""));
      atualizarExtra();
      atualizarContador();
    }, 0);
  });

  botaoLimpar.addEventListener("click", () => {
    if (confirm("Apagar todas as mensagens salvas neste navegador?")) {
      apagarStorage(CHAVE_HISTORICO);
      renderizarHistorico();
      tituloHistorico.focus();
    }
  });

  restaurarRascunho();
  atualizarContador();
  renderizarHistorico();
}

/* ---------- 3. Área de apoio (contato.html) ---------- */
function iniciarApoio() {
  // Botão de compartilhar: usa o menu do celular (Web Share) ou copia o link.
  const botao = document.getElementById("compartilhar-site");
  const aviso = document.getElementById("status-compartilhar");
  if (botao && aviso) {
    botao.addEventListener("click", async () => {
      const dados = {
        title: "EcoImpacto",
        text: "Conheça o EcoImpacto: pequenas ações, grandes mudanças.",
        url: new URL("index.html", location.href).href
      };
      try {
        if (navigator.share) {
          await navigator.share(dados);
          aviso.textContent = "Obrigado por divulgar o EcoImpacto!";
        } else {
          await navigator.clipboard.writeText(dados.url);
          aviso.textContent = "Link copiado! Cole nas suas redes ou mensagens: " + dados.url;
        }
      } catch (erro) {
        if (erro && erro.name === "AbortError") return; // a pessoa fechou o menu de compartilhar
        aviso.textContent = "Não foi possível copiar sozinho. Copie o link: " + dados.url;
      }
    });
  }

  // Links com data-assunto escolhem o assunto do formulário antes de rolar até ele.
  document.querySelectorAll("[data-assunto]").forEach((link) => {
    link.addEventListener("click", () => {
      const form = document.getElementById("form-contato");
      if (!form) return;
      form.elements.assunto.value = link.dataset.assunto;
      // o evento change mostra o campo extra e salva o rascunho (ver iniciarContato)
      form.elements.assunto.dispatchEvent(new Event("change", { bubbles: true }));
      setTimeout(() => form.elements.nome.focus(), 0);
    });
  });
}

/* ---------- 4. Checklist sustentável ---------- */
function escaparHtml(texto) {
  return texto.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function iniciarChecklist() {
  const form = document.getElementById("form-check");
  if (!form) return; // esta página não tem o checklist

  const res = document.getElementById("resultado");

  // dicas[pergunta][resposta]: mensagens prontas; resposta 2 = melhor hábito
  const dicas = [
    [
      "Tente trocar 1 ou 2 trajetos por semana por ônibus, metrô ou carona solidária: sai mais barato e emite menos CO₂.",
      "Bom uso do transporte coletivo! Nos trajetos curtos, que tal ir a pé ou de bicicleta?",
      "Excelente! Seu deslocamento já é de baixo impacto. Incentive amigos a fazerem o mesmo."
    ],
    [
      "Comece simples: use duas lixeiras, uma para recicláveis (papel, plástico, vidro e metal) e outra para o resto.",
      "Você já separa às vezes. Deixe a lixeira de recicláveis em um lugar fácil para virar hábito.",
      "Muito bom separar sempre! O próximo passo é fazer compostagem com os restos de comida."
    ],
    [
      "Reduzir o banho em 2 minutos e fechar a torneira ao escovar os dentes já faz muita diferença.",
      "Falta pouco: deixe um lembrete no banheiro e conserte vazamentos, que desperdiçam muita água.",
      "Ótimo! Que tal reaproveitar a água da chuva ou da máquina de lavar para limpar quintais e calçadas?"
    ],
    [
      "Apague as luzes ao sair do cômodo e tire carregadores da tomada: a conta e o planeta agradecem.",
      "Crie o hábito de desligar da tomada o que não está em uso, pois o stand-by também consome energia.",
      "Parabéns! Para ir além, prefira aparelhos com selo Procel de eficiência e pesquise sobre energia solar."
    ],
    [
      "Antes de comprar, pergunte: preciso mesmo? Leve sua sacola e troque copos e canudos descartáveis por reutilizáveis.",
      "Você já tem boas atitudes. Faça lista de compras para não desperdiçar comida e prefira produtos duráveis.",
      "Excelente! Continue reutilizando e comprando de produtores locais, que reduzem o impacto do transporte."
    ]
  ];

  // Envio: calcula a pontuação e monta as dicas (evento submit + alteração do DOM).
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nome = escaparHtml(form.elements.nome.value.trim());
    let melhorar = "";
    let bom = "";
    let pontos = 0;

    for (let i = 0; i < dicas.length; i++) {
      const r = Number(form.elements["p" + i].value);
      const item = "<li>" + dicas[i][r] + "</li>";
      if (r === 2) { bom += item; pontos++; } else { melhorar += item; }
    }

    const nivel = pontos >= 4 ? "Parabéns, seu dia a dia já é bem sustentável!" :
                  pontos >= 2 ? "Você já está no caminho certo!" :
                  "Você está começando, e esse é o primeiro passo!";

    let html = "<h3>Olá, " + nome + "! " + nivel + "</h3><p>Você já tem " + pontos + " de 5 hábitos sustentáveis.</p>";
    if (melhorar) html += "<h4>Pontos para melhorar</h4><ul>" + melhorar + "</ul>";
    if (bom) html += "<h4>Continue assim</h4><ul>" + bom + "</ul>";

    res.innerHTML = html;
    res.scrollIntoView();
  });

  form.addEventListener("reset", () => { res.innerHTML = ""; });
}

/* ---------- Início: roda o que existir na página ---------- */
document.addEventListener("DOMContentLoaded", () => {
  iniciarContato();
  iniciarApoio();
  iniciarChecklist();
});
