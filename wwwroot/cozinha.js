const API_URL = "http://localhost:5000/api/pedidos";

// carrega pedidos da COZINHA (pratos)
async function carregarPedidosCozinha() {
  try {
    const resp = await fetch(`${API_URL}/setor/COZINHA`);
    if (!resp.ok) {
      console.error("Erro ao buscar pedidos da cozinha");
      return;
    }

    const pedidos = await resp.json();
    const tbody = document.getElementById("listaPedidosCozinha");
    tbody.innerHTML = "";

    pedidos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.pedidoId}</td>
        <td>${p.mesa}</td>
        <td>${p.nomeCliente}</td>
        <td>${p.produtoNome}</td>
        <td>${p.quantidade}</td>
        <td>${formatarStatus(p.status)}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" data-status="EmPreparo">Em preparo</button>
          <button class="btn btn-sm btn-primary me-1" data-status="Pronto">Pronto</button>
          <button class="btn btn-sm btn-success" data-status="Entregue">Entregue</button>
        </td>
      `;

      tr.querySelectorAll("button[data-status]").forEach(btn => {
        btn.addEventListener("click", () => {
          const novoStatus = btn.getAttribute("data-status");
          atualizarStatusCozinha(p.pedidoId, novoStatus);
        });
      });

      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Erro geral ao carregar pedidos da cozinha", e);
  }
}

function formatarStatus(status) {
  if (status === "EmPreparo") return "Em preparo";
  return status;
}

async function atualizarStatusCozinha(idPedido, novoStatus) {
  try {
    const resp = await fetch(`${API_URL}/${idPedido}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus })
    });

    if (!resp.ok) {
      alert("Erro ao atualizar status da cozinha");
      return;
    }

    // Histórico dos pratos
    carregarPedidosCozinha();
  } catch (e) {
    console.error("Erro ao atualizar status da cozinha", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnAtualizar = document.getElementById("btnAtualizar");
  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", carregarPedidosCozinha);
  }

  carregarPedidosCozinha(); // Carrega ao abrir..
});
