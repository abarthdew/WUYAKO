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

import dto.NoticeBoardDTO;

public class NoticeBoardDAO {
  private Connection getConnection() throws Exception {
    Context ctx = new InitialContext();
    Context compenv = (Context) ctx.lookup("java:/comp/env");
    DataSource ds = (DataSource) compenv.lookup("jdbc");
    Connection con = ds.getConnection();
    return con;
  }

  public int insert(NoticeBoardDTO param) throws Exception { // 내용 등록
    String sql = "insert into NoticeBoard values(NoticeBoard_seq.nextval,?,?,?,0,?,default,?,?)";
    String content = this.replaceAll(param.getContent());
    String title = this.replaceAll(param.getTitle());
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setString(1, title);
      pstat.setString(2, content);
      pstat.setString(3, param.getWriter());
      pstat.setString(4, param.getIp());
      pstat.setString(5, param.getEmail());
      pstat.setInt(6, param.getId());
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  public List<NoticeBoardDTO> NoticeList() throws Exception { // 자유게시판 글 목록
    String sql = "select * from NoticeBoard order by seq desc";
    try (Connection con = this.getConnection();
         PreparedStatement pstat = con.prepareStatement(sql);
         ResultSet rs = pstat.executeQuery();) {
      List<NoticeBoardDTO> noticeList = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String title = rs.getString("title");
        String content = rs.getString("content");
        String writer = rs.getString("writer");
        int viewCount = rs.getInt("viewCount");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        NoticeBoardDTO dto = new NoticeBoardDTO(seq, title, content, writer, viewCount, ip, writeDate, id, email);
        noticeList.add(dto);
      }
      return noticeList;
    }
  }

