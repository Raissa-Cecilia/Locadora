using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LocadoraBackend.Models
{
    public class Aluguel
    {
        public int Id { get; set; }
        
        [Required]
        public DateTime DataInicio { get; set; }
        public DateTime? DataDevolucao { get; set; } 
        
        [Required]
        public int QuilometragemInicial { get; set; }
        public int? QuilometragemFinal { get; set; }
        
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ValorDiaria { get; set; }
        
        [Column(TypeName = "decimal(18,2)")]
        public decimal? ValorTotal { get; set; }

      
        public int ClienteId { get; set; }
        [ForeignKey("ClienteId")]
        public Cliente? Cliente { get; set; }

        public int VeiculoId { get; set; }
        [ForeignKey("VeiculoId")]
        public Veiculo? Veiculo { get; set; }
    }
}