namespace RestauranteApiSimples.Models
{
    // Item que vem do JS (carrinho)
    public class ItemPedidoDto
    {
        public string ProdutoNome { get; set; } = "";
        public int Quantidade { get; set; }
    }

    // Pedido que vem do front
    public class CriarPedidoDto
    {
        public int Mesa { get; set; }
        public string NomeCliente { get; set; } = "";
        public string Telefone { get; set; } = "";
        public List<ItemPedidoDto> Itens { get; set; } = new();
    }

    public class LoginDto
    {
        public string Login { get; set; } = "";
        public string Senha { get; set; } = "";
    }

    // Lista pedidos por setor, de forma simples (linha por linha)
    public class PedidoSetorView
    {
        public int PedidoId { get; set; }
        public int Mesa { get; set; }
        public string NomeCliente { get; set; } = "";
        public string Status { get; set; } = "";
        public string ProdutoNome { get; set; } = "";
        public string Tipo { get; set; } = ""; // PRATO/BEBIDA
        public int Quantidade { get; set; }
    }
}
