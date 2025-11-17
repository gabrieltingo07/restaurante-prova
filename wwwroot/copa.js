const API_URL = "http://localhost:5000/api/pedidos";

// carrega pedidos da COPA (bebidas)
async function carregarPedidosCopa() {
  try {
    const resp = await fetch(`${API_URL}/setor/COPA`);
    if (!resp.ok) {
      console.error("Erro ao buscar pedidos da copa");
      return;
    }

    const pedidos = await resp.json();
    const tbody = document.getElementById("listaPedidosCopa");
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
          <button class="btn btn-sm btn.warning me-1" data-status="EmPreparo">Em preparo</button>
          <button class="btn btn-sm btn-primary me-1" data-status="Pronto">Pronto</button>
          <button class="btn btn-sm btn-success" data-status="Entregue">Entregue</button>
        </td>
      `;

      tr.querySelectorAll("button[data-status]").forEach(btn => {
        btn.addEventListener("click", () => {
          const novoStatus = btn.getAttribute("data-status");
          atualizarStatusCopa(p.pedidoId, novoStatus);
        });
      });

      tbody.appendChild(tr);
    });
  } catch (e) {
    console.error("Erro geral ao carregar pedidos da copa", e);
  }
}

function formatarStatus(status) {
  if (status === "EmPreparo") return "Em preparo";
  return status;
}

async function atualizarStatusCopa(idPedido, novoStatus) {
  try {
    const resp = await fetch(`${API_URL}/${idPedido}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: novoStatus })
    });

    if (!resp.ok) {
      alert("Erro ao atualizar status da copa");
      return;
    }

    // Sai da copa e vai para o histórico.
    carregarPedidosCopa();
  } catch (e) {
    console.error("Erro ao atualizar status da copa", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnAtualizar = document.getElementById("btnAtualizar");
  if (btnAtualizar) {
    btnAtualizar.addEventListener("click", carregarPedidosCopa);
  }

  carregarPedidosCopa(); // Carrega ao abrir
});
