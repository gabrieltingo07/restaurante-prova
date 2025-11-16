using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace ProjetoRestaurante.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/produtos
    public class ProdutosController : ControllerBase
    {
        private readonly string _connectionString;

        public ProdutosController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        // GET api/produtos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProdutoDto>>> GetAll()
        {
            const string sql = @"
                SELECT Id, Nome, Preco, Tipo
                FROM Produtos;";

            using var connection = new SqlConnection(_connectionString);

            var produtos = await connection.QueryAsync<ProdutoDto>(sql);

            return Ok(produtos);
        }

        // GET: /api/produtos/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProdutoDto>> GetById(int id)
        {
            const string sql = @"
                SELECT Id, Nome, Preco, Tipo
                FROM Produtos
                WHERE Id = @Id;";

            using var connection = new SqlConnection(_connectionString);

            var produto = await connection.QueryFirstOrDefaultAsync<ProdutoDto>(sql, new { Id = id });

            if (produto is null)
                return NotFound();

            return Ok(produto);
        }
    }

    // DTO simples para produto
    public class ProdutoDto //DTO = Objeto para transportar dados.
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public string Tipo { get; set; } = string.Empty; // "Cozinha" ou "Copa"
    }
}
