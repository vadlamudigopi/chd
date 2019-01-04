using System.Web.Mvc;
using System.Data.SqlClient;

namespace CHD.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {

            return View();
        }        
    }
}