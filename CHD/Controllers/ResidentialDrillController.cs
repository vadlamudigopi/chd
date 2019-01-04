using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CHD.Models;
using System.Data;
using System.Data.SqlClient;
using System.Web.Script.Serialization;
using System.Collections;

namespace CHD.Controllers
{
    [SessionCheck]
    public class ResidentialDrillController : Controller
    {
        public ActionResult Index()
        {
            var RDObj = new ResidentialDrillModel();
            var CL = new commonLogic();
            CL.dataTable = RDObj.select();
            CL.tableId = "residentialsDrill";
            ViewBag.htmldata = CL.buildGridView();
            return View();
        }
        [HttpPost]
        public String getViewData(FormCollection form)
        {
            string uniqueID = form["uniqueID"];
            string html = "";
            var CL = new commonLogic();
            try
            {
                var RM = new ResidentialDrillModel();
                DataTable residentialData = RM.GetResidentialData(uniqueID);
                //DataTable residentialClientData = RM.GetResidentialClientData(residentialData.Rows[0]["id"].ToString());                
                html += CL.buildResidentialHTML(residentialData);
            }
            catch (Exception e)
            {
                CL.getLog("error while getting data for popip in resdential_drill_log " + e);
                return html;
            }
            return html;
        }
        public ActionResult DrillLog()
        {
            var PM = new ProgramsModels();
            string dropdown = PM.GetProgramList("Y");
            ViewBag.dropdown = dropdown;
            return View();
        }
        [HttpPost]
        public ActionResult DrillLog(ResidentialDrillModel RD)
        {
            Boolean status = RD.insert();
            if (status)
                return RedirectToAction("Index", "ResidentialDrill", new { msg = 6 });
            else
                return RedirectToAction("Index", "ResidentialDrill", new { msg = 7 }); 
        }

        [HttpPost]
        public ActionResult GetLocations(String ProgramName, string drillType)
        {
            var locationList = new ProgramsModels().GetLocationsList(ProgramName, drillType);
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            string result = javaScriptSerializer.Serialize(locationList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult GetAddress(String Location, String ProgramName)
        {
            var locationList = new ProgramsModels().GetAddressList(Location, ProgramName);
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            string result = javaScriptSerializer.Serialize(locationList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetFullDetails(String ProgramAddress, String ProgramName, String Address)
        {
            var locationList = new ProgramsModels().GetFullDetails(ProgramAddress, ProgramName, Address);
            JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();
            string result = javaScriptSerializer.Serialize(locationList);
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}