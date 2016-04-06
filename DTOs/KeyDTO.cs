using System.Collections.Generic;
using MS_Language.Models.Common;

namespace MS_Language.DTOs
{
    public class KeyDTO {
        public string Key {
            get;
            set;
        }

        public ICollection<Dictionary<string, string>> UserRoles {
            get;
            set;
        }

        public string UserID { get; set; }

        public string CompanyId { get; set; }
    }
}