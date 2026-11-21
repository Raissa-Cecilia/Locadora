using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriasController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Retorna as categorias cadastradas, com filtros opcionais por nome e ID.
        /// </summary>
        /// <param name="nome">Filtro por nome da categoria</param>
        /// <param name="id">Filtro por ID da categoria</param>
        /// <returns>Lista de categorias</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Categoria>>> GetCategorias([FromQuery] string? nome, [FromQuery] int? id)
        {
            try
            {
                var consulta = _context.Categorias.AsQueryable();

                if (!string.IsNullOrWhiteSpace(nome))
                {
                    consulta = consulta.Where(c => c.Nome.Contains(nome));
                }

                if (id.HasValue)
                {
                    consulta = consulta.Where(c => c.Id == id.Value);
                }

                return await consulta.ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro interno: {ex.Message}");
            }
        }

        /// <summary>
        /// Busca uma categoria pelo seu ID.
        /// </summary>
        /// <param name="id">ID da categoria</param>
        /// <returns>A categoria encontrada</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Categoria>> GetCategoria(int id)
        {
            var categoria = await _context.Categorias.FindAsync(id);
            if (categoria == null) return NotFound("Categoria não encontrada.");
            return categoria;
        }

        /// <summary>
        /// Cria uma nova categoria de veículo.
        /// </summary>
        /// <param name="categoria">Dados da categoria</param>
        /// <returns>A categoria criada</returns>
        [HttpPost]
        public async Task<ActionResult<Categoria>> PostCategoria(Categoria categoria)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                _context.Categorias.Add(categoria);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, categoria);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao guardar: {ex.Message}");
            }
        }

        /// <summary>
        /// Modifica as informações de uma categoria existente.
        /// </summary>
        /// <param name="id">ID da categoria</param>
        /// <param name="categoria">Dados atualizados da categoria</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategoria(int id, Categoria categoria)
        {
            if (id != categoria.Id) return BadRequest("IDs não coincidem.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(categoria).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Categorias.Any(e => e.Id == id)) return NotFound("Categoria não encontrada.");
                else throw;
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao atualizar: {ex.Message}");
            }

            return NoContent();
        }

        /// <summary>
        /// Deleta uma categoria do sistema.
        /// </summary>
        /// <param name="id">ID da categoria a ser excluída</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategoria(int id)
        {
            try
            {
                var categoria = await _context.Categorias.FindAsync(id);
                if (categoria == null) return NotFound("Categoria não encontrada.");

                _context.Categorias.Remove(categoria);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao apagar: {ex.Message}");
            }
        }
    }
}