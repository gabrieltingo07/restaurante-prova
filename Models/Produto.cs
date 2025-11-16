namespace RestauranteApiSimples.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = "";
        public string Tipo { get; set; } = ""; // PRATO ou BEBIDA
        public decimal Preco { get; set; }
    }
}
