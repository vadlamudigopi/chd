using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;

namespace CHD.Models
{
    public class EmergencyModels
    {
        public string NameofProgram { get; set; }
        public string Location { get; set; }
        public string ProgramAddress { get; set; }
        public string DrillDate { get; set; }
        public string TimeCompleted { get; set; }
        public string TimeStarted { get; set; }
        public string TableTopDrill { get; set; }
        public string PersonConducted { get; set; }
        public string[] TypeOfDrill { get; set; }
        public string ProgramParticipantsInvolved { get; set; }
        public string ECEvcuate { get; set; }
        public string SCAccounted { get; set; }
        public string PeopleLeft { get; set; }
        public string EmergencyDisaster { get; set; }
        public string PPEnhanceSafety { get; set; }
        public string ReportCompletedName { get; set; }
        public string CompletedDate { get; set; }
        public string ImprovementDate { get; set; }
        public string[] ParticipantName { get; set; }
        public string[] ParticipantTitle { get; set; }
        public string[] ClientName { get; set; }
        public string[] EvacuationTime { get; set; }
        public string[] PromptLevel { get; set; }
        public string[] Comments { get; set; }
        public HttpPostedFileBase uploadSurvey { get; set; }
        public string reportForQuanterEnding { get; set; }
        public string Durationofdrill { get; set; }
        public string Evacuation { get; set; }
        public string DurationofdrillMinutes { get; set; }
        public string DurationofdrillSeconds { get; set; }

