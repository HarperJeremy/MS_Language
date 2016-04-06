using System.ComponentModel.DataAnnotations;
using MS_Language.Utility;


namespace MS_Language.Models.Validation
{
    public class Language_Metadata
    {
        [Required]
        [Key]
        public int LanguageID { get; set; }
        public string LanguageName { get; set; }
        public string CssFileName { get; set; }
    }
}