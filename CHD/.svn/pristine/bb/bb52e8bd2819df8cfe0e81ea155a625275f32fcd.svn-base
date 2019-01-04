using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace CHD.Models
{
    public class ProgramsModels
    {
        public string Division { get; set; }
        public string ProgramName { get; set; }
        public string ProgramAddress { get; set; }
        public string TeamResidenceLocation { get; set; }
        public string Address { get; set; }
        public string LicensingBodyFunding { get; set; }
        public string CARF { get; set; }
        public string ResidentialProgram { get; set; }
        public string ProgramParticipantsInvolved { get; set; }
        public string ECEvcuate { get; set; }
        public string SCAccounted { get; set; }



        public string GetProgramList(string residential)
        {
            SqlDataReader dataReader = null;
            DataTable dataTable = new DataTable();
            string html = "";
            string condition = "1";
            try
            {
                if (residential != "")
                {
                    condition = " residential_program = '" + residential + "'";
                }
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select DISTINCT program_name FROM programs WHERE "+condition;
                command = new SqlCommand(sql, cnn);
                dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {

                    dataTable.Load(dataReader);
                    CL.ddData = dataTable;
                    CL.val = "program_name";
                    CL.text = "program_name";
                    CL.selectedVal = "";
                    html = CL.createDropDown();
                    return html;
                }
                else
                {
                    return html;  //No data
                }
            }
            catch (Exception e)
            {
                return html;
            }
        }

        public List<string> GetLocationsList(String ProgramName, string drillType)
        {
            List<string> locationList = new List<string>();
            SqlDataReader dataReader = null;
            string condition = "program_name=@program_name";
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                if (drillType != "" && drillType == "Residential")
                {
                    condition += " AND residential_program = 'Y'";
                }
                if (drillType != "" && drillType == "Non-Residential")
                {
                    condition += " AND residential_program = 'N'";
                }
                sql = "select DISTINCT team_residence_location FROM programs where "+condition;
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@program_name", ProgramName);
                dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        locationList.Add(dataReader["team_residence_location"].ToString());
                    }
                    return locationList;
                }
                else
                {
                    return locationList;  //No data
                }
            }
            catch (Exception e)
            {
                return locationList;
            }
        }


        public List<KeyValuePair<string, string>> GetFullDetails(String ProgramAddress, String ProgramName, String Address)
        {
            List<KeyValuePair<string, string>> addressList = new List<KeyValuePair<string, string>>();
            SqlDataReader dataReader = null;
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select DISTINCT ID,division, licensing_body_funding, address, carf,residential_program FROM programs where program_name=@program_name and team_residence_location=@team_residence_location and address=@address";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@program_name", ProgramName);
                command.Parameters.AddWithValue("@team_residence_location", Address);
                command.Parameters.AddWithValue("@address", ProgramAddress);
                dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        addressList.Add(new KeyValuePair<string, string>("Licensing Body", dataReader["licensing_body_funding"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("Address", dataReader["address"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("Division", dataReader["division"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("CARF", dataReader["carf"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("ResidentialProgram", dataReader["residential_program"].ToString()));
                    }
                    return addressList;
                }
                else
                {
                    return addressList;  //No data
                }
            }
            catch (Exception e)
            {
                return addressList;
            }
        }

        public List<KeyValuePair<string, string>> GetAddressList(String Location, String ProgramName)
        {
            List<KeyValuePair<string, string>> addressList = new List<KeyValuePair<string, string>>();
            SqlDataReader dataReader = null;
            try
            {
                var CL = new commonLogic();
                SqlConnection cnn = CL.connect();
                SqlCommand command;
                String sql = "";
                sql = "select DISTINCT ID,division, licensing_body_funding, address, residential_program FROM programs where program_name=@program_name and team_residence_location=@team_residence_location";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@program_name", ProgramName);
                command.Parameters.AddWithValue("@team_residence_location", Location);
                dataReader = command.ExecuteReader();
                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        addressList.Add(new KeyValuePair<string, string>("Licensing Body", dataReader["licensing_body_funding"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("Address", dataReader["address"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("Division", dataReader["division"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("CARF", dataReader["carf"].ToString()));
                        addressList.Add(new KeyValuePair<string, string>("ResidentialProgram", dataReader["residential_program"].ToString()));
                    }
                    return addressList;
                }
                else
                {
                    return addressList;  //No data
                }
            }
            catch (Exception e)
            {
                return addressList;
            }
        }
    }
}