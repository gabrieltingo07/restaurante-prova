const API_URL = "http://localhost:5000/api/pedidos";
const SETOR_COZINHA = "COZINHA";

function formatarStatus(status) {
  if (status === "EmPreparo") return "Em preparo";
  return status;
}

async function carregarHistoricoCozinha() {
  try {
    const resp = await fetch(`${API_URL}/historico?setor=${SETOR_COZINHA}`);
    if (!resp.ok) {
      console.error("Erro ao buscar histórico da cozinha");
      return;
    }

    const pedidos = await resp.json();
    const tbody = document.getElementById("tbodyHistoricoCozinha");
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
      `;
      tbody.appendChild(tr);
    });

  } catch (e) {
    console.error("Erro geral ao carregar histórico da cozinha", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnAtualizarHistoricoCozinha");
  if (btn) {
    btn.addEventListener("click", carregarHistoricoCozinha);
  }

  carregarHistoricoCozinha();
});
