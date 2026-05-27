(function () {
  function capitalizarFrases(texto) {
    if (!texto || typeof texto !== "string") return texto;

    return texto.replace(/(^|[.!?]\s+|\n+)(\s*)([a-zà-ÿ])/giu, function (match, prefixo, espacos, letra) {
      return prefixo + espacos + letra.toUpperCase();
    });
  }

  function ignorarElemento(elemento) {
    if (!elemento) return true;

    const tag = elemento.tagName;
    const tipo = (elemento.getAttribute("type") || "").toLowerCase();
    const autocomplete = (elemento.getAttribute("autocomplete") || "").toLowerCase();
    const nome = (elemento.getAttribute("name") || "").toLowerCase();
    const id = (elemento.getAttribute("id") || "").toLowerCase();

    if (elemento.disabled || elemento.readOnly) return true;

    if (tag === "INPUT") {
      if ([
        "password",
        "email",
        "tel",
        "url",
        "number",
        "search"
      ].includes(tipo)) return true;

      if ([
        "new-password",
        "current-password",
        "email",
        "username",
        "one-time-code"
      ].includes(autocomplete)) return true;

      if (
        nome.includes("pass") ||
        nome.includes("senha") ||
        nome.includes("mail") ||
        nome.includes("email") ||
        id.includes("pass") ||
        id.includes("senha") ||
        id.includes("mail") ||
        id.includes("email")
      ) {
        return true;
      }
    }

    return false;
  }

  function processarElemento(elemento) {
    if (!elemento || elemento.dataset.autoCapIgnore === "1") return;
    if (ignorarElemento(elemento)) return;

    if (elemento.tagName === "TEXTAREA" || (elemento.tagName === "INPUT" && elemento.type === "text")) {
      const valorAtual = elemento.value;
      const novoValor = capitalizarFrases(valorAtual);

      if (novoValor !== valorAtual) {
        const inicio = elemento.selectionStart;
        const fim = elemento.selectionEnd;
        elemento.value = novoValor;

        if (inicio !== null && fim !== null) {
          elemento.setSelectionRange(inicio, fim);
        }
      }
      return;
    }

    if (elemento.isContentEditable) {
      const textoAtual = elemento.innerText;
      const novoTexto = capitalizarFrases(textoAtual);

      if (novoTexto !== textoAtual) {
        const selecao = window.getSelection();
        const faixa = selecao && selecao.rangeCount ? selecao.getRangeAt(0) : null;
        elemento.innerText = novoTexto;

        if (faixa) {
          selecao.removeAllRanges();
          selecao.addRange(faixa);
        }
      }
    }
  }

  document.addEventListener("input", function (evento) {
    processarElemento(evento.target);
  }, true);

  document.addEventListener("paste", function (evento) {
    setTimeout(function () {
      processarElemento(evento.target);
    }, 0);
  }, true);
})();