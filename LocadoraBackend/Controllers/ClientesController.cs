using LocadoraBackend.Data;
using LocadoraBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LocadoraBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClientesController(AppDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Lista todos os clientes cadastrados.
        /// </summary>
        /// <returns>Lista de clientes</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
        {
            try { return await _context.Clientes.ToListAsync(); }
            catch (Exception ex) { return StatusCode(500, $"Erro interno: {ex.Message}"); }
        }

        /// <summary>
        /// Busca um cliente pelo seu ID.
        /// </summary>
        /// <param name="id">ID do cliente</param>
        /// <returns>O cliente encontrado</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Cliente>> GetCliente(int id)
        {
            var cliente = await _context.Clientes.FindAsync(id);
            if (cliente == null) return NotFound("Cliente não encontrado.");
            return cliente;
        }

        /// <summary>
        /// Cadastra um novo cliente.
        /// </summary>
        /// <param name="cliente">Dados do cliente</param>
        /// <returns>O cliente cadastrado</returns>
        [HttpPost]
        public async Task<ActionResult<Cliente>> PostCliente(Cliente cliente)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                _context.Clientes.Add(cliente);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCliente), new { id = cliente.Id }, cliente);
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao guardar: {ex.Message}"); }
        }

        /// <summary>
        /// Atualiza os dados de um cliente existente.
        /// </summary>
        /// <param name="id">ID do cliente</param>
        /// <param name="cliente">Novos dados do cliente</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCliente(int id, Cliente cliente)
        {
            if (id != cliente.Id) return BadRequest("IDs não coincidem.");
            if (!ModelState.IsValid) return BadRequest(ModelState);

            _context.Entry(cliente).State = EntityState.Modified;
            try { await _context.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Clientes.Any(e => e.Id == id)) return NotFound("Cliente não encontrado.");
                else throw;
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao atualizar: {ex.Message}"); }

            return NoContent();
        }

        /// <summary>
        /// Exclui um cliente do sistema.
        /// </summary>
        /// <param name="id">ID do cliente a ser excluído</param>
        /// <returns>Sem conteúdo em caso de sucesso</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCliente(int id)
        {
            try
            {
                var cliente = await _context.Clientes.FindAsync(id);
                if (cliente == null) return NotFound("Cliente não encontrado.");

                _context.Clientes.Remove(cliente);
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex) { return StatusCode(500, $"Erro ao apagar: {ex.Message}"); }
        }
    }
}