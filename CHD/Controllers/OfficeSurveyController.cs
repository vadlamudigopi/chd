﻿using CHD.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHD.Controllers
{
    [SessionCheck]
    public class OfficeSurveyController : Controller
    {
        // GET: OfficeSurvey
        public ActionResult Index()
        {
            try
            {
                var PM = new ProgramsModels();
                string dropdown = PM.GetProgramList("N");
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
                
                var OS = new OfficeSurveyModel();
                var CL = new commonLogic();
                OS.where = " WHERE unique_id = '" + uniqueID+"'";
                CL.dataTable = OS.select();
                html = CL.ViewHtml();
            }
            catch (Exception e)
            {
                return html;
            }
            return html;
        }
        [HttpPost]
        public ActionResult index(OfficeSurveyModel OS)
        {
            Boolean status;
            try
            {
                status = OS.insert();
            }
            catch (Exception e)
            {
                status = false;
            }
            if (status)
                return RedirectToAction("list", "OfficeSurvey", new { msg = 10 });
            else
                return RedirectToAction("list", "OfficeSurvey", new { msg = 11 });
        }
        public ActionResult list()
        {
            try
            {
                var OS = new OfficeSurveyModel();
                var CL = new commonLogic();
                CL.dataTable = OS.select();
                CL.tableId = "officeSurveyList";
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