  public int viewCount(int seq) throws Exception { // 조회수 올리기
    String sql = "update NoticeBoard set viewCount = viewCount + 1 where seq = ?";
    try (Connection con = this.getConnection(); PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setInt(1, seq);
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  private PreparedStatement pstatContent(Connection con, int seq) throws Exception {
    String sql = "select * from NoticeBoard where seq = ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, seq);
    return pstat;
  }

  public NoticeBoardDTO content(int seq) throws Exception { // 선택한 글 내용 불러오기
    try (Connection con = this.getConnection();
         PreparedStatement pstat = this.pstatContent(con, seq);
         ResultSet rs = pstat.executeQuery();) {
      while (rs.next()) {
        seq = rs.getInt("seq");
        String title = rs.getString("title");
        String content = rs.getString("content");
        String writer = rs.getString("writer");
        int viewCount = rs.getInt("viewCount");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        NoticeBoardDTO dto = new NoticeBoardDTO(seq, title, content, writer, viewCount, ip, writeDate, id, email);
        return dto;
      }
      return null;
    }
  }

  public int deleteContent(int seq) throws Exception { // 글 삭제
    String sql = "delete from NoticeBoard where seq = ?";
    try (Connection con = this.getConnection(); PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setInt(1, seq);
      return pstat.executeUpdate();
    }
  }

  public int alterContent(String title, String content, int seq) throws Exception {// 글 수정
    String sql = "update NoticeBoard set title = ?, content = ? where seq = ? ";
    String replaceContent = this.replaceAll(content);
    String replcateTitle = this.replaceAll(title);
    try (Connection con = this.getConnection(); PreparedStatement pstat = con.prepareStatement(sql);) {
      pstat.setString(1, replcateTitle);
      pstat.setString(2, replaceContent);
      pstat.setInt(3, seq);
      con.commit();
      int result = pstat.executeUpdate();
      return result;
    }
  }

  public int recordCount() throws Exception { // 글 갯수
    String sql = "select count(*) record from NoticeBoard";
    try (Connection con = this.getConnection();
         PreparedStatement pstat = con.prepareStatement(sql);
         ResultSet rs = pstat.executeQuery();) {
      rs.next();
      return rs.getInt("record");
    }
  }

  static int recordCountPerPage = 10;// 한 페이지에 보여줄 글 개수
  static int naviCountPerPage = 10;// 한페이지에 보여줄 페이지 번호 수

  public String getNavi(int currentPage) throws Exception {
    int recordTotalCount = this.recordCount(); // 전체 글 갯수
    // 전체 페이지 수
    int pageTotalCount = 0;
    if (recordTotalCount % recordCountPerPage > 0) { // 전체 글 갯수 % 한 페이지에 보여줄 글 갯수 -> 나머지 잇으면 한페이지 더 필요
      pageTotalCount = recordTotalCount / recordCountPerPage + 1;
    } else if (recordTotalCount % recordCountPerPage == 0) {
      pageTotalCount = recordTotalCount / recordCountPerPage;
    }
//----------------------------------------------------------------------------------
    if (currentPage < 1) {// 최소 페이지 보다 작으면 최소페이지로
      currentPage = 1;
    } else if (currentPage > pageTotalCount) { // 현재페이지 번호가 전체페이지보다 크면 최대 페이지로
      currentPage = pageTotalCount;
    } // 보안코드

    int startNavi = (currentPage - 1) / naviCountPerPage * naviCountPerPage + 1;
    int endNavi = startNavi + (naviCountPerPage - 1);

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
      sb.append("<a href='list.board03?noticeCurrentPage=" + (startNavi - 1) + "'> <이전 </a>");
    }
    for (int i = startNavi; i <= endNavi; i++) {
      sb.append("<a class='pageNum' href='list.board03?noticeCurrentPage=" + i + "'>  " + i + "  </a>");
    }
    if (needNext) {
      sb.append("<a href='list.board03?noticeCurrentPage=" + (endNavi + 1) + "'> 다음> </a>");
    }
    return sb.toString();
  }

  //1페이지 : 가장최신글 10개 -> seq 크면클수록 최신, 작성일 (중복 됨) -> 글 삭제하면 문제 seq
  // 1페이지 : 가장최신글 10개 -> seq 크면클수록 최신, 작성일 (중복 됨) -> 글 삭제하면 문제 seq
  private PreparedStatement pstatselectByPage(Connection con, int startNum, int endNum) throws Exception {
    String sql = "select * from (select row_number()over(order by seq desc) as rown, NoticeBoard.* from NoticeBoard) where rown between ? and ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, startNum);
    pstat.setInt(2, endNum);
    return pstat;
  }

  public List<NoticeBoardDTO> selectByPage(int currentPage) throws Exception { // 한 페이지에 보여줄 글 갯수
    int endNum = currentPage * recordCountPerPage;
    int startNum = endNum - 9;
    try (Connection con = this.getConnection();
         PreparedStatement pstat = this.pstatselectByPage(con, startNum, endNum);
         ResultSet rs = pstat.executeQuery();) {
      List<NoticeBoardDTO> list = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String title = rs.getString("title");
        String content = rs.getString("content");
        String writer = rs.getString("writer");
        int viewCount = rs.getInt("viewCount");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        NoticeBoardDTO dto = new NoticeBoardDTO(seq, title, content, writer, viewCount, ip, writeDate, id, email);
        list.add(dto);
      }
      return list;
    }
  }

  //------------------------------------------------------------------------------------------------------------------------------------------------
  //검색기능
  private PreparedStatement pstatSelectCount(Connection con, String searchWord, String option) throws Exception {
    String sql = "select count(*) count from NoticeBoard where " + option + " like ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setString(1, "%" + searchWord + "%");
    return pstat;
  }

