using System.ComponentModel.DataAnnotations;

namespace LocadoraBackend.Models
{
    public class Categoria
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "O nome da categoria é obrigatório.")]
        [StringLength(50)]
        public string Nome { get; set; }
    }
}
