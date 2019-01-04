using System.Web.Mvc;
using System.Web.Routing;

namespace CHD.App_Start
{
    public class RouteConfig
    {
        public static void Configure(RouteCollection routes)
        {
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "User", action = "Login", id = UrlParameter.Optional }
            );
        }
    }
}