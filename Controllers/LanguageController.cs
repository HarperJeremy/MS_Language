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
using System.Text;

namespace MS_Language.Controllers
{
    public class LanguageController : BaseApiController
    {
        internal HttpResponseMessage Languages(HttpRequestMessage request, LanguageDTO cqDTO)
        {
            
                var ur = new LanguageRepository();
                var u = new Language();
                var data = ur.GetLanguages();
                var col = new Collection<Dictionary<string, string>>();
                foreach (var item in data)
                {

                    var dic = new Dictionary<string, string>();
                    dic.Add("LanguageId", item.LanguageID.ToString());
                    dic.Add("LanguageName", item.LanguageName);
                    dic.Add("CSSFileName", item.CssFileName);
                    col.Add(dic);                   


                }

                var retVal = new GenericDTO
                {
               
                    ReturnData = col
                };
                return Request.CreateResponse(HttpStatusCode.OK, retVal);
           

        }

        internal HttpResponseMessage LanguageDetail(HttpRequestMessage request, LanguageDTO cqDTO)
        {

                var ur = new LanguageRepository();
                var u = new Language();
                var data = ur.GetById(int.Parse(cqDTO.LanguageID));
                var col = new Collection<Dictionary<string, string>>();


                
                    var dic = new Dictionary<string, string>();
                    dic.Add("LanguageId", data.LanguageID.ToString());
                    dic.Add("LanguageName", data.LanguageName);
                    dic.Add("CSSFileName", data.CssFileName);
                    col.Add(dic);
                

                var retVal = new GenericDTO
                {

                    ReturnData = col
                };
                return Request.CreateResponse(HttpStatusCode.OK, retVal);


        }

        internal HttpResponseMessage LanguageGenerateCSS(HttpRequestMessage request, LanguageDTO cqDTO)
        {

            var lr = new LanguageRepository();
            var er = new EnglishTermRepository();
            var tr = new TranslatedTermRepository();
            var lang = lr.GetById(int.Parse(cqDTO.LanguageID));
            string cssfilename = lang.CssFileName;
            var eTerms = er.GetEnglishTerms();
            var tTerms = tr.GetTranslatedTerms(int.Parse(cqDTO.LanguageID));
           
            string retVal = "";

            foreach (EnglishTerm eTerm in eTerms)
            {
                string trans = "";
                var tTerm = tTerms.Where(x => x.EnglishTermID == eTerm.EnglishTermID).FirstOrDefault();
                if (tTerm != null){
                    trans = tTerm.TermTranslated;
                }
                retVal += "[data-test='" + eTerm.Term + "']:" + eTerm.BeforeOrAfter + " { content: '" + trans + "';}" + Environment.NewLine;
            }
            var res = Request.CreateResponse(HttpStatusCode.OK);
            res.Content = new StringContent(retVal, Encoding.UTF8, "text/css");
            return res;


        }
        [HttpPost]
        public HttpResponseMessage LanguageGenerateCSS([FromBody] LanguageDTO cqDTO)
        {
            return LanguageGenerateCSS(Request, cqDTO);
        }

        [HttpPost]
        public HttpResponseMessage Languages([FromBody] LanguageDTO cqDTO)
        {
            return Languages(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage LanguageList([FromBody] LanguageDTO cqDTO)
        {
            return Languages(Request, cqDTO);
        }
        [HttpPost]
        public HttpResponseMessage LanguageDetail([FromBody] LanguageDTO cqDTO)
        {
            return LanguageDetail(Request, cqDTO);
        }

        [HttpPut]
        public HttpResponseMessage LanguageAddOrEdit([FromBody] LanguageDTO uDto)
        {


                var NELanguageId = 0;
                if (int.TryParse(uDto.LanguageID, out NELanguageId))
                {
                    if (NELanguageId == -1)
                    {
                        //  creating new Language record   
                        return ProcessNewLanguageRecord(Request, uDto);
                    }
                    else
                    {
                        //  editing existing Language record  
                        return ProcessExistingLanguageRecord(Request, uDto, NELanguageId);
                    }
                }
                var msg = "invalid data structure submitted";
                return Request.CreateResponse(HttpStatusCode.BadRequest, msg);


        }





        private HttpResponseMessage ProcessNewLanguageRecord(HttpRequestMessage request, LanguageDTO uDto)
        {
            var ur = new LanguageRepository();

            //var LanguageRepository = new LanguageRepository();
            var Language = new Language();
            Language.LanguageName = uDto.LanguageName;
            Language.CssFileName = uDto.CssFileName;
            Language = ur.Save(Language);            
            uDto.LanguageID = Language.LanguageID.ToString();
            var response = request.CreateResponse(HttpStatusCode.Created, uDto);
            response.Headers.Location = new Uri(Url.Link("Default", new
            {
                id = Language.LanguageID
            }));
            return response;
        }

        private HttpResponseMessage ProcessExistingLanguageRecord(HttpRequestMessage request, LanguageDTO cqDto, int contactId)
        {
            var ur = new LanguageRepository();
            //var LanguageRepository = new LanguageRepository();
            var Language = new Language();
            Language = ur.GetById(contactId);
            //int? companyIdx = -1;
            //  is the Language eligible to update the prospect?

            Language.CssFileName = cqDto.CssFileName;
            Language.LanguageName = cqDto.LanguageName;
            ur.Save(Language);
            return request.CreateResponse(HttpStatusCode.Accepted, cqDto);

        }




        private List<DbValidationError> GetValidationErrors(LanguageRepository pr, Language contact, LanguageDTO cqDto, string companyId, int LanguageId)
        {
            contact.ProcessRecord(cqDto);
            return pr.Validate(contact);
        }


    }
}