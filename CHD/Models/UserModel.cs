using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Helpers;

namespace CHD.Models
{
    public class UserModel
    {
        public string Email { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string Password { get; set; }
        public string CnfPassword { get; set; }
        public string NewPassword { get; set; }


        public string hassPassword(string UserPassword)
        {
            byte[] data = System.Text.Encoding.ASCII.GetBytes(UserPassword);
            data = new System.Security.Cryptography.SHA256Managed().ComputeHash(data);
            string hash = System.Text.Encoding.ASCII.GetString(data);
            return hash;
        }
        public bool checkUser()
        {
            bool status = false;
            var CL = new commonLogic();
            SqlConnection cnn = CL.connect();
            try
            {
                SqlCommand command;
                string sql;
                Password = hassPassword(Password);
                sql = "SELECT * FROM users WHERE email = @email AND password = @password";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@email", Email);
                command.Parameters.AddWithValue("@password", Password);
                SqlDataReader dataReader = command.ExecuteReader();

                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        HttpContext.Current.Session["id"] = dataReader["id"].ToString();
                        HttpContext.Current.Session["email"] = dataReader["email"].ToString();
                        HttpContext.Current.Session["first_name"] = dataReader["first_name"].ToString();
                        HttpContext.Current.Session["last_name"] = dataReader["last_name"].ToString();
                        break;
                    }
                    status = true;
                }
                else
                {
                    status = false;
                }
                return status;
            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table" + e);
                cnn.Close();
                return false;
            }
            cnn.Close();
            return status;
        }

        public bool updatePassword(String Email)
        {
            var CL = new commonLogic();
            SqlConnection con = CL.connect();
            try
            {
                Password = hassPassword(CnfPassword);
                SqlCommand cmd;
                string query = "UPDATE users SET password = @password WHERE email = @email";
                cmd = new SqlCommand(query, con);
                cmd.Parameters.AddWithValue("@email", Email);
                cmd.Parameters.AddWithValue("@password", Password);
                cmd.CommandType = CommandType.Text;
                cmd.ExecuteNonQuery();
                con.Close();
                SqlConnection cnn = CL.connect();
                try
                {
                    SqlCommand command;
                    string sql;
                    sql = "SELECT * FROM users WHERE email = @email";
                    command = new SqlCommand(sql, cnn);
                    command.Parameters.AddWithValue("@email", Email);
                    SqlDataReader dataReader = command.ExecuteReader();

                    if (dataReader.HasRows)
                    {
                        while (dataReader.Read())
                        {
                            HttpContext.Current.Session["id"] = dataReader["id"].ToString();
                            HttpContext.Current.Session["email"] = dataReader["email"].ToString();
                            HttpContext.Current.Session["first_name"] = dataReader["first_name"].ToString();
                            HttpContext.Current.Session["last_name"] = dataReader["last_name"].ToString();
                            break;
                        }
                        cnn.Close();
                        return true;
                    }
                    else
                    {
                        cnn.Close();
                        return false;
                    }

                }
                catch (Exception e)
                {
                    CL.getLog("error while updating unique id to table" + e);
                    cnn.Close();
                    return false;
                }

            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table" + e);
                con.Close();
                return false;
            }

        }

        public bool checkEmail()
        {
            bool status = false;
            var CL = new commonLogic();
            SqlConnection cnn = CL.connect();
            try
            {
                SqlCommand command;
                string sql;
                sql = "SELECT * FROM users WHERE email = @email";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@email", Email);
                SqlDataReader dataReader = command.ExecuteReader();

                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        var ID = dataReader["id"].ToString();
                        var Email = dataReader["email"].ToString();
                        var FristName = dataReader["first_name"].ToString();
                        var LastName = dataReader["last_name"].ToString();
                        String verification_code = CL.GetUniqueKey(49);

                        cnn.Close();
                        SqlConnection con = CL.connect();
                        try
                        {
                            SqlCommand cmd;
                            string query = @"IF EXISTS(SELECT * FROM reset_password WHERE email = @email)
                        UPDATE reset_password 
                        SET verification_code = @verification_code
                        WHERE email = @email
                    ELSE
                        INSERT INTO reset_password(email, verification_code) VALUES(@email, @verification_code);";

                            cmd = new SqlCommand(query, con);
                            cmd.Parameters.AddWithValue("@email", Email);
                            cmd.Parameters.AddWithValue("@verification_code", verification_code);
                            cmd.CommandType = CommandType.Text;
                            cmd.ExecuteNonQuery();
                            var Body = "Hi " + FristName + ",<br/><br/>Please <a href='http://localhost:58949/User/Reset?verifyme=" + verification_code + "'>Click here</a> to reset your password <br/><br/><br/>Thanks,<br/>CHD";
                            CL.SendEmail("noreply@chd.com", Email, "CHD password reset", Body);
                        }
                        catch (Exception e)
                        {
                            CL.getLog("error while updating unique id to table" + e);
                            con.Close();
                            return false;
                        }
                        con.Close();
                        break;
                    }
                    status = true;
                }
                else
                {
                    status = false;
                }
                return status;
            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table" + e);
                cnn.Close();
                return false;
            }
            cnn.Close();
            return status;
        }

        public bool checkVerificationCode(String verification_code)
        {
            bool status = false;
            var CL = new commonLogic();
            SqlConnection cnn = CL.connect();
            try
            {
                SqlCommand command;
                string sql;
                sql = "SELECT * FROM reset_password WHERE verification_code = @verification_code";
                command = new SqlCommand(sql, cnn);
                command.Parameters.AddWithValue("@verification_code", verification_code);
                SqlDataReader dataReader = command.ExecuteReader();

                if (dataReader.HasRows)
                {
                    while (dataReader.Read())
                    {
                        HttpContext.Current.Session["email"] = dataReader["email"].ToString();
                        break;
                    }
                    status = true;
                }
                else
                {
                    status = false;
                }
                return status;
            }
            catch (Exception e)
            {
                CL.getLog("error while updating unique id to table" + e);
                cnn.Close();
                return false;
            }
            cnn.Close();
            return status;
        }
    }
}