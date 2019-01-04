using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Web;

namespace CHD.Models
{
    public class ResidentialDrillModel
    {
        public string[] TypeOfDrill { get; set; }
        public string Evacuation { get; set; }
        public string NameofProgram { get; set; }
        public string ProgramAddress { get; set; }
        public string Location { get; set; }

        public string DateTimeofDrill { get; set; }
        public string StaffRatio { get; set; }
        public string DrillWasDuring { get; set; }
        public string NameofStaff { get; set; }

        public string[] ClientName { get; set; }
        public string[] PresentForDrill { get; set; }
        public string[] TimeToExit { get; set; }
        public string[] ClientClassification { get; set; }
        public string[] PromptLevel { get; set; }

        public string DurationofdrillMinutes { get; set; }
        public string DurationofdrillSeconds { get; set; }
        public string Durationofdrill { get; set; }
        public string DrillScenario { get; set; }
        public string BuildingExit { get; set; }
        public string EgressWasBlocked { get; set; }

        public string SecondaryLocation { get; set; }

        public string StaffSignature { get; set; }
        public string StaffSignatureDate { get; set; }
        public string SupervisorSignature { get; set; }
        public string SupervisorSignatureDate { get; set; }
        public HttpPostedFileBase uploadSurvey { get; set; }
        public string reportForQuanterEnding { get; set; }
        public DataTable GetResidentialClientData(string id)
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select * FROM resdential_drill_clients where residential_drill_id = @residential_drill_id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@residential_drill_id", id);
                dataReader = command.ExecuteReader();
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
        public string uploadFile()
        {
            string newFileName = "";
            var CL = new commonLogic();
            try
            {
                if (uploadSurvey != null && uploadSurvey.ContentLength > 0)
                {
                    // extract only the filename
                    newFileName = Path.GetFileNameWithoutExtension(uploadSurvey.FileName) + "_" + DateTime.Now.ToString("yyyyMMddhhmmss") + Path.GetExtension(uploadSurvey.FileName);
                    var path = Path.Combine(HttpContext.Current.Server.MapPath("~/upload"), newFileName);
                    uploadSurvey.SaveAs(path);
                }
            }
            catch (Exception e)
            {
                CL.getLog("error uploading file ");
                return newFileName;
            }
            return newFileName;

        }
        public DataTable GetResidentialData(string uniqueID)
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select * FROM resdential_drill_log where unique_id = @unique_id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@unique_id", uniqueID);
                dataReader = command.ExecuteReader();
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
                sql = "select distinct unique_id as 'Unique ID',name_of_program as 'Program Name',program_location as 'Team Or Residence',program_address as 'Location',licensing_body_funding as 'Licensing Body',carf as CARF,evacuation as 'Drill category',type_of_drill as 'Drill Type',date_time_of_drill as 'Drill Date',drill_status as 'Drill Status',drill_shift as 'Shift',staff_ratio as 'Ratio',first_name as 'First Name',last_name as 'Last Name','***ActionResidentialDrillLog***' as Action FROM resdential_drill_log LEFT JOIN programs ON programs.program_name = name_of_program AND programs.team_residence_location = program_location AND programs.address = program_address LEFT JOIN users ON users.id=user_id";
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
        internal bool insert()
        {
            string sql = "";
            SqlCommand command;
            var CL = new commonLogic();
            SqlConnection cnn = CL.connect();
            string id = HttpContext.Current.Session["id"].ToString();
            try
            {
                string uploadFileName = uploadFile();                
                string DrillType = string.Join(",", TypeOfDrill);
                Durationofdrill = CL.setDurationOfDrill(DurationofdrillMinutes, DurationofdrillSeconds);
                string drillStatus = CL.GetDrillStatus(reportForQuanterEnding, DateTimeofDrill, DrillType, Durationofdrill);
                string drillShift = CL.GetDrillShift(DateTimeofDrill);
                sql = "INSERT INTO resdential_drill_log(user_id,program_address,program_location,drill_shift,report_for_quarter_ending,drill_status,type_of_drill,evacuation,name_of_program,date_time_of_drill,staff_ratio,duration_of_drill,drill_scenario,building_exit,egress_was_blocked,secondary_location,staff_signature,staff_signature_date,supervisor_signature,supervisor_signature_date,added_date,drill_was_during,name_of_staff,upload_survey) ";
                sql += " OUTPUT INSERTED.ID VALUES(@user_id,@ProgramAddress,@ProgramLocation,@drillShift,@reportForQuanterEnding,@DrillStatus,@TypeOfDrill,@Evacuation,@NameofProgram,@DateTimeofDrill, @StaffRatio, @Durationofdrill,@DrillScenario, @BuildingExit,@EgressWasBlocked, @SecondaryLocation,@StaffSignature, @StaffSignatureDate,@SupervisorSignature,@SupervisorSignatureDate,GETDATE(),@DrillWasDuring,@NameofStaff,@upload_survey) ";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@user_id", id);
                command.Parameters.AddWithValue("@ProgramAddress", ProgramAddress);
                command.Parameters.AddWithValue("@ProgramLocation", Location);
                command.Parameters.AddWithValue("@drillShift", drillShift);
                command.Parameters.AddWithValue("@reportForQuanterEnding", DBNull.Value);
                command.Parameters.AddWithValue("@DrillStatus", drillStatus);
                command.Parameters.AddWithValue("@TypeOfDrill", DrillType);
                command.Parameters.AddWithValue("@Evacuation", Evacuation);
                command.Parameters.AddWithValue("@NameofProgram", NameofProgram);
                command.Parameters.AddWithValue("@DateTimeofDrill", DateTimeofDrill);
                command.Parameters.AddWithValue("@StaffRatio", StaffRatio);
                if (Durationofdrill == null)
                {
                    command.Parameters.AddWithValue("@Durationofdrill", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@Durationofdrill", Durationofdrill);
                }
                
                command.Parameters.AddWithValue("@DrillScenario", DrillScenario);
                command.Parameters.AddWithValue("@BuildingExit", BuildingExit);
                command.Parameters.AddWithValue("@EgressWasBlocked", EgressWasBlocked);
                command.Parameters.AddWithValue("@SecondaryLocation", SecondaryLocation);
                command.Parameters.AddWithValue("@StaffSignature", StaffSignature);
                command.Parameters.AddWithValue("@StaffSignatureDate", StaffSignatureDate);
                command.Parameters.AddWithValue("@SupervisorSignature", SupervisorSignature);
                command.Parameters.AddWithValue("@SupervisorSignatureDate", SupervisorSignatureDate);
                command.Parameters.AddWithValue("@DrillWasDuring", DrillWasDuring);
                command.Parameters.AddWithValue("@NameofStaff", NameofStaff);
                command.Parameters.AddWithValue("@upload_survey", uploadFileName);
                command.CommandType = CommandType.Text;
                int newId = Convert.ToInt32(command.ExecuteScalar());
                if (newId < 1)
                {
                    CL.getLog("Fail to insert");
                    return false;
                }
                bool RDclient = true;//ResidentialDrillClients(newId);
                bool RDUniqueID = updateUniqueId(newId);
                if (RDclient == false ||  RDUniqueID == false)
                {
                    CL.getLog("Fail to insert and update other tables");
                    return false;
                }
                cnn.Close();
                return true;
            }
            catch (Exception e)
            {
                CL.getLog("error while inserting records in resdential_drill_log " + e);
                cnn.Close();
                return false;
            }
        }

 
        public bool ResidentialDrillClients(int newId)
        {
            var CL = new commonLogic();
            try
            {
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                for (int loop = 0; loop < ClientName.Length; loop++)
                {
                    if (ClientName[loop] != "")
                    {
                        sql = "INSERT INTO resdential_drill_clients (residential_drill_id,client_name,present_for_drill,time_to_exit,client_classification,prompt_level,added_date) VALUES (@residential_drill_id,@client_name,@present_for_drill,@time_to_exit,@client_classification,@prompt_level,GETDATE())";
                        command = new SqlCommand(sql, cnn);
                        command.Parameters.AddWithValue("@residential_drill_id", newId);
                        command.Parameters.AddWithValue("@client_name", ClientName[loop]);
                        command.Parameters.AddWithValue("@present_for_drill", PresentForDrill[loop]);
                        command.Parameters.AddWithValue("@time_to_exit", TimeToExit[loop]);
                        command.Parameters.AddWithValue("@client_classification", ClientClassification[loop]);
                        command.Parameters.AddWithValue("@prompt_level", PromptLevel[loop]);
                        command.CommandType = CommandType.Text;
                        command.ExecuteNonQuery();
                    }
                }
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("error while adding data to resdential_drill_clients table" + e);
                return false;
            }
            return true;
        }
        public bool updateUniqueId(int newId)
        {
            var CL = new commonLogic();
            try
            {
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                string uniqueID = "RDL" + DateTime.Now.ToString("hhmmss") + newId;
                sql = "UPDATE resdential_drill_log SET unique_id = @unique_id WHERE id = @id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@unique_id", uniqueID);
                command.CommandType = CommandType.Text;
                command.ExecuteNonQuery();
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table resdential_drill_log " + e);
                return false;
            }
            return true;
        }
    }
}