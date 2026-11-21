using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarteiraController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CarteiraController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Consulta o saldo de um cliente.
        /// </summary>
        /// <param name="clienteId">ID do cliente</param>
        /// <returns>Saldo atual do cliente</returns>
        [HttpGet("saldo/{clienteId}")]
        public async Task<IActionResult> ConsultarSaldo(int clienteId)
        {
            var cliente = await _context.Clientes.FindAsync(clienteId);
            if (cliente == null) return NotFound("Cliente não encontrado.");

            return Ok(new { clienteId = cliente.Id, nome = cliente.Nome, saldo = cliente.Saldo });
        }

        /// <summary>
        /// Realiza uma recarga no saldo do cliente.
        /// </summary>
        /// <param name="dados">Dados da recarga</param>
        /// <returns>Saldo atualizado</returns>
        [HttpPost("recarga")]
        public async Task<IActionResult> Recarregar([FromBody] RecargaRequest dados)
        {
            if (dados.Valor <= 0) return BadRequest("Informe um valor de recarga válido.");

            var cliente = await _context.Clientes.FindAsync(dados.ClienteId);
            if (cliente == null) return NotFound("Cliente não encontrado.");

            cliente.Saldo += dados.Valor;
            await _context.SaveChangesAsync();

            return Ok(new { clienteId = cliente.Id, nome = cliente.Nome, saldo = cliente.Saldo });
        }

        /// <summary>
        /// Realiza o pagamento de um aluguel utilizando o saldo do cliente.
        /// </summary>
        /// <param name="dados">Dados do pagamento</param>
        /// <returns>Resultado do pagamento</returns>
        [HttpPost("pagamento")]
        public async Task<IActionResult> Pagar([FromBody] PagamentoRequest dados)
        {
            var aluguel = await _context.Alugueis
                .Include(a => a.Cliente)
                .FirstOrDefaultAsync(a => a.Id == dados.AluguelId);

            if (aluguel == null) return NotFound("Aluguel não encontrado.");
            if (aluguel.ClienteId != dados.ClienteId) return BadRequest("O aluguel não pertence ao cliente informado.");
            if (aluguel.ValorTotal == null || aluguel.ValorTotal <= 0) return BadRequest("O aluguel ainda não possui valor total para pagamento.");
            if (aluguel.Pago) return BadRequest("Este aluguel já foi pago.");
            if (aluguel.Cliente == null) return NotFound("Cliente não encontrado.");
            if (aluguel.Cliente.Saldo < aluguel.ValorTotal.Value) return BadRequest("Saldo insuficiente para realizar o pagamento.");

            aluguel.Cliente.Saldo -= aluguel.ValorTotal.Value;
            aluguel.Pago = true;
            aluguel.DataPagamento = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                mensagem = "Pagamento realizado com sucesso.",
                clienteId = aluguel.ClienteId,
                saldo = aluguel.Cliente.Saldo,
                aluguelId = aluguel.Id,
                pago = aluguel.Pago
            });
        }
    }

    public class RecargaRequest
    {
        public int ClienteId { get; set; }
        public decimal Valor { get; set; }
    }

    public class PagamentoRequest
    {
        public int ClienteId { get; set; }
        public int AluguelId { get; set; }
    }
}
