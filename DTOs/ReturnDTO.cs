using System.Collections.Generic;
using MS_Language.Models.Common;

namespace MS_Language.DTOs
{
    public class ReturnDTO : IKey {

        #region IKey Members

        public string Key {
            get;
            set;
        }

        #endregion

        public virtual ICollection<IKey> ReturnData{get; set;}
    }
}