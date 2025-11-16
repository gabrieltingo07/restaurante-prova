// ====== VARIÁVEIS GLOBAIS ======
let carrinho = [];
let mesasOcupadas = [];

// ====== FUNÇÕES DE AUMENTAR / DIMINUIR ======
function aumentar(id) {
  let input = document.getElementById(id);
  input.value = parseInt(input.value || "0") + 1;
}

function diminuir(id) {
  let input = document.getElementById(id);
  let valor = parseInt(input.value || "0");
  if (valor > 0) {
    input.value = valor - 1;
  }
}

// Registro de cliques e botões.
document.addEventListener("DOMContentLoaded", function () {
  // Bebidas
  document.getElementById("maisCoca").onclick = function () { aumentar("qtdCoca"); };
  document.getElementById("menosCoca").onclick = function () { diminuir("qtdCoca"); };

  document.getElementById("maisSuco").onclick = function () { aumentar("qtdSuco"); };
  document.getElementById("menosSuco").onclick = function () { diminuir("qtdSuco"); };

  document.getElementById("maisAgua").onclick = function () { aumentar("qtdAgua"); };
  document.getElementById("menosAgua").onclick = function () { diminuir("qtdAgua"); };

  // Pratos
  document.getElementById("maisFeijoada").onclick = function () { aumentar("qtdFeijoada"); };
  document.getElementById("menosFeijoada").onclick = function () { diminuir("qtdFeijoada"); };

  document.getElementById("maisLasanha").onclick = function () { aumentar("qtdLasanha"); };
  document.getElementById("menosLasanha").onclick = function () { diminuir("qtdLasanha"); };

  document.getElementById("maisMacarrao").onclick = function () { aumentar("qtdMacarrao"); };
  document.getElementById("menosMacarrao").onclick = function () { diminuir("qtdMacarrao"); };

  // Botão de adicionar pedido (abre o carrinho)
  document.getElementById("btnFazerPedido").onclick = montarCarrinho;
});

// Abre o modal e monta o carrinho.
function montarCarrinho() {
  carrinho = [];

  let qtdCoca = parseInt(document.getElementById("qtdCoca").value || "0");
  let qtdSuco = parseInt(document.getElementById("qtdSuco").value || "0");
  let qtdAgua = parseInt(document.getElementById("qtdAgua").value || "0");
  let qtdFeijoada = parseInt(document.getElementById("qtdFeijoada").value || "0");
  let qtdLasanha = parseInt(document.getElementById("qtdLasanha").value || "0");
  let qtdMacarrao = parseInt(document.getElementById("qtdMacarrao").value || "0");

  if (qtdCoca > 0) carrinho.push({ nome: "Coca-Cola Lata", quantidade: qtdCoca, valor: 5 });
  if (qtdSuco > 0) carrinho.push({ nome: "Suco de Laranja", quantidade: qtdSuco, valor: 6 });
  if (qtdAgua > 0) carrinho.push({ nome: "Água", quantidade: qtdAgua, valor: 3 });
  if (qtdFeijoada > 0) carrinho.push({ nome: "Feijoada", quantidade: qtdFeijoada, valor: 25 });
  if (qtdLasanha > 0) carrinho.push({ nome: "Lasanha", quantidade: qtdLasanha, valor: 20 });
  if (qtdMacarrao > 0) carrinho.push({ nome: "Macarrão", quantidade: qtdMacarrao, valor: 18 });

  if (carrinho.length === 0) {
    alert("Nenhum item selecionado!");
    return;
  }

  abrirModalCarrinho();
}

// Abre o modal do carrinho
function abrirModalCarrinho() {
  let modalBody = document.getElementById("modalBodyCarrinho");
  let html = "<ul class='list-group mb-3'>";
  let total = 0;

  for (let i = 0; i < carrinho.length; i++) {
    let item = carrinho[i];
    let subtotal = item.quantidade * item.valor;
    total += subtotal;

    html +=
      "<li class='list-group-item d-flex justify-content-between align-items-center'>" +
      "<div><strong>" + item.nome + "</strong><br>" +
      "<small>Qtd: " + item.quantidade + " x R$ " + item.valor.toFixed(2) + "</small></div>" +
      "<span class='badge bg-primary rounded-pill'>R$ " + subtotal.toFixed(2) + "</span></li>";
  }

  html += "</ul>";
  html += "<p><strong>Total: R$ " + total.toFixed(2) + "</strong></p>";

  html += "<label>Mesa:</label>";
  html += "<select id='selectMesa' class='form-select mb-2'>";

  for (let m = 1; m <= 5; m++) {
    if (mesasOcupadas.indexOf(m) !== -1) {
      html += "<option disabled>Mesa " + m + "</option>";
    } else {
      html += "<option value='" + m + "'>Mesa " + m + "</option>";
    }
  }

  html += "</select>";

  html += "<input id='nomeCliente' class='form-control mb-2' placeholder='Nome do cliente'>";
  html += "<input id='telefoneCliente' class='form-control mb-2' placeholder='Telefone'>";
  html += "<button id='btnConfirmarPedido' class='btn btn-success w-100'>Realizar pedido</button>";

  modalBody.innerHTML = html;

  document.getElementById("contadorCarrinho").textContent = carrinho.length;

  let modal = new bootstrap.Modal(document.getElementById("modalCarrinho"));
  modal.show();
}

// Realiza o pedido e envia pro Backend
document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "btnConfirmarPedido") {

    let mesa = parseInt(document.getElementById("selectMesa").value);
    let nome = document.getElementById("nomeCliente").value.trim();
    let telefone = document.getElementById("telefoneCliente").value.trim();

    if (!mesa || nome === "" || telefone === "") {
      alert("Preencha mesa, nome e telefone.");
      return;
    }

    if (carrinho.length === 0) {
      alert("Nenhum item no carrinho.");
      return;
    }

    let itens = carrinho.map(function (item) {
      return {
        produtoNome: item.nome,
        quantidade: item.quantidade
      };
    });

    let corpo = {
      mesa: mesa,
      nomeCliente: nome,
      telefone: telefone,
      itens: itens
    };

    fetch("http://localhost:5000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(corpo)
    })
      .then(function (res) {
        if (!res.ok) {
          return res.text().then(function (t) {
            throw new Error(t || "Erro ao salvar pedido");
          });
        }
        return res.json();
      })
      .then(function (dados) {
        alert("Pedido salvo com sucesso! ID: " + dados.pedidoId);

        carrinho = [];
        document.getElementById("qtdCoca").value = 0;
        document.getElementById("qtdSuco").value = 0;
        document.getElementById("qtdAgua").value = 0;
        document.getElementById("qtdFeijoada").value = 0;
        document.getElementById("qtdLasanha").value = 0;
        document.getElementById("qtdMacarrao").value = 0;
        document.getElementById("contadorCarrinho").textContent = 0;

        let modal = bootstrap.Modal.getInstance(document.getElementById("modalCarrinho"));
        if (modal) modal.hide();
      })
      .catch(function (erro) {
        console.error("Erro ao enviar pedido:", erro);
        alert("Erro ao enviar pedido para o servidor.\n\n" + erro.message);
      });
  }
});
