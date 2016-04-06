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
    public class EnglishTermController : BaseApiController
    {
        internal HttpResponseMessage EnglishTerms(HttpRequestMessage request, EnglishTermDTO cqDTO)
        {

            var ur = new EnglishTermRepository();
            var u = new EnglishTerm();
            var data = ur.GetEnglishTerms();
            var col = new Collection<Dictionary<string, string>>();
            foreach (var item in data)
            {

                var dic = new Dictionary<string, string>();
                dic.Add("EnglishTermID", item.EnglishTermID.ToString());
                dic.Add("Term", item.Term);
                dic.Add("BeforeOrAfter", item.BeforeOrAfter);
                col.Add(dic);


            }

            var retVal = new GenericDTO
            {

                ReturnData = col
            };
            return Request.CreateResponse(HttpStatusCode.OK, retVal);


        }

        internal HttpResponseMessage EnglishTermDetail(HttpRequestMessage request, EnglishTermDTO cqDTO)
        {

            var ur = new EnglishTermRepository();
            var u = new EnglishTerm();
            var data = ur.GetById(int.Parse(cqDTO.EnglishTermID));
            var col = new Collection<Dictionary<string, string>>();



            var dic = new Dictionary<string, string>();
            dic.Add("EnglishTermID", data.EnglishTermID.ToString());
            dic.Add("Term", data.Term);
            dic.Add("BeforeOrAfter", data.BeforeOrAfter);
            col.Add(dic);


            var retVal = new GenericDTO
            {

                ReturnData = col
            };
            return Request.CreateResponse(HttpStatusCode.OK, retVal);


        }


        [HttpPost]
        public HttpResponseMessage EnglishTerms([FromBody] EnglishTermDTO cqDTO)
        {
            return EnglishTerms(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage EnglishTermList([FromBody] EnglishTermDTO cqDTO)
        {
            return EnglishTerms(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage EnglishTermDetail([FromBody] EnglishTermDTO cqDTO)
        {
            return EnglishTermDetail(Request, cqDTO);
        }

        [HttpPut]
        public HttpResponseMessage EnglishTermAddOrEdit([FromBody] EnglishTermDTO uDto)
        {


            var NEEnglishTermId = 0;
            if (int.TryParse(uDto.EnglishTermID, out NEEnglishTermId))
            {
                if (NEEnglishTermId == -1)
                {
                    //  creating new EnglishTerm record   
                    return ProcessNewEnglishTermRecord(Request, uDto);
                }
                else
                {
                    //  editing existing EnglishTerm record  
                    return ProcessExistingEnglishTermRecord(Request, uDto, NEEnglishTermId);
                }
            }
            var msg = "invalid data structure submitted";
            return Request.CreateResponse(HttpStatusCode.BadRequest, msg);


        }



        private HttpResponseMessage ProcessNewEnglishTermRecord(HttpRequestMessage request, EnglishTermDTO uDto)
        {
            var ur = new EnglishTermRepository();

            //var EnglishTermRepository = new EnglishTermRepository();
            var EnglishTerm = new EnglishTerm();
            EnglishTerm.Term = uDto.Term;
            EnglishTerm.BeforeOrAfter = uDto.BeforeOrAfter;
            EnglishTerm = ur.Save(EnglishTerm);
            uDto.EnglishTermID = EnglishTerm.EnglishTermID.ToString();
            var response = request.CreateResponse(HttpStatusCode.Created, uDto);
            response.Headers.Location = new Uri(Url.Link("Default", new
            {
                id = EnglishTerm.EnglishTermID
            }));
            return response;
        }

        private HttpResponseMessage ProcessExistingEnglishTermRecord(HttpRequestMessage request, EnglishTermDTO cqDto, int contactId)
        {
            var ur = new EnglishTermRepository();
            //var EnglishTermRepository = new EnglishTermRepository();
            var EnglishTerm = new EnglishTerm();
            EnglishTerm = ur.GetById(contactId);
            //int? companyIdx = -1;
            //  is the EnglishTerm eligible to update the prospect?
            if (cqDto.Term != null)
            {
                EnglishTerm.Term = cqDto.Term;
            }
            if (cqDto.BeforeOrAfter != null)
            {
                EnglishTerm.BeforeOrAfter = cqDto.BeforeOrAfter;
            }
            ur.Save(EnglishTerm);
            return request.CreateResponse(HttpStatusCode.Accepted, cqDto);

        }




        private List<DbValidationError> GetValidationErrors(EnglishTermRepository pr, EnglishTerm contact, EnglishTermDTO cqDto, string companyId, int EnglishTermId)
        {
            contact.ProcessRecord(cqDto);
            return pr.Validate(contact);
        }


    }
}