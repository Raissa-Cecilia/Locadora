using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraBackend.Models
{
    public class Veiculo
    {
        public int Id { get; set; }
        
        [Required]
        public string Modelo { get; set; }
        
        [Required]
        public int AnoFabricacao { get; set; }
        
        [Required]
        public int Quilometragem { get; set; }

       
        public int FabricanteId { get; set; }
        [ForeignKey("FabricanteId")]
        public Fabricante? Fabricante { get; set; }

        public int CategoriaId { get; set; }
        [ForeignKey("CategoriaId")]
        public Categoria? Categoria { get; set; }
    }
}