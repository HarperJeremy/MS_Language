using System.ComponentModel.DataAnnotations;
using MS_Language.Models.Validation;
using MS_Language.Models.Common;


namespace MS_Language.Models.EF
{
    [MetadataType(typeof(Language_Metadata))]
    public partial class Language : EntityBase, IValidatableObject
    {

        public override string KeyName()
        {
            return "LanguageID";
        }

        public override System.Type GetDataType(string fieldName)
        {
            return GetType().GetProperty(fieldName).PropertyType;
        }


        #region IValidatableObject Members
        public System.Collections.Generic.IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (1 == 0)
            {
                yield return new ValidationResult(
                    "CompanyID is required.",
                    new[] { "CompanyID" }
                );

            }

        }


        #endregion


    }
}
