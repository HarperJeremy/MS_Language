using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MS_Language.Models.Common;

namespace MS_Language.DTOs
{
    public class UtilityDTO : IKey
    {
        #region IKey Members

        public string Key
        {
            get;
            set;
        }

        #endregion
    }
}