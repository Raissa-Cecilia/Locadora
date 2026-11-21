using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeiculosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VeiculosController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna todos os veículos cadastrados, incluindo Fabricante e Categoria.
        /// </summary>
        /// <returns>Lista de veículos</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Veiculo>>> GetVeiculos()
        {
            try
            {
                return await _context.Veiculos
                    .Include(v => v.Fabricante)
                    .Include(v => v.Categoria)
                    .ToListAsync();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro interno: {ex.Message}"); }
        }

        /// <summary>
        /// Retorna um veículo específico pelo seu ID.
        /// </summary>
        /// <param name="id">ID do veículo</param>
        /// <returns>Dados do veículo</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Veiculo>> GetVeiculo(int id)
        {
            var veiculo = await _context.Veiculos
                .Include(v => v.Fabricante)
                .Include(v => v.Categoria)
                .FirstOrDefaultAsync(v => v.Id == id);

            if (veiculo == null) return NotFound("Veículo não encontrado.");
            return veiculo;
        }

        /// <summary>
        /// Cadastra um novo veículo no sistema.
        /// </summary>
        /// <param name="veiculo">Objeto contendo os dados do veículo</param>
        /// <returns>O veículo recém-cadastrado</returns>
        [HttpPost]
        public async Task<ActionResult<Veiculo>> PostVeiculo(Veiculo veiculo)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Veiculos.Add(veiculo);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetVeiculo), new { id = veiculo.Id }, veiculo);
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao guardar: {ex.Message}"); }
        }

        /// <summary>
        /// Atualiza os dados de um veículo existente.
        /// </summary>
        /// <param name="id">ID do veículo a ser atualizado</param>
        /// <param name="veiculo">Objeto com os novos dados do veículo</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutVeiculo(int id, Veiculo veiculo)
        {
            if (id != veiculo.Id) return BadRequest("IDs não coincidem.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(veiculo).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Veiculos.Any(e => e.Id == id)) return NotFound("Veículo não encontrado.");
                else throw;
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao atualizar: {ex.Message}"); }

            return NoContent();
        }

        /// <summary>
        /// Exclui um veículo do sistema.
        /// </summary>
        /// <param name="id">ID do veículo a ser excluído</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVeiculo(int id)
        {
            try
            {
                var veiculo = await _context.Veiculos.FindAsync(id);
                if (veiculo == null) return NotFound("Veículo não encontrado.");

                _context.Veiculos.Remove(veiculo);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao apagar: {ex.Message}"); }
        }
    }
}