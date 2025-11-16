namespace ProjetoRestaurante.Models
{
    // Produto cadastrado no banco (tabela Produtos)
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = "";
        public string Tipo { get; set; } = ""; // PRATO ou BEBIDA
        public decimal Preco { get; set; }
    }

    // Item que vem do frontend (carrinho)
    public class ItemPedidoDto
    {
        public string ProdutoNome { get; set; } = "";
        public int Quantidade { get; set; }
    }

    // Pedido completo que vem do frontend
    public class CriarPedidoDto
    {
        public int Mesa { get; set; }
        public string NomeCliente { get; set; } = "";
        public string Telefone { get; set; } = "";
        public List<ItemPedidoDto> Itens { get; set; } = new();
    }

    // Modelo para listar pedidos por setor (cozinha/copa/histórico)
    public class PedidoSetorView
    {
        public int PedidoId { get; set; }
        public int Mesa { get; set; }
        public string NomeCliente { get; set; } = "";
        public string Status { get; set; } = "";
        public string ProdutoNome { get; set; } = "";
        public string Tipo { get; set; } = ""; // PRATO ou BEBIDA
        public int Quantidade { get; set; }
    }
}
