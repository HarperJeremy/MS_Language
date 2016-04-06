using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Validation;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Security.Cryptography;
using System.Text;
using MS_Language.Utility;
using MS_Language.Models.EF;

namespace MS_Language.Repository.Application
{
    public class LanguageRepository : RepositoryBase<Language>
    {
        #region Public Methods


        #endregion

        #region Overrides of RepositoryBase<Organization>

        public override IQueryable<Language> EntityCollection
        {
            get
            {
                return this.DbContext.Languages.AsQueryable();
            }
        }

        protected override Language DeleteRecord(Language entity)
        {
            throw new NotImplementedException();
        }

        protected override Language InsertRecord(Language entity)
        {
            DbContext.Languages.Add(entity);
            DbContext.SaveChanges();
            return entity;
        }

        protected override Language UpdateRecord(Language entity)
        {
            DbContext.SaveChanges();
            return entity;
        }

        #endregion



        public override List<Language> GetByPredicate(string predicate)
        {
            var iq = DbContext.Languages.AsQueryable();
            return predicate.Length > 0 ? iq.Where(predicate, null).ToList() : iq.ToList();
        }
        public List<Language> GetLanguages()
        {
            return DbContext.Languages.OrderBy(x => x.LanguageName).ToList();
        }


        public override Language GetById(int Id)
        {
            return EntityCollection.SingleOrDefault(w => w.LanguageID == Id);
        }


    }
}
