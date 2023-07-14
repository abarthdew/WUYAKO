package dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import dto.StudyDTO;

public class StudyDAO {
  private Connection getConnection() throws Exception {
    Context ctx = new InitialContext();
    Context compenv = (Context) ctx.lookup("java:/comp/env");
    DataSource ds = (DataSource) compenv.lookup("jdbc");
    Connection con = ds.getConnection();
    return con;
  }

  public int insert(StudyDTO param) throws Exception { // 내용 등록
    String sql = "insert into study values(?,?,?,default)";
    try (Connection con = this.getConnection(); PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setInt(1, param.getId());
      pstat.setString(2, param.getBrand());
      pstat.setString(3, param.getAnswer());
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  private PreparedStatement getpstat(Connection con, int id) throws Exception {
    String sql = "select * from study where id=? order by comp_date desc";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, id);
    return pstat;
  }

  public List<StudyDTO> getStudy(int currentPage, int id) throws Exception {
    int count = 0;
    try (Connection con = this.getConnection();
         PreparedStatement pstat = getpstat(con, id);
         ResultSet re = pstat.executeQuery();) {
      List<StudyDTO> result = new ArrayList<>();
      while (re.next()) {
        count++;
        if (count >= (currentPage - 1) * 10 + 1 && count <= (currentPage - 1) * 10 + 10) {
          String brand = re.getString("brand");
          String answer = re.getString("answer");
          Date comp_date = re.getDate("comp_date");
          StudyDTO st = new StudyDTO(id, brand, answer, comp_date);
          result.add(st);
        }
      }
      return result;
    }
  }

  private PreparedStatement getpstatForGetCount(Connection con, String brand) throws Exception {
    String sql = "select count(*) count from study where brand = ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setString(1, brand);
    return pstat;
  }

  public int getCount(String brand) throws Exception { // 내용 등록
    try (Connection con = this.getConnection();
         PreparedStatement pstat = this.getpstatForGetCount(con, brand);
         ResultSet re = pstat.executeQuery();) {

      re.next();
      int count = re.getInt("count");

      return count;
    } catch (Exception e) {
      e.printStackTrace();
      return -1;
    }
  }

  private PreparedStatement getpstatForGetRecordTotalCount(Connection con, int id) throws Exception {
    String sql = "select count(*) count from study where id = ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, id);
    return pstat;
  }

  public int getRecordTotalCount(int id) throws Exception { // 내용 등록
    try (Connection con = this.getConnection();
         PreparedStatement pstat = getpstatForGetRecordTotalCount(con, id);
         ResultSet re = pstat.executeQuery();) {
      int count = 0;
      if (re.next()) {
        count = re.getInt("count");
      }
      return count;
    }
  }

  public String getNavi(int id, int currentPage) throws Exception {
    int recordTotalCount = getRecordTotalCount(id);
    int recordCountPerPage = 10;
    int naviCountPerPage = 10;
    int pageTotalCount = 0;
    if (recordTotalCount % recordCountPerPage > 0) {
      pageTotalCount = (recordTotalCount / recordCountPerPage + 1);
    } else {
      pageTotalCount = (recordTotalCount / recordCountPerPage);
    }

    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > pageTotalCount) {
      currentPage = pageTotalCount;
    }
    int startNavi = (currentPage - 1) / naviCountPerPage * naviCountPerPage + 1;
    int endNavi = startNavi + naviCountPerPage - 1;
    if (endNavi > pageTotalCount) {
      endNavi = pageTotalCount;
    }
    boolean needPrev = true;
    boolean needNext = true;
    if (startNavi == 1) {
      needPrev = false;
    }
    if (endNavi == pageTotalCount) {
      needNext = false;
    }
    StringBuilder sb = new StringBuilder();
    if (needPrev) {
      sb.append("<a href='mPageGo.me?currentPage=" + (startNavi - 1) + "'>" + "<이전" + "</a> ");
    }
    for (int i = startNavi; i <= endNavi; i++) {
      sb.append("<a href='mPageGo.me?currentPage=" + i + "'>" + i + "</a> ");
    }
    if (needNext) {
      sb.append("<a href='mPageGo.me?currentPage=" + (endNavi + 1) + "'>" + "다음>" + "</a> ");
    }
    return sb.toString();
  }
}
