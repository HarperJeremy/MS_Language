using System.Collections.Generic;
using MS_Language.Models.Common;

namespace MS_Language.DTOs
{
    public class ArrayDTO : IKey
    {
        #region IKey Members

        public string Key
        {
            get;
            set;
        }

        #endregion

        public int[] ReturnData
        {
            get;
            set;
        }

        public string[] ReturnDataStrings
        {
            get;
            set;
        }
    }
}