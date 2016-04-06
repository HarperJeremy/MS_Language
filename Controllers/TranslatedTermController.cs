using MS_Language.BusinessLogic.Application;
using MS_Language.Controllers;
using MS_Language.Repository.Application;
using MS_Language.Utility;
using MS_Language.DTOs;
using MS_Language.Models.EF;
using MS_Language.Models.Common;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.Entity.Validation;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace MS_Language.Controllers
{
    public class TranslatedTermController : BaseApiController
    {
        internal HttpResponseMessage TranslatedTerms(HttpRequestMessage request, TranslatedTermDTO cqDTO)
        {

            var ur = new TranslatedTermRepository();
            var u = new TranslatedTerm();
            var data = ur.GetTranslatedTerms(int.Parse(cqDTO.LanguageID));
            var er = new EnglishTermRepository();
            var eterms = er.GetEnglishTerms();
            var col = new Collection<Dictionary<string, string>>();
            foreach (var item in eterms)
            {
                var tTerm = data.Where(x => x.EnglishTermID == item.EnglishTermID).FirstOrDefault();
                var dic = new Dictionary<string, string>();                
                dic.Add("EnglishTermID", item.EnglishTermID.ToString());
                dic.Add("LanguageID", cqDTO.LanguageID);
                dic.Add("Term", item.Term.ToString());

                if (tTerm == null)
                {
                    dic.Add("TranslationID", "-1");
                    dic.Add("TermTranslated", "");
                }
                else
                {
                    dic.Add("TranslationID", tTerm.TranslationID.ToString());
                    dic.Add("TermTranslated", tTerm.TermTranslated);
                }

                col.Add(dic);


            }

            var retVal = new GenericDTO
            {

                ReturnData = col
            };
            return Request.CreateResponse(HttpStatusCode.OK, retVal);


        }

        internal HttpResponseMessage TranslatedTermDetail(HttpRequestMessage request, TranslatedTermDTO cqDTO)
        {

            var ur = new TranslatedTermRepository();
            var u = new TranslatedTerm();
            var data = ur.GetById(int.Parse(cqDTO.TranslationID));
            var col = new Collection<Dictionary<string, string>>();



            var dic = new Dictionary<string, string>();
            dic.Add("TranslationID", data.TranslationID.ToString());
            dic.Add("TermTranslated", data.TermTranslated);
            dic.Add("EnglishTermID", data.EnglishTermID.ToString());
            dic.Add("LanguageID", data.LanguageID.ToString());
            dic.Add("Term", data.EnglishTerm.Term.ToString());
            col.Add(dic);


            var retVal = new GenericDTO
            {

                ReturnData = col
            };
            return Request.CreateResponse(HttpStatusCode.OK, retVal);


        }


        [HttpPost]
        public HttpResponseMessage TranslatedTerms([FromBody] TranslatedTermDTO cqDTO)
        {
            return TranslatedTerms(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage TranslatedTermList([FromBody] TranslatedTermDTO cqDTO)
        {
            return TranslatedTerms(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage TranslatedTermDetail([FromBody] TranslatedTermDTO cqDTO)
        {
            return TranslatedTermDetail(Request, cqDTO);
        }

        [HttpPut]
        public HttpResponseMessage TranslatedTermAddOrEdit([FromBody] TranslatedTermDTO uDto)
        {


            var NETranslatedTermId = 0;
            if (int.TryParse(uDto.TranslationID, out NETranslatedTermId))
            {
                if (NETranslatedTermId == -1)
                {
                    //  creating new TranslatedTerm record   
                    return ProcessNewTranslatedTermRecord(Request, uDto);
                }
                else
                {
                    //  editing existing TranslatedTerm record  
                    return ProcessExistingTranslatedTermRecord(Request, uDto, NETranslatedTermId);
                }
            }
            var msg = "invalid data structure submitted";
            return Request.CreateResponse(HttpStatusCode.BadRequest, msg);


        }



        private HttpResponseMessage ProcessNewTranslatedTermRecord(HttpRequestMessage request, TranslatedTermDTO uDto)
        {
            var ur = new TranslatedTermRepository();
            var lr = new LanguageRepository();
            var er = new EnglishTermRepository();

            //var TranslatedTermRepository = new TranslatedTermRepository();
            var TranslatedTerm = new TranslatedTerm();
            TranslatedTerm.TermTranslated = uDto.TermTranslated;
            TranslatedTerm.EnglishTermID = int.Parse(uDto.EnglishTermID);
            TranslatedTerm.LanguageID = int.Parse(uDto.LanguageID);
            TranslatedTerm = ur.Save(TranslatedTerm);
            uDto.TranslationID = TranslatedTerm.TranslationID.ToString();
            var response = request.CreateResponse(HttpStatusCode.Created, uDto);
            response.Headers.Location = new Uri(Url.Link("Default", new
            {
                id = TranslatedTerm.TranslationID
            }));
            return response;
        }

        private HttpResponseMessage ProcessExistingTranslatedTermRecord(HttpRequestMessage request, TranslatedTermDTO cqDto, int contactId)
        {
            var ur = new TranslatedTermRepository();
            //var TranslatedTermRepository = new TranslatedTermRepository();
            var TranslatedTerm = new TranslatedTerm();
            TranslatedTerm = ur.GetById(contactId);
            //int? companyIdx = -1;
            //  is the TranslatedTerm eligible to update the prospect?
            if (cqDto.TermTranslated != null)
            {
                TranslatedTerm.TermTranslated = cqDto.TermTranslated;
            }

            
            ur.Save(TranslatedTerm);
            return request.CreateResponse(HttpStatusCode.Accepted, cqDto);

        }




        private List<DbValidationError> GetValidationErrors(TranslatedTermRepository pr, TranslatedTerm contact, TranslatedTermDTO cqDto, string companyId, int TranslatedTermId)
        {
            contact.ProcessRecord(cqDto);
            return pr.Validate(contact);
        }


    }
}