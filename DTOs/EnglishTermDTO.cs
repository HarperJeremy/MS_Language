using MS_Language.Models.Common;
using System.Collections.Generic;

namespace MS_Language.DTOs
{
    public class EnglishTermDTO : IKey
    {

        public string Key { get; set; }
        public string EnglishTermID { get; set; }
        public string Term { get; set; }
        public string BeforeOrAfter { get; set; }
        
    }
}