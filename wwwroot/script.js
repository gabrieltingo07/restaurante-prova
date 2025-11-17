let carrinho = [];
let mesasOcupadas = [];

const produtos = {
  pratoFeito: { nome: "Prato Feito", preco: 25 },
  hamburguer: { nome: "Hambúrguer", preco: 30 },
  lasanha: { nome: "Lasanha", preco: 32 },
  refrigerante: { nome: "Refrigerante Lata", preco: 6 },
  suco: { nome: "Suco Natural", preco: 8.5 },
  agua: { nome: "Água Mineral", preco: 4 }
};

const alterarQuantidade = (id, delta) => {
  const input = document.getElementById(id);
  const valorAtual = parseInt(input.value) || 0;
  const novoValor = Math.max(0, valorAtual + delta);
  input.value = novoValor;
};

document.addEventListener("DOMContentLoaded", () => {
  registrarEventosQuantidade();
  document.getElementById("btnFazerPedido").onclick = montarCarrinho;
});

function registrarEventosQuantidade() {
  document.body.addEventListener("click", (event) => {
    const btn = event.target;

    if (!btn.dataset.action) return;

    const { action, target } = btn.dataset;

    if (action === "mais") alterarQuantidade(target, +1);
    if (action === "menos") alterarQuantidade(target, -1);
  });
}

function montarCarrinho() {
  carrinho = [];

  Object.keys(produtos).forEach((key) => {
    const input = document.getElementById("qtd" + capitalize(key));
    const quantidade = parseInt(input.value) || 0;

    if (quantidade > 0) {
      carrinho.push({
        ...produtos[key],
        quantidade
      });
    }
  });

  if (carrinho.length === 0) {
    return alert("Nenhum item selecionado!");
  }

  abrirModalCarrinho();
}

function abrirModalCarrinho() {
  const modalBody = document.getElementById("modalBodyCarrinho");
  let total = 0;

  const itensHtml = carrinho
    .map(item => {
      const subtotal = item.quantidade * item.preco;
      total += subtotal;

      return `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.nome}</strong><br>
            <small>Qtd: ${item.quantidade} × R$ ${item.preco.toFixed(2)}</small>
          </div>
          <span class="badge bg-primary rounded-pill">R$ ${subtotal.toFixed(2)}</span>
        </li>
      `;
    })
    .join("");

  modalBody.innerHTML = `
    <ul class="list-group mb-3">${itensHtml}</ul>
    <p><strong>Total: R$ ${total.toFixed(2)}</strong></p>

    <label>Mesa:</label>
    <select id="selectMesa" class="form-select mb-2">
      ${renderMesas()}
    </select>

    <input id="nomeCliente" class="form-control mb-2" placeholder="Nome do cliente">
    <input id="telefoneCliente" class="form-control mb-2" placeholder="Telefone">
    <button id="btnConfirmarPedido" class="btn btn-success w-100">Realizar pedido</button>
  `;

  document.getElementById("contadorCarrinho").textContent = carrinho.length;

  new bootstrap.Modal(document.getElementById("modalCarrinho")).show();
}

function renderMesas() {
  let html = "";
  for (let m = 1; m <= 5; m++) {
    html += mesasOcupadas.includes(m)
      ? `<option disabled>Mesa ${m} (ocupada)</option>`
      : `<option value="${m}">Mesa ${m}</option>`;
  }
  return html;
}

document.addEventListener("click", (event) => {
  if (event.target.id !== "btnConfirmarPedido") return;

  const mesa = parseInt(document.getElementById("selectMesa").value);
  const nome = document.getElementById("nomeCliente").value.trim();
  const telefone = document.getElementById("telefoneCliente").value.trim();

  if (!mesa || !nome || !telefone) {
    return alert("Preencha mesa, nome e telefone.");
  }

  const itens = carrinho.map(item => ({
    produtoNome: item.nome,
    quantidade: item.quantidade
  }));

  const corpo = { mesa, nomeCliente: nome, telefone, itens };

  enviarPedido(corpo);
});

function enviarPedido(corpo) {
  fetch("http://localhost:5000/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(corpo)
  })
    .then(res => res.ok ? res.json() : res.text().then(t => { throw new Error(t); }))
    .then(dados => {
      alert(`Pedido salvo com sucesso! ID: ${dados.pedidoId}`);
      location.reload();
    })
    .catch(err => alert("Erro ao enviar pedido: " + err.message));
}

const capitalize = (txt) => txt.charAt(0).toUpperCase() + txt.slice(1);