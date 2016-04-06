using System.ComponentModel.DataAnnotations;
using MS_Language.Utility;

namespace MS_Language.Models.Validation
{
    public class TranslatedTerm_Metadata
    {
        [Required]
        [Key]
        public int TranslationID { get; set; }
        public int LanguageID { get; set; }
        public int EnglishTermID { get; set; }
        public string TermTranslated { get; set; }
    }
}