using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CHD.Models;
using System.Data;


namespace CHD.Controllers
{
    [SessionCheck]
    public class EmergencyController : Controller
    {
        public String getViewData(FormCollection form)
        {
            string uniqueID = form["uniqueID"];
            string html = "";
            var CL = new commonLogic();
            try
            {
                var EM = new EmergencyModels();

                DataTable emergencyLogData = EM.viewData(uniqueID);
                DataTable emergencyClientData = EM.GetEmergencyClientData(emergencyLogData.Rows[0]["id"].ToString());
                DataTable emergencyParticipantsData = EM.GetEmergencyParticipantsData(emergencyLogData.Rows[0]["id"].ToString());
                html += CL.buildEmergencyHTML(emergencyLogData, emergencyClientData, emergencyParticipantsData);
            }
            catch (Exception e)
            {
                CL.getLog("error while getting data for popip in resdential_drill_log " + e);
                return html;
            }
            return html;
        }
        // GET: Emergency
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult ProcedureChecklist()
        {
            return View();
        }
        public ActionResult DrillLogOfficesClinics()
        {
            var PM = new ProgramsModels();
            string dropdown = PM.GetProgramList("N");
            ViewBag.dropdown = dropdown;
            return View();
        }
        [HttpPost]
        public ActionResult DrillLogOfficesClinics(EmergencyModels EM)
        {            
            Boolean status = EM.insert();
            if(status)
                return RedirectToAction("SurveyList", "Emergency", new { msg = 4 }); 
            else
                return RedirectToAction("SurveyList", "Emergency", new { msg = 5 }); 
        }
        public ActionResult viewDetails(string id)
        {

            return View();
        }
        public ActionResult SurveyList()
        {            
            var emergencyObj = new EmergencyModels();
            var CL = new commonLogic();
            CL.dataTable = emergencyObj.select();
            CL.tableId = "emergencyDrill";
            ViewBag.htmldata = CL.buildGridView();
            return View();
        }
    }
}