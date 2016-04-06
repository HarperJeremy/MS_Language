using System.Collections.Generic;
using MS_Language.Models.Common;
using MS_Language.Controllers;

namespace MS_Language.DTOs
{
    public class GenericDTO : IKey {
        #region IKey Members

        public string Key {
            get;
            set;
        }

        #endregion

        public virtual ICollection<Dictionary<string, string>> ReturnData {
            get;
            set;
        }

        public int[] ReturnData2
        {
            get;
            set;
        }

        public bool Success
        {
            get;
            set;
        }

        public virtual ICollection<Dictionary<string, List<object>>> ReturnData4
        {
            get;
            set;
        }
    }
}