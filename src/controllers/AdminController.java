package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Timer;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.AdminDAO;
import dao.FreeBoardDAO;
import dao.NoticeBoardDAO;
import dao.QnaBoardDAO;
import dao.StudyDAO;
import dao.SupportDAO;
import dto.AdminDTO;
import dto.FreeBoardDTO;
import dto.MemberDTO;
import dto.NoticeBoardDTO;
import dto.QnaBoardDTO;

@WebServlet("*.admin")
public class AdminController extends HttpServlet {
  public static int visitCount;

  protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setCharacterEncoding("utf-8");
    PrintWriter pw = response.getWriter();
    String requestURI = request.getRequestURI();
    String contextPath = request.getContextPath();
    String cmd = requestURI.substring(contextPath.length());

    AdminDAO adao = new AdminDAO();
    FreeBoardDAO fb = new FreeBoardDAO();
    QnaBoardDAO qb = new QnaBoardDAO();
    NoticeBoardDAO nb = new NoticeBoardDAO();

    DecimalFormat formatter = new DecimalFormat("###,###");

    try {
// ==================================== 방문자 카운트 ====================================
      if (cmd.equals("/goMain.admin")) {
        ++visitCount;
        request.getServletContext().setAttribute("visitCount", visitCount);
        if (visitCount < 2) {
          Timer timer = new Timer();
          Calendar date = Calendar.getInstance();
          date.set(Calendar.HOUR_OF_DAY, 23);
          date.set(Calendar.MINUTE, 59);
          date.set(Calendar.SECOND, 50);
          date.set(Calendar.MILLISECOND, 0);
          timer.schedule(new AdminDAO(), date.getTime(), 1000 * 60 * 60 * 24);
        }

        int freeRecordCount = 0;
        int qnaRecordCount = 0;
        int noticeRecordCount = 0;
        try {
          freeRecordCount = fb.recordCount();
          qnaRecordCount = qb.recordCount();
          noticeRecordCount = nb.recordCount();
        } catch (Exception e) {

          e.printStackTrace();
        }

        if (freeRecordCount == 0) {                      // 자유 게시판 게시글이 0일 경우

          request.setAttribute("freeRecordCount", freeRecordCount);
        } else {
          List<FreeBoardDTO> mainFreeList = null;
          try {
            mainFreeList = fb.mainFreeBoardList(1);
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("mainFreeList", mainFreeList);
        }

        if (qnaRecordCount == 0) {                      // 질문 게시판 게시글이 0 일 경우
          request.setAttribute("qnaRecordCount", qnaRecordCount);
        } else {
          List<QnaBoardDTO> mainQnaList = null;
          try {
            mainQnaList = qb.mainQnaBoardList(1);
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("mainQnaList", mainQnaList);
        }
        if (noticeRecordCount == 0) {                    // 공지게시판 게시글이 0일 경우
          request.setAttribute("noticeRecordCount", noticeRecordCount);
        } else {
          List<NoticeBoardDTO> mainNoticeList = null;
          try {
            mainNoticeList = nb.mainNoticeBoardList(1);
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("mainNoticeList", mainNoticeList);
        }
        request.getRequestDispatcher("/WEB-INF/main.jsp").forward(request, response);
      }
// ========================================== 관리자 페이지_그래프 // ==========================================
      if (cmd.equals("/goAdmin.admin")) {                    // 일일 방문자
        AdminDAO vdao = new AdminDAO();
        List<AdminDTO> vList = new ArrayList<>();
        vList = vdao.visitChart();
        request.setAttribute("vList", vList);

        AdminDTO vdto = new AdminDTO();                       // 성별
        vdto = vdao.genderChart();
        request.setAttribute("vdto", vdto);

        AdminDTO agedto = new AdminDTO();                  // 연령대
        agedto = vdao.ageChart();
        request.setAttribute("agedto", agedto);

        AdminDTO agePerdto = new AdminDTO();                // 연령대별 %
        agePerdto = vdao.agePerChart();
        request.setAttribute("agePerdto", agePerdto);

        SupportDAO su = new SupportDAO();                  // 후원금액
        int donationResult = su.getMax();
        String formatterDonationResult = formatter.format(donationResult);
        request.setAttribute("donation", formatterDonationResult);

        StudyDAO st = new StudyDAO();                    // 학습 완료 수
        String study1 = "mcdonald";
        int studyCount = st.getCount(study1);
        request.setAttribute("studyCount", studyCount);

// ========================================== 공지사항  ==========================================
        int noticeRecordCount = 0;
        try {
          noticeRecordCount = nb.recordCount();
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }

        if (noticeRecordCount == 0) {
          request.setAttribute("noticeRecordCount", noticeRecordCount);
        } else {
          List<NoticeBoardDTO> noticeList = nb.selectByPage(1);
          request.setAttribute("noticeList", noticeList);
        }

// ========================================== 질문 게시판 답변 Y/N ==========================================
        int qnaRecordCount = 0;
        try {
          qnaRecordCount = qb.recordCount();
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }

        if (qnaRecordCount == 0) {                      // 건의 게시글이 없다면
          request.setAttribute("qnaRecordCount", qnaRecordCount);
        } else {
          List<QnaBoardDTO> qnaList = qb.selectByPage(1);          //한페이지에 몇개 보여줄건지
          request.setAttribute("qnaList", qnaList);

        }
// ========================================== 자유 게시판  ==========================================
        int freeRecordCount = 0;
        try {
          freeRecordCount = fb.recordCount();
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }

        if (freeRecordCount == 0) {                      // 자유 게시글이 없다면
          request.setAttribute("freeRecordCount", freeRecordCount);
        } else {
          List<FreeBoardDTO> freeList = fb.selectByPage(1);
          request.setAttribute("freeList", freeList);

        }

        request.getRequestDispatcher("/WEB-INF/admin/admin.jsp").forward(request, response);
//==================================================================================================

      } else if (cmd.equals("/emailCheck.admin")) {                            // 회원 조회 결과 확인
        String email = request.getParameter("email");
        request.getSession().setAttribute("email", email);
        int result = adao.emailCheck(email);
        pw.print(result);

      } else if (cmd.equals("/userManage.admin")) {                            // 회원 관리 페이지
        String email = (String) request.getSession().getAttribute("email");
        MemberDTO mdto = adao.searchByEmail(email);
        request.setAttribute("mdto", mdto);

        request.getRequestDispatcher("/WEB-INF/admin/userManage.jsp").forward(request, response);

      } else if (cmd.equals("/ban.admin")) {                              // 회원 차단 / 해제
        String ban = request.getParameter("key");
        String email = (String) request.getSession().getAttribute("email");
        adao.banUpdate(ban, email);
      }
    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("error.html");
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    doGet(request, response);
  }

}
