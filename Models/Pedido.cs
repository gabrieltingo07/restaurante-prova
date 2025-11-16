namespace RestauranteApiSimples.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public int Mesa { get; set; }
        public string NomeCliente { get; set; } = "";
        public string Telefone { get; set; } = "";
        public string Status { get; set; } = ""; // EmPreparo, Pronto, Entregue
        public DateTime DataCriacao { get; set; }
    }
}
