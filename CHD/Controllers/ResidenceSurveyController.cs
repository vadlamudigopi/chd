using CHD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CHD.Controllers
{
    [SessionCheck]
    public class ResidenceSurveyController : Controller
    {
        // GET: ResidenceSurvey
        public ActionResult Index()
        {
            try
            {
                var PM = new ProgramsModels();
                string dropdown = PM.GetProgramList("Y");
                ViewBag.dropdown = dropdown;
            }
            catch (Exception e)
            {
                return View();
            }
            return View();
        }
        [HttpPost]
        public string view(string uniqueID)
        {
            string html = string.Empty;
            try
            {

                var RS = new ResidencySurveyModel();
                var CL = new commonLogic();
                RS.where = " WHERE unique_id = '" + uniqueID + "'";
                CL.dataTable = RS.select();
                html = CL.ViewHtml();
            }
            catch (Exception e)
            {
                return html;
            }
            return html;
        }
        [HttpPost]
        public ActionResult index(ResidencySurveyModel RS)
        {
            Boolean status;
            try
            {
                status = RS.insert();
            }
            catch (Exception e)
            {
                status = false;
            }
            if (status)
                return RedirectToAction("list", "ResidenceSurvey", new { msg = 8 });
            else
                return RedirectToAction("list", "ResidenceSurvey", new { msg = 9 }); 
        }
        public ActionResult list()
        {
            try
            {
                var RS = new ResidencySurveyModel();
                var CL = new commonLogic();
                CL.dataTable = RS.select();
                CL.tableId = "residencySurveyList";
                ViewBag.htmldata = CL.residenceSurveyGridView();
            }
            catch (Exception e)
            {
                return View();
            }
            return View();
        }
    }


}