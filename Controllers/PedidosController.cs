using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using ProjetoRestaurante.Models;

namespace ProjetoRestaurante.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // /api/pedidos
    public class PedidosController : ControllerBase
    {
        private readonly string _connectionString;

        public PedidosController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        // DTO simples para atualizar o status
        public class AtualizarStatusDto
        {
            public string Status { get; set; } = "";
        }

        // POST api de pedidos: Cria pedidos
        [HttpPost]
        public IActionResult CriarPedido([FromBody] CriarPedidoDto dto)
        {
            if (dto.Itens == null || dto.Itens.Count == 0)
                return BadRequest("Pedido sem itens");

            using (var conexao = new SqlConnection(_connectionString))
            {
                conexao.Open();
                var trans = conexao.BeginTransaction();

                try
                {
                    // Cria o pedido com status inicial "EmPreparo"
                    string sqlPedido = @"
                        INSERT INTO Pedidos (Mesa, NomeCliente, Telefone, Status)
                        VALUES (@Mesa, @NomeCliente, @Telefone, 'EmPreparo');
                        SELECT CAST(SCOPE_IDENTITY() as int);";

                    int pedidoId = conexao.ExecuteScalar<int>(
                        sqlPedido,
                        new
                        {
                            dto.Mesa,
                            dto.NomeCliente,
                            dto.Telefone
                        },
                        trans
                    );

                    // para cada item busca o produto por NOME e cria PedidoItens
                    foreach (var item in dto.Itens)
                    {
                        string sqlProduto = "SELECT TOP 1 * FROM Produtos WHERE Nome = @Nome";

                        var produto = conexao.QueryFirstOrDefault<Produto>(
                            sqlProduto,
                            new { Nome = item.ProdutoNome },
                            trans
                        );

                        if (produto == null)
                        {
                            trans.Rollback();
                            return BadRequest("Produto não encontrado: " + item.ProdutoNome);
                        }

                        string sqlItem = @"
                            INSERT INTO PedidoItens (PedidoId, ProdutoId, Quantidade, PrecoUnitario)
                            VALUES (@PedidoId, @ProdutoId, @Quantidade, @PrecoUnitario);";

                        conexao.Execute(
                            sqlItem,
                            new
                            {
                                PedidoId = pedidoId,
                                ProdutoId = produto.Id,
                                Quantidade = item.Quantidade,
                                PrecoUnitario = produto.Preco
                            },
                            trans
                        );
                    }

                    trans.Commit();
                    return Ok(new { PedidoId = pedidoId });
                }
                catch (Exception ex)
                {
                    trans.Rollback();
                    return StatusCode(500, "Erro ao salvar pedido: " + ex.Message);
                }
            }
        }

        
        [HttpGet("setor/{setor}")]
        public IActionResult ListarPorSetor(string setor, [FromQuery] string? status)
        {
            using (var conexao = new SqlConnection(_connectionString))
            {
                // cozinha = só PRATO, copa = só BEBIDA
                string tipoProduto = setor.ToUpper() == "COZINHA" ? "PRATO" : "BEBIDA";

                string sql = @"
                    SELECT
                        p.Id AS PedidoId,
                        p.Mesa,
                        p.NomeCliente,
                        p.Status,
                        pr.Nome AS ProdutoNome,
                        pr.Tipo,
                        pi.Quantidade
                    FROM Pedidos p
                    INNER JOIN PedidoItens pi ON pi.PedidoId = p.Id
                    INNER JOIN Produtos pr ON pr.Id = pi.ProdutoId
                    WHERE pr.Tipo = @Tipo
                      AND p.Status <> 'Entregue'";

                if (!string.IsNullOrWhiteSpace(status))
                {
                    sql += " AND p.Status = @Status";
                }

                var lista = conexao.Query<PedidoSetorView>(
                    sql,
                    new { Tipo = tipoProduto, Status = status }
                );

                return Ok(lista);
            }
        }

        //Status pedidos
        [HttpPut("{id}/status")]
        public IActionResult AtualizarStatus(int id, [FromBody] AtualizarStatusDto dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Status))
                return BadRequest("Status inválido");

            using (var conexao = new SqlConnection(_connectionString))
            {
                string sql = "UPDATE Pedidos SET Status = @Status WHERE Id = @Id";

                int linhas = conexao.Execute(sql, new { Status = dto.Status, Id = id });

                if (linhas == 0)
                    return NotFound("Pedido não encontrado");

                return NoContent();
            }
        }


        //Histórico de pedidos cozinha e copa.
        
        [HttpGet("historico")]
        public IActionResult Historico([FromQuery] string? setor)
        {
            using (var conexao = new SqlConnection(_connectionString))
            {
                string sql = @"
                    SELECT
                        p.Id AS PedidoId,
                        p.Mesa,
                        p.NomeCliente,
                        p.Status,
                        pr.Nome AS ProdutoNome,
                        pr.Tipo,
                        pi.Quantidade
                    FROM Pedidos p
                    INNER JOIN PedidoItens pi ON pi.PedidoId = p.Id
                    INNER JOIN Produtos pr ON pr.Id = pi.ProdutoId
                    WHERE p.Status = 'Entregue'";

                string? tipoProduto = null;

                if (!string.IsNullOrWhiteSpace(setor))
                {
                    var s = setor.ToUpper();
                    if (s == "COZINHA")
                        tipoProduto = "PRATO";
                    else if (s == "COPA")
                        tipoProduto = "BEBIDA";
                }

                if (tipoProduto != null)
                {
                    sql += " AND pr.Tipo = @Tipo";
                    var listaFiltrada = conexao.Query<PedidoSetorView>(sql, new { Tipo = tipoProduto });
                    return Ok(listaFiltrada);
                }
                else
                {
                    var lista = conexao.Query<PedidoSetorView>(sql);
                    return Ok(lista);
                }
            }
        }
    }
}