  public int selectCount(String searchWord, String option) throws Exception {// 검색시 글 갯수
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = this.pstatSelectCount(con, searchWord, option);
      ResultSet rs = pstat.executeQuery();
    ) {
      rs.next();
      return rs.getInt("count");
    }
  }

  private PreparedStatement pstatselectBySearchPage(Connection con, int startNum, int endNum, String searchWord, String option) throws Exception {
    String sql = "select * from (select row_number()over(order by seq desc) as rown, NoticeBoard.* from NoticeBoard where " + option + " like ?) where rown between ? and ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setString(1, "%" + searchWord + "%");
    pstat.setInt(2, startNum);
    pstat.setInt(3, endNum);
    return pstat;
  }

  public List<NoticeBoardDTO> selectBySearchPage(int currentPage, String searchWord, String option) throws Exception { // 한 페이지에 보여줄 검색 글 갯수
    int endNum = currentPage * recordCountPerPage;
    int startNum = endNum - 9;
    try (
      Connection con = this.getConnection();
      PreparedStatement pstat = this.pstatselectBySearchPage(con, startNum, endNum, searchWord, option);
      ResultSet rs = pstat.executeQuery();
    ) {
      List<NoticeBoardDTO> list = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String title = rs.getString("title");
        String content = rs.getString("content");
        String writer = rs.getString("writer");
        int viewCount = rs.getInt("viewCount");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        NoticeBoardDTO dto = new NoticeBoardDTO(seq, title, content, writer, viewCount, ip, writeDate, id, email);
        list.add(dto);
      }
      return list;
    }
  }

  public String getNaviSelect(int currentPage, String option, String searchWord) throws Exception { //검색시 네비게이션
    int recordTotalCount = this.selectCount(searchWord, option); // 전체 글 갯수
    // 전체 페이지 수
    int pageTotalCount = 0;
    if (recordTotalCount % recordCountPerPage > 0) { //전체 글 갯수 % 한  페이지에 보여줄 글 갯수 -> 나머지 잇으면 한페이지 더 필요
      pageTotalCount = recordTotalCount / recordCountPerPage + 1;
    } else if (recordTotalCount % recordCountPerPage == 0) {
      pageTotalCount = recordTotalCount / recordCountPerPage;
    }
    //----------------------------------------------------------------------------------
    if (currentPage < 1) {//최소 페이지 보다 작으면 최소페이지로
      currentPage = 1;
    } else if (currentPage > pageTotalCount) { // 현재페이지 번호가 전체페이지보다 크면 최대 페이지로
      currentPage = pageTotalCount;
    }//보안코드
    int startNavi = (currentPage - 1) / naviCountPerPage * naviCountPerPage + 1;
    int endNavi = startNavi + (naviCountPerPage - 1);
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
      sb.append("<a href='searchContent.board03?noticeCurrentPage=" + (startNavi - 1) + "&&option=" + option + "&&searchWord=" + searchWord + "'> <이전 </a>");
    }
    for (int i = startNavi; i <= endNavi; i++) {
      sb.append("<a class='pageNum' href='searchContent.board03?noticeCurrentPage=" + i + "&&option=" + option + "&&searchWord=" + searchWord + "'>  " + i + "  </a>");
    }
    if (needNext) {
      sb.append("<a href='searchContent.board03?noticeCurrentPage=" + (endNavi + 1) + "&&option=" + option + "&&searchWord=" + searchWord + "'> 다음> </a>");
    }
    return sb.toString();
  }


  public String replaceAll(String contents) throws Exception {
    contents = contents.replaceAll("<script>", "");
    contents = contents.replaceAll("</script>", "");
    contents = contents.replaceAll("\\(\\'", "");
    contents = contents.replaceAll("\\'\\)", "");
    contents = contents.replaceAll("\\'", "");

    return contents;
  }

  //----------------------------------------------------------------------------------------------------------
  //메인페이지에 게시판 리스트

  private PreparedStatement pstatmainNoticeBoardList(Connection con, int startNum, int endNum) throws Exception {
    String sql = "select * from (select row_number()over(order by seq desc) as rown, NoticeBoard.* from NoticeBoard) where rown between ? and ?";
    PreparedStatement pstat = con.prepareStatement(sql);
    pstat.setInt(1, startNum);
    pstat.setInt(2, endNum);
    return pstat;
  }

  public List<NoticeBoardDTO> mainNoticeBoardList(int currentPage) throws Exception { // 한 페이지에 보여줄 글 갯수
    int endNum = currentPage * 7;
    int startNum = endNum - 9;
    try (Connection con = this.getConnection();
         PreparedStatement pstat = this.pstatselectByPage(con, startNum, endNum);
         ResultSet rs = pstat.executeQuery();) {
      List<NoticeBoardDTO> list = new ArrayList<>();
      while (rs.next()) {
        int seq = rs.getInt("seq");
        String title = rs.getString("title");
        String content = rs.getString("content");
        String writer = rs.getString("writer");
        int viewCount = rs.getInt("viewCount");
        String ip = rs.getString("ip");
        Timestamp writeDate = rs.getTimestamp("writeDate");
        String email = rs.getString("email");
        int id = rs.getInt("id");
        NoticeBoardDTO dto = new NoticeBoardDTO(seq, title, content, writer, viewCount, ip, writeDate, id, email);
        list.add(dto);
      }
      return list;
    }
  }


}