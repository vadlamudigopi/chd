using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
        

namespace CHD.Models
{
    public class ResidencySurveyModel
    {
        public List<HttpPostedFileBase> files { get; set; }
        public string completeFormData { get; set; }
        public string where { get; set; }

        public string fileUpload()
        {
            string fileDataString = "{";
            var CL = new commonLogic();
            try
            {
                var i = 0;
                foreach (HttpPostedFileBase file in files)
                {
                    //Checking file is available to save.  
                    if (file != null)
                    {
                        i++;
                        string newFileName = Path.GetFileNameWithoutExtension(file.FileName) + "_" + DateTime.Now.ToString("yyyyMMddhhmmss") + Path.GetExtension(file.FileName);
                        var path = Path.Combine(HttpContext.Current.Server.MapPath("~/upload"), newFileName);
                        file.SaveAs(path);

                        fileDataString += "File"+i+":'" + newFileName + "',";
                    }

                }
            }
            catch (Exception e)
            {
                CL.getLog("error uploading file ");
                fileDataString += "}";
                return fileDataString;
            }
            fileDataString += "}";
            return fileDataString;
        }
        public bool updateUniqueId(int newId)
        {
            var CL = new commonLogic();
            try
            {
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                string uniqueID = "RES" + DateTime.Now.ToString("hhmmss") + newId;
                sql = "UPDATE residency_survey SET unique_id = @unique_id WHERE id = @id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@unique_id", uniqueID);
                command.CommandType = CommandType.Text;
                command.ExecuteNonQuery();
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table" + e);
                return false;
            }
            return true;
        }
        public Boolean insert()
        {
            var CL = new commonLogic();
            SqlConnection cnn = CL.connect();
            SqlCommand command;
            String sql = "";
            string files = fileUpload();
            string id = HttpContext.Current.Session["id"].ToString();
            try
            {
                sql = "INSERT INTO residency_survey (user_id,form_data,files,added_date) OUTPUT INSERTED.ID VALUES";
                sql = sql + "(@user_id,@form_data,@files,GETDATE())";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@user_id", id);
                command.Parameters.AddWithValue("@form_data", completeFormData);
                command.Parameters.AddWithValue("@files", files);
                command.CommandType = CommandType.Text;
                int newId = Convert.ToInt32(command.ExecuteScalar());
                if (newId < 1)
                {
                    CL.getLog("Fail to insert");
                    return false;
                }
                bool uniqueIdUpdate = updateUniqueId(newId);
                if (uniqueIdUpdate == false)
                {
                    CL.getLog("Fail to update with unique id to Residency Survey table.");
                    return false;
                }
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("Fail to insert to Residency Survey " + e);
                return false;
            }
            return true;
        }
        public DataTable select()
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                //sql = "SELECT 'Adult Mental Health Services' as 'Name of Program',added_date as 'date of Review', 'Administrative Office' as 'Residence/Team','***ActionEmergencyModel***' as Action   FROM [chd].[dbo].[residency_survey]";
                sql = "SELECT unique_id, form_data as JSONArray,files FROM residency_survey ";
                if (where != "")
                    sql = sql + where;
                command = new SqlCommand(sql, cnn);
                dataReader = command.ExecuteReader();
                //dataReader.Close();
                if (dataReader.HasRows)
                {
                    dataTable.Load(dataReader);
                    return dataTable;
                }
                else
                {
                    return dataTable;  //No data
                }
            }
            catch (Exception e)
            {
                return dataTable;
            }
        }

        
    }
}