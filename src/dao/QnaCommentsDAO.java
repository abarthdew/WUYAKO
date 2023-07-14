package dao;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.sql.DataSource;

import dto.QnaCommentsDTO;

public class QnaCommentsDAO {
  private Connection getConnection() throws Exception {
    Context ctx = new InitialContext();
    Context compenv = (Context) ctx.lookup("java:/comp/env");
    DataSource ds = (DataSource) compenv.lookup("jdbc");
    Connection con = ds.getConnection();
    return con;
  }

  public String replaceAll(String contents) throws Exception {
    contents = contents.replaceAll("<script>", "aa");
    contents = contents.replaceAll("</script>", "bb");

    return contents;
  }

  public int insertComment(QnaCommentsDTO param) throws Exception { // 댓글 정보 데베에 저장
    String sql = "insert into QuestionComments values(QuestionComments_seq.nextval,?,?,?,?,?,default,?,?)";
    String comment = this.replaceAll(param.getComment());
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = con.prepareStatement(sql);
    ) {
      pstat.setString(1, comment);
      pstat.setInt(2, param.getPostNum());
      pstat.setString(3, param.getPostTitle());
      pstat.setString(4, param.getWriter());
      pstat.setString(5, param.getIp());
      pstat.setString(6, param.getEmail());
      pstat.setInt(7, param.getId());
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  private PreparedStatement pstatCommentList(Connection con, int postNum) throws Exception {
    String sql = "select * from QuestionComments where sql = ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, postNum);
    return pstat;

  }

  public List<QnaCommentsDTO> commentList(int postNum) throws Exception {//글번호에 따른 댓글들
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = this.pstatCommentList(con, postNum);
      ResultSet rs = pstat.executeQuery();
    ) {
      List<QnaCommentsDTO> list = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String comment = rs.getString("comments");
        postNum = rs.getInt("postNum");
        String postTitle = rs.getString("postTitle");
        String writer = rs.getString("postTitle");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        QnaCommentsDTO dto = new QnaCommentsDTO();
        list.add(dto);
      }
      return list;
    }
  }

  static int recordCountPerComment = 10;// 한 페이지에 보여줄 댓글 갯수
  static int naviCountPerPage = 10;// 한페이지에 보여줄 페이지 번호 수

  private PreparedStatement pstatselectByPage(Connection con, int startNum, int endNum, int postNum) throws Exception {
    String sql = "select * from (select row_number()over(order by seq asc) as rown, QuestionComments.* from QuestionComments where postNum = ?) where rown between ? and ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, postNum);
    pstat.setInt(2, startNum);
    pstat.setInt(3, endNum);
    return pstat;
  }

  public List<QnaCommentsDTO> selectByComment(int currentPage, int postNum) throws Exception { // 한 페이지에 보여줄 글 갯수

    int endNum = currentPage * recordCountPerComment;
    int startNum = endNum - 9;
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = this.pstatselectByPage(con, startNum, endNum, postNum);
      ResultSet rs = pstat.executeQuery();
    ) {
      List<QnaCommentsDTO> list = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String comments = rs.getString("comments");
        postNum = rs.getInt("postNum");
        String postTitle = rs.getString("postTitle");
        String writer = rs.getString("writer");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        QnaCommentsDTO dto = new QnaCommentsDTO(seq, comments, postNum, postTitle, writer, ip, writeDate, email, id);
        list.add(dto);
      }
      return list;

    }

  }

  private PreparedStatement pstatCountComment(Connection con, int postNum) throws Exception {
    String sql = "select count(*) record from QuestionComments where postNum=?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, postNum);
    return pstat;
  }

  public int countComment(int postNum) throws Exception {// 댓글 갯수 구하기
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = this.pstatCountComment(con, postNum);
      ResultSet rs = pstat.executeQuery();
    ) {
      rs.next();
      return rs.getInt("record");
    }
  }

  public String getNavi(int currentPage, int postNum) throws Exception {

    int recordTotalCount = this.countComment(postNum); // 전체 글 갯수


    // 전체 페이지 수
    int pageTotalCount = 0;
    if (recordTotalCount % recordCountPerComment > 0) { //전체 글 갯수 % 한  페이지에 보여줄 글 갯수 -> 나머지 잇으면 한페이지 더 필요
      pageTotalCount = recordTotalCount / recordCountPerComment + 1;
    } else if (recordTotalCount % recordCountPerComment == 0) {
      pageTotalCount = recordTotalCount / recordCountPerComment;
    }
//----------------------------------------------------------------------------------
    if (currentPage < 1) {//최소 페이지 보다 작으면 최소페이지로
      currentPage = 1;
    } else if (currentPage > pageTotalCount) { // 현재페이지 번호가 전체페이지보다 크면 최대 페이지로
      currentPage = pageTotalCount;
    }//보안코드

    //내 위치의 기준으로 첫페이지와 끝페이지 알아내기
    int startNavi = (currentPage - 1) / naviCountPerPage * naviCountPerPage + 1;
    int endNavi = startNavi + (naviCountPerPage - 1);


    //ex) startNavi : 14페이지에 있다고 가정  첫페이지는 11  -> 14/10 = 1 -> 1*10 = 10 -> 10+1 = 11 ----> (currentPage/10)*10+1   // 10은 한번에 보여줄 페이지 숫자 범위
    // 10 20 30등 페이지일 경우도 있음 :     ★★(currentPage - 1)/10*10+1 -> 이 공식은 다 적용

    //최대페이지 번호보다 endNavi 번호가 크게 나옴 ㅠ
    if (endNavi > pageTotalCount) {
      endNavi = pageTotalCount;
    }

    boolean needPrev = true; // 이전버튼
    boolean needNext = true; // 다음버튼

    if (startNavi == 1) {
      needPrev = false;
    }
    if (endNavi == pageTotalCount) {
      needNext = false;
    }


    StringBuilder sb = new StringBuilder();

    if (needPrev) {
      sb.append("<a href='qnaContent.board02?commentPage=" + (startNavi - 1) + "&&seq=" + postNum + "'> <이전 </a>");
    }
    for (int i = startNavi; i <= endNavi; i++) {
      sb.append("<a href='qnaContent.board02?commentPage=" + i + "&&seq=" + postNum + "'>" + i + "  </a>");

    }
    if (needNext) {
      sb.append("<a href='qnaContent.board02?commentPage=" + (endNavi + 1) + "&&seq=" + postNum + "'> 다음> </a>");
    }

    return sb.toString();

  }

  public int alterComment(int seq, String comment) throws Exception {//댓글 수정하기
    String sql = "update QuestionComments set comments = ? where seq = ?";
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = con.prepareStatement(sql);
    ) {
      pstat.setString(1, comment);
      pstat.setInt(2, seq);
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  public int deleteComment(int seq) throws Exception {
    String sql = "delete from QuestionComments where seq = ?";
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = con.prepareStatement(sql);
    ) {
      pstat.setInt(1, seq);
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

}
