using System.ComponentModel.DataAnnotations;

namespace LocadoraBackend.Models
{
    public class Fabricante
    {
        public int Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }
    }
}