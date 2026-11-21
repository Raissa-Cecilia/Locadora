using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FabricantesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FabricantesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lista todos os fabricantes cadastrados.
        /// </summary>
        /// <returns>Lista de fabricantes</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fabricante>>> GetFabricantes()
        {
            try { return await _context.Fabricantes.ToListAsync(); }
            catch (Exception ex) { return StatusCode(500, $"Erro interno: {ex.Message}"); }
        }

        /// <summary>
        /// Busca um fabricante específico pelo seu ID.
        /// </summary>
        /// <param name="id">ID do fabricante</param>
        /// <returns>O fabricante encontrado</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Fabricante>> GetFabricante(int id)
        {
            var fabricante = await _context.Fabricantes.FindAsync(id);
            if (fabricante == null) return NotFound("Fabricante não encontrado.");
            return fabricante;
        }

        /// <summary>
        /// Adiciona um novo fabricante.
        /// </summary>
        /// <param name="fabricante">Dados do fabricante</param>
        /// <returns>O fabricante recém-criado</returns>
        [HttpPost]
        public async Task<ActionResult<Fabricante>> PostFabricante(Fabricante fabricante)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Fabricantes.Add(fabricante);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetFabricante), new { id = fabricante.Id }, fabricante);
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao guardar: {ex.Message}"); }
        }

        /// <summary>
        /// Atualiza os dados de um fabricante.
        /// </summary>
        /// <param name="id">ID do fabricante</param>
        /// <param name="fabricante">Novos dados do fabricante</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutFabricante(int id, Fabricante fabricante)
        {
            if (id != fabricante.Id) return BadRequest("IDs não coincidem.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(fabricante).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Fabricantes.Any(e => e.Id == id)) return NotFound("Fabricante não encontrado.");
                else throw;
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao atualizar: {ex.Message}"); }

            return NoContent();
        }

        /// <summary>
        /// Exclui um fabricante do banco de dados.
        /// </summary>
        /// <param name="id">ID do fabricante a ser excluído</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabricante(int id)
        {
            try
            {
                var fabricante = await _context.Fabricantes.FindAsync(id);
                if (fabricante == null) return NotFound("Fabricante não encontrado.");

                _context.Fabricantes.Remove(fabricante);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao apagar: {ex.Message}"); }
        }
    }
}