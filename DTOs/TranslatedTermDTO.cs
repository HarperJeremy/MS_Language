using MS_Language.Models.Common;
using System.Collections.Generic;

namespace MS_Language.DTOs
{
    public class TranslatedTermDTO : IKey
    {

        public string Key { get; set; }
        public string TranslationID { get; set; }
        public string LanguageID { get; set; }
        public string EnglishTermID { get; set; }
        public string TermTranslated { get; set; }


    }
}