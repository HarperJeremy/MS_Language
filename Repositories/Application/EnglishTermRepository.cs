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
    public class EnglishTermRepository : RepositoryBase<EnglishTerm>
    {
        #region Public Methods


        #endregion

        #region Overrides of RepositoryBase<Organization>

        public override IQueryable<EnglishTerm> EntityCollection
        {
            get
            {
                return this.DbContext.EnglishTerms.AsQueryable();
            }
        }

        protected override EnglishTerm DeleteRecord(EnglishTerm entity)
        {
            throw new NotImplementedException();
        }

        protected override EnglishTerm InsertRecord(EnglishTerm entity)
        {
            DbContext.EnglishTerms.Add(entity);
            DbContext.SaveChanges();
            return entity;
        }

        protected override EnglishTerm UpdateRecord(EnglishTerm entity)
        {
            DbContext.SaveChanges();
            return entity;
        }

        #endregion



        public override List<EnglishTerm> GetByPredicate(string predicate)
        {
            var iq = DbContext.EnglishTerms.AsQueryable();
            return predicate.Length > 0 ? iq.Where(predicate, null).ToList() : iq.ToList();
        }
        public List<EnglishTerm> GetEnglishTerms()
        {
            return DbContext.EnglishTerms.OrderBy(x => x.Term).ToList();
        }




        public override EnglishTerm GetById(int Id)
        {
            return EntityCollection.SingleOrDefault(w => w.EnglishTermID == Id);
        }


    }
}
