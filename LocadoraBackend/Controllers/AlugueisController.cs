using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlugueisController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AlugueisController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todos os aluguéis registrados.
        /// </summary>
        /// <returns>Lista de aluguéis</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueis()
        {
            try
            {
                return await _context.Alugueis
                    .Include(a => a.Cliente)
                    .Include(a => a.Veiculo)
                    .ToListAsync();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro interno: {ex.Message}"); }
        }

        /// <summary>
        /// Busca um aluguel específico pelo seu ID.
        /// </summary>
        /// <param name="id">ID do aluguel</param>
        /// <returns>Dados do aluguel selecionado</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            var aluguel = await _context.Alugueis
                .Include(a => a.Cliente)
                .Include(a => a.Veiculo)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (aluguel == null) return NotFound("Aluguel não encontrado.");
            return aluguel;
        }

        /// <summary>
        /// Registra um novo aluguel.
        /// </summary>
        /// <param name="aluguel">Objeto contendo as informações do aluguel</param>
        /// <returns>O aluguel recém-criado</returns>
        [HttpPost]
        public async Task<ActionResult<Aluguel>> PostAluguel(Aluguel aluguel)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Alugueis.Add(aluguel);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.Id }, aluguel);
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao guardar: {ex.Message}"); }
        }

        /// <summary>
        /// Atualiza um aluguel existente (utilizado para registrar a devolução).
        /// </summary>
        /// <param name="id">ID do aluguel</param>
        /// <param name="aluguel">Objeto com os novos dados</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutAluguel(int id, Aluguel aluguel)
        {
            if (id != aluguel.Id) return BadRequest("IDs não coincidem.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(aluguel).State = EntityState.Modified;

            if (aluguel.DataDevolucao != null)
            {
                var dias = (aluguel.DataDevolucao.Value - aluguel.DataInicio).Days;
                if (dias <= 0) dias = 1; 
                aluguel.ValorTotal = dias * aluguel.ValorDiaria;
            }

            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Alugueis.Any(e => e.Id == id)) return NotFound("Aluguel não encontrado.");
                else throw;
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao atualizar: {ex.Message}"); }

            return NoContent();
        }

        /// <summary>
        /// Remove um aluguel do banco de dados.
        /// </summary>
        /// <param name="id">ID do aluguel a ser removido</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            try
            {
                var aluguel = await _context.Alugueis.FindAsync(id);
                if (aluguel == null) return NotFound("Aluguel não encontrado.");

                _context.Alugueis.Remove(aluguel);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao apagar: {ex.Message}"); }
        }
    }
}