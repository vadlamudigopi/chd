using CHD.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CHD.Controllers
{
    public class UserController : Controller
    {
        // GET: User
        public ActionResult Index()
        {
            
            return View();
        }
        public string checkChangePasswordMessages()
        {
            string message = "";
            Uri myUri = new Uri(Request.Url.AbsoluteUri);
            string msgId = HttpUtility.ParseQueryString(myUri.Query).Get("msg");
            if (msgId == "12")
                message = "<span style='color:green;'>You have successfully updated your password</span>";
            else if (msgId == "15")
                message = "Password mismatch!!!";
            else if (msgId == "13")
                message = "Your old password is wrong";
            else if (msgId == "14")
                message = "Something went wrong! Please try again later!!";
            return message;
        }

        public ActionResult ChangePassword()
        {
            ViewBag.message = checkChangePasswordMessages();
            return View();
        }
        [HttpPost]
        public ActionResult ChangePassword(UserModel user)
        {
            bool status = user.checkUser();
            if (status)
            {
                if (user.NewPassword == user.CnfPassword)
                {
                    bool sta = user.updatePassword(Session["email"].ToString());
                    if (sta)
                    {
                        return RedirectToAction("ChangePassword", "User", new { msg = 12 });
                    }
                    else
                    {
                        return RedirectToAction("ChangePassword", "User", new { msg = 14 });
                    }
                }
                else
                {
                    return RedirectToAction("ChangePassword", "User", new { msg = 15 });
                }                
            }
            else
            {
                return RedirectToAction("ChangePassword", "User", new { msg = 13 });
            }
        }

        public ActionResult ForgotPassword()
        {
            ViewBag.message = checkMessages();
            return View();
        }

        [HttpGet]
        public ActionResult Reset(UserModel user)
        {
            Uri myUri = new Uri(Request.Url.AbsoluteUri);
            string verification_code = HttpUtility.ParseQueryString(myUri.Query).Get("verifyme");

            bool status = user.checkVerificationCode(verification_code);
            if (status)
            {
                return RedirectToAction("ResetPassword", "User");
            }
            return RedirectToAction("Oops", "User");
        }
        public ActionResult ResetPassword()
        {
            Uri myUri = new Uri(Request.Url.AbsoluteUri);
            ViewBag.message = HttpUtility.ParseQueryString(myUri.Query).Get("msg");
            return View();
        }

        [HttpPost]
        public ActionResult ResetPassword(UserModel user)
        {
            if (user.Password == user.CnfPassword)
            {
                bool status = user.updatePassword(Session["email"].ToString());
                if (status)
                {
                    return RedirectToAction("index", "ResidentialDrill", new { msg = 1 });
                }
                else
                {
                    return RedirectToAction("ResetPassword", "User", new { msg = "Something went wrong!" });
                }
            }
            return RedirectToAction("ResetPassword", "User", new { msg = "Password Mismatch!" });
        }

        [HttpPost]
        public ActionResult ForgotPassword(UserModel user)
        {
            if (user.Email != null)
            {
                bool status = user.checkEmail();
                if (status)
                {
                    return RedirectToAction("ForgotPassword", "User", new { msg = 1 });  
                }
                else
                {
                    return RedirectToAction("ForgotPassword", "User", new { msg = 2 });
                }
            }
            return RedirectToAction("ForgotPassword", "User", new { msg = 3 });
        }
        public string checkMessages()
        {
            string message = "";
            Uri myUri = new Uri(Request.Url.AbsoluteUri);
            string msgId = HttpUtility.ParseQueryString(myUri.Query).Get("msg");
            if (msgId == "1")
                message = "<span style='color:green;'>Reset password link has been sent to your email, Please check your email</span>";
            else if (msgId == "2")
                message = "Email Id is not registered with CHD!!!";
            else if (msgId == "3")
                message = "Please enter registered Email Id";
            return message;
        }
        public ActionResult Login()
        {
            ViewBag.message = getMessages();
            return View();
        }
        public string getMessages()
        {
            string message = "";
            Uri myUri = new Uri(Request.Url.AbsoluteUri);
            string msgId = HttpUtility.ParseQueryString(myUri.Query).Get("msg");
            if (msgId == "2")
                message = "Email Id or password is wrong. Pleae try again later!!!";
            else if (msgId == "3")
                message = "Please enter Email Id or password.";
            return message;
        }
        [HttpPost]
        public ActionResult Login(UserModel user)
        {
            if (user.Email != null && user.Password != null)
            {
                bool status = user.checkUser();
                if (status)
                {
                    return RedirectToAction("list", "ResidenceSurvey", new { msg = 1 });  //ResidentialDrill index  //ResidenceSurvey  list //OfficeSurvey
                }
                else
                {
                    return RedirectToAction("Login", "User", new { msg = 2 });
                }
            }
            return RedirectToAction("Login", "User", new { msg = 3 });

        }
        public ActionResult Logout(string msg)
        {
            Session["UserName"] = null;
            Session.Abandon();
            Session.Clear();
            return RedirectToAction("Login", "User");
        }

        public ActionResult Oops()
        {
            return View();
        }
        public void getLog(string msg)
        {
            msg = msg.Replace("\"", "\\\""); //escpaing double quotes
            string query = "insert into LOG4NETLOG (DATE,THREAD,LEVEL,LOGGER,MESSAGE,EXCEPTION) values(current_timestamp,'CHD App','INFO','APP','" + msg + "','-')";
            SqlCommand command;
            SqlDataReader dataReader;
            var DB = connect();
            command = new SqlCommand(query, DB);
            dataReader = command.ExecuteReader();
            dataReader.Close();
            command.Dispose();
        }
        public SqlConnection connect()
        {
            SqlConnection cnn;
            string cs = System.Configuration.ConfigurationManager.ConnectionStrings["ConnectionString"].ConnectionString;
            cnn = new SqlConnection(cs);
            cnn.Open();
            return cnn;
        }
        public ActionResult test()
        {
            getLog("ssss");
            return View("Login");
        }
    }
}