using System.ComponentModel.DataAnnotations;

namespace LocadoraBackend.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }
        
        [Required]
        [StringLength(11, MinimumLength = 11, ErrorMessage = "CPF deve ter 11 caracteres.")]
        public string Cpf { get; set; }
        
        [Required]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; }
    }
}