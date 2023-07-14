package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import dto.SupportDTO;

public class SupportDAO {
  private Connection getConnection() throws Exception {
    Context ctx = new InitialContext();
    Context compenv = (Context) ctx.lookup("java:/comp/env");
    DataSource ds = (DataSource) compenv.lookup("jdbc");
    Connection con = ds.getConnection();
    return con;
  }

  public int insert(SupportDTO param) throws Exception { // 내용 등록
    String sql = "insert into supportboard values(Support_seq.nextval,?,?,?,default,default,?)";
    try (Connection con = this.getConnection(); PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setString(1, param.getEmail());
      pstat.setInt(2, param.getId());
      pstat.setString(3, param.getName());
      pstat.setInt(4, param.getAmount());
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  public int getMax() throws Exception {
    String sql = "select sum(amount) sum from supportboard";
    try (Connection con = this.getConnection();
         PreparedStatement pstat = con.prepareStatement(sql);
         ResultSet re = pstat.executeQuery();) {
      if (re.next()) {
        int result = re.getInt("sum");
        return result;
      } else {
        return -1;
      }
    }
  }
}
