using LocadoraBackend.Data;
using Microsoft.AspNetCore.Mvc;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RelatoriosController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna uma lista de veículos com o nome de seus respectivos fabricantes.
        /// </summary>
        /// <returns>Lista com Modelo, Ano e Fabricante</returns>
        [HttpGet("veiculos-fabricantes")]
        public IActionResult GetVeiculosComFabricantes()
        {
            var query = from v in _context.Veiculos
                        join f in _context.Fabricantes on v.FabricanteId equals f.Id 
                        select new { v.Modelo, v.AnoFabricacao, Fabricante = f.Nome };

            return Ok(query.ToList());
        }

        /// <summary>
        /// Retorna o histórico de aluguéis de um cliente específico.
        /// </summary>
        /// <param name="clienteId">ID do cliente a ser consultado</param>
        /// <returns>Lista de aluguéis com dados do veículo e valores</returns>
        [HttpGet("alugueis-por-cliente/{clienteId}")]
        public IActionResult GetAlugueisPorCliente(int clienteId)
        {
            var query = from a in _context.Alugueis
                        join c in _context.Clientes on a.ClienteId equals c.Id 
                        join v in _context.Veiculos on a.VeiculoId equals v.Id 
                        where c.Id == clienteId
                        select new { Cliente = c.Nome, Veiculo = v.Modelo, a.DataInicio, a.ValorTotal };

            return Ok(query.ToList());
        }

        /// <summary>
        /// Retorna todos os clientes cadastrados e a data de seus aluguéis (se houver).
        /// </summary>
        /// <returns>Lista de clientes com status de aluguel</returns>
        [HttpGet("clientes-com-sem-alugueis")]
        public IActionResult GetClientesLeftJoinAlugueis()
        {
            var query = from c in _context.Clientes
                        join a in _context.Alugueis on c.Id equals a.ClienteId into alugueisCliente
                        from ac in alugueisCliente.DefaultIfEmpty() 
                        select new 
                        { 
                            Cliente = c.Nome, 
                            DataAluguel = ac != null ? ac.DataInicio.ToString() : "Nenhum aluguel realizado" 
                        };

            return Ok(query.ToList());
        }

        /// <summary>
        /// Retorna a quantidade de veículos cadastrados por cada fabricante.
        /// </summary>
        /// <returns>Lista de fabricantes com a respectiva contagem de veículos</returns>
        [HttpGet("fabricantes-qtd-veiculos")]
        public IActionResult GetFabricantesLeftJoinVeiculos()
        {
            var query = from f in _context.Fabricantes
                        join v in _context.Veiculos on f.Id equals v.FabricanteId into veiculosFab
                        from vf in veiculosFab.DefaultIfEmpty() 
                        group vf by f.Nome into agrupado
                        select new 
                        { 
                            Fabricante = agrupado.Key, 
                            QuantidadeVeiculos = agrupado.Count(x => x != null) 
                        };

            return Ok(query.ToList());
        }

        /// <summary>
        /// Retorna todos os aluguéis em andamento (sem data de devolução), calculando os dias alugados.
        /// </summary>
        /// <returns>Lista de aluguéis em aberto</returns>
        [HttpGet("alugueis-em-aberto")]
        public IActionResult GetAlugueisEmAberto()
        {
            var query = from a in _context.Alugueis
                        join c in _context.Clientes on a.ClienteId equals c.Id 
                        join v in _context.Veiculos on a.VeiculoId equals v.Id 
                        join cat in _context.Categorias on v.CategoriaId equals cat.Id 
                        where a.DataDevolucao == null
                        select new 
                        { 
                            Cliente = c.Nome, 
                            Veiculo = v.Modelo, 
                            Categoria = cat.Nome, 
                            DiasAlugado = (DateTime.Now - a.DataInicio).Days 
                        };

            return Ok(query.ToList());
        }
    }
}