using System.ComponentModel.DataAnnotations;
using MS_Language.Utility;

namespace MS_Language.Models.Validation
{
    class EnglishTerm_Metadata
    {
        [Required]
        [Key]
        public int EnglishTermID { get; set; }
        public string Term { get; set; }
        public string BeforeOrAfter { get; set; }




    }
}