        public EmergencyModels()
        {

        }
        public DataTable GetEmergencyParticipantsData(string id)
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select * FROM emergency_drill_participants WHERE emergency_drill_log_id = @emergency_drill_log_id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@emergency_drill_log_id", id);
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
        public DataTable GetEmergencyClientData(string id)
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select * FROM emergency_drill_clients WHERE emergency_drill_log_id = @emergency_drill_log_id";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@emergency_drill_log_id", id);
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
        public DataTable viewData(string uniqueId)
        {
            SqlDataReader dataReader = null;
            var dataTable = new DataTable();
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select * FROM emergency_drill_log WHERE unique_id = @uniqueID";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@uniqueID", uniqueId);
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
                sql = "select distinct unique_id as 'Unique ID',name_of_program as 'Program Name',program_location as 'Team Or Residence',site_address as 'Location',licensing_body_funding as 'Licensing Body',carf as CARF,evacuation as 'Drill category',type_of_drill as 'Drill Type',drill_date as 'Drill Date',drill_status as 'Drill Status',drill_shift as 'Shift',first_name as 'First Name',last_name as 'Last Name','***ActionEmergencyModel***' as Action FROM emergency_drill_log LEFT JOIN programs ON programs.program_name = name_of_program AND programs.team_residence_location = program_location AND programs.address = site_address LEFT JOIN users ON users.id=user_id";
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
        public bool updateUniqueId(int newId)
        {
            var CL = new commonLogic();
            try
            {                
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                string uniqueID = "DLOC" + DateTime.Now.ToString("hhmmss") + newId;
                sql = "UPDATE emergency_drill_log SET unique_id = @unique_id WHERE id = @id";
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
            string uploadFileName = uploadFile();
            string id = HttpContext.Current.Session["id"].ToString();
            try
            {
                Durationofdrill = CL.setDurationOfDrill(DurationofdrillMinutes, DurationofdrillSeconds);
                string DrillType = string.Join(",", TypeOfDrill);
                string drillStatus = CL.GetDrillStatus(reportForQuanterEnding, DrillDate, DrillType, Durationofdrill);
                string drillShift = "1";//As it is non-residential, it always be shift 1.
                sql = "INSERT INTO emergency_drill_log (user_id,evacuation,duration_of_drill,drill_status,report_for_quarter_ending,drill_shift,site_address,name_of_program,program_location,drill_date,time_started,time_completed,table_top_drill,person_conducted,type_of_drill,program_participants_involved,ec_evcuate,sc_accounted,people_left,emergency_disaster,pp_enhance_safety,report_completed_name,completed_date,improvement_date,upload_survey,added_date) OUTPUT INSERTED.ID VALUES";
                sql = sql + "(@user_id,@evacuation,@Durationofdrill,@drillStatus,@reportForQuanterEnding,@drillShift,@site_address,@NameofProgram,@Location,@drill_date,@time_started,@time_completed,@table_top_drill,@person_conducted,@type_of_drill,@program_participants_involved,@ec_evcuate,@sc_accounted,@people_left,@emergency_disaster,@pp_enhance_safety,@report_completed_name,@completed_date,@improvement_date,@upload_survey,GETDATE())";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@user_id", id);
                command.Parameters.AddWithValue("@evacuation", Evacuation);
                if (Durationofdrill == null)
                {
                    command.Parameters.AddWithValue("@Durationofdrill", DBNull.Value);
                }
                else
                {
                    command.Parameters.AddWithValue("@Durationofdrill", Durationofdrill);
                }
                
                command.Parameters.AddWithValue("@drillStatus", drillStatus);
                command.Parameters.AddWithValue("@reportForQuanterEnding", DBNull.Value);
                command.Parameters.AddWithValue("@drillShift", drillShift);
                command.Parameters.AddWithValue("@site_address", ProgramAddress);
                command.Parameters.AddWithValue("@NameofProgram", NameofProgram);
                command.Parameters.AddWithValue("@Location", Location);
                command.Parameters.AddWithValue("@drill_date", DrillDate);
                command.Parameters.AddWithValue("@time_started", DBNull.Value);
                command.Parameters.AddWithValue("@time_completed", DBNull.Value);
                command.Parameters.AddWithValue("@table_top_drill", DBNull.Value);
                command.Parameters.AddWithValue("@person_conducted", PersonConducted);
                command.Parameters.AddWithValue("@type_of_drill", DrillType);
                command.Parameters.AddWithValue("@program_participants_involved", ProgramParticipantsInvolved);
                command.Parameters.AddWithValue("@ec_evcuate", ECEvcuate);
                command.Parameters.AddWithValue("@sc_accounted", SCAccounted);
                command.Parameters.AddWithValue("@people_left", PeopleLeft);
                command.Parameters.AddWithValue("@emergency_disaster", EmergencyDisaster);
                command.Parameters.AddWithValue("@pp_enhance_safety", PPEnhanceSafety);
                command.Parameters.AddWithValue("@report_completed_name", ReportCompletedName);
                command.Parameters.AddWithValue("@completed_date", CompletedDate);
                command.Parameters.AddWithValue("@improvement_date", ImprovementDate);
                command.Parameters.AddWithValue("@upload_survey", uploadFileName);
                command.CommandType = CommandType.Text;
                int newId = Convert.ToInt32(command.ExecuteScalar());
                if (newId < 1)
                {
                    CL.getLog("Fail to insert");
                    return false;
                }
                cnn.Close();
                bool EDparticipant = emergencyDrillParticipants(newId);
                bool EDClients = true;
                if (ProgramParticipantsInvolved == "YES")
                {
                    EDClients = emergencyDrillClients(newId);
                }
                bool uniqueIdUpdate = updateUniqueId(newId);
                if (EDClients == false || EDparticipant == false || uniqueIdUpdate == false)
                {
                    CL.getLog("Fail to insert to other tables.");
                    return false;
                }
            }
            catch (Exception e)
            {
                CL.getLog("Fail to insert to emergency_drill_log " + Location +"<++>"+ NameofProgram +"<++>"+ ProgramAddress +"<++>"+ Durationofdrill +"<++>"+  reportForQuanterEnding+ "<++>"+ e);
                return false;
            }
            return true;
        }
        public bool emergencyDrillParticipants(int newId)
        {
            var CL = new commonLogic();
            try
            {                
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                for (int loop = 0; loop < ParticipantName.Length; loop++)
                {
                    sql = "INSERT INTO emergency_drill_participants (emergency_drill_log_id,participant_name,participant_title,added_date) VALUES (@emergency_drill_log_id,@ParticipantName,@ParticipantTitle,GETDATE())";
                    command = new SqlCommand(sql, cnn);
                    command.Parameters.AddWithValue("@emergency_drill_log_id", newId);
                    command.Parameters.AddWithValue("@ParticipantName", ParticipantName[loop]);
                    command.Parameters.AddWithValue("@ParticipantTitle", ParticipantTitle[loop]);
                    command.CommandType = CommandType.Text;
                    command.ExecuteNonQuery();
                }
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("error while adding data to emergencyDrillParticipants table" + e);
                return false;
            }
            return true;
        }
        public bool emergencyDrillClients(int newId)
        {
            var CL = new commonLogic();
            try
            {                
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                string sql;
                for (int loop = 0; loop < ClientName.Length; loop++)
                {
                    sql = "INSERT INTO emergency_drill_clients (emergency_drill_log_id,client_name,evacuation_time,prompt_level,comments,updated_date,added_date) VALUES ";
                    sql = sql + " (@emergency_drill_log_id,@ClientName,@EvacuationTime,@PromptLevel,@Comments,@updatedDate,GETDATE())";
                    command = new SqlCommand(sql, cnn);
                    command.Parameters.AddWithValue("@emergency_drill_log_id", newId);
                    command.Parameters.AddWithValue("@ClientName", ClientName[loop]);
                    command.Parameters.AddWithValue("@EvacuationTime", EvacuationTime[loop]);
                    command.Parameters.AddWithValue("@PromptLevel", PromptLevel[loop]);
                    command.Parameters.AddWithValue("@Comments", Comments[loop]);
                    command.Parameters.AddWithValue("@updatedDate", DBNull.Value);
                    command.CommandType = CommandType.Text;
                    command.ExecuteNonQuery();                    
                }
                cnn.Close();
            }
            catch (Exception e)
            {
                CL.getLog("error while adding data to emergency_drill_clients table" + e);
                return false;
            }
            return true;
        }        
    }
}