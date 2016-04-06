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
    public class TranslatedTermRepository : RepositoryBase<TranslatedTerm>
    {
        #region Public Methods


        #endregion

        #region Overrides of RepositoryBase<Organization>

        public override IQueryable<TranslatedTerm> EntityCollection
        {
            get
            {
                return this.DbContext.TranslatedTerms.AsQueryable();
            }
        }

        protected override TranslatedTerm DeleteRecord(TranslatedTerm entity)
        {
            throw new NotImplementedException();
        }

        protected override TranslatedTerm InsertRecord(TranslatedTerm entity)
        {
            DbContext.TranslatedTerms.Add(entity);
            DbContext.SaveChanges();
            return entity;
        }

        protected override TranslatedTerm UpdateRecord(TranslatedTerm entity)
        {
            DbContext.SaveChanges();
            return entity;
        }

        #endregion



        public override List<TranslatedTerm> GetByPredicate(string predicate)
        {
            var iq = DbContext.TranslatedTerms.AsQueryable();
            return predicate.Length > 0 ? iq.Where(predicate, null).ToList() : iq.ToList();
        }
        public List<TranslatedTerm> GetTranslatedTerms(int LanguageID)
        {
            return DbContext.TranslatedTerms.Include("EnglishTerm").Where(x => x.LanguageID == LanguageID).OrderBy(x => x.TermTranslated).ToList();
        }


        public override TranslatedTerm GetById(int Id)
        {
            return EntityCollection.Include("EnglishTerm").SingleOrDefault(w => w.TranslationID == Id);
        }


    }
}
