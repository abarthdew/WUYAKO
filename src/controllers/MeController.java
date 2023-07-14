package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.JOptionPane;

import dao.AdminDAO;
import dao.MemberDAO;
import dao.StudyDAO;
import dto.MemberDTO;
import dto.StudyDTO;

@WebServlet("*.me")
public class MeController extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    response.setCharacterEncoding("UTF8");
    response.setContentType("text/html;charset=UTF-8");
    request.setCharacterEncoding("UTF8");
    String reqUri = request.getRequestURI();
    String ctxPath = request.getContextPath();
    String cmd = reqUri.substring(ctxPath.length());
    PrintWriter pt = response.getWriter();
    MemberDAO me = new MemberDAO();
    StudyDAO st = new StudyDAO();
    try {
      if (cmd.equals("/login.me")) {// 로그인
        String email = request.getParameter("id");
        String pw = request.getParameter("pw");
        int result = me.loginCheck(email, pw);
        if (result == 1) {
          int id = me.getId(email);

          AdminDAO adao = new AdminDAO();          // 정지회원 여부 체크
          String checkBan = adao.CheckBan(email);
          try {
            if (checkBan.equals("Y")) {
              request.getRequestDispatcher("/WEB-INF/admin/ban.jsp").forward(request, response);
            } else {
              throw new Exception();
            }
          } catch (Exception e) {
            String nickname = me.getNickname(email);
            int type = me.getType(email);
            request.getSession().setAttribute("id", id);
            request.getSession().setAttribute("email", email);
            request.getSession().setAttribute("type", type);
            request.getSession().setAttribute("nickname", nickname);
            response.sendRedirect("goMain.win");
          }
        } else {
          response.getWriter().append("<script>;"
            + "if(alert('로그인 실패! 아이디와 비밀번호를 확인 하세요!')!=0){  location.href='goMain.win';}</script>");
        }
      } else if (cmd.equals("/logout.me")) {// 로그아웃
        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);

        request.getRequestDispatcher("goMain.win").forward(request, response);

      } else if (cmd.equals("/getPw.me")) {// pw얻기

        request.getRequestDispatcher("/WEB-INF/member/getPw.jsp").forward(request, response);
      } else if (cmd.equals("/goPwReset.me")) {// pw 초기화
        String email = request.getParameter("email");
        request.setAttribute("email", email);
        request.getRequestDispatcher("/WEB-INF/member/pwReset.jsp").forward(request, response);
      } else if (cmd.equals("/pwReset.me")) {
        String email = request.getParameter("email");
        String pw = request.getParameter("pw");
        System.out.println(email + " " + pw);
        int result = me.pwReset(email, pw);
        response.getWriter().print(result);
      } else if (cmd.equals("/signUpGo.me")) {// 회원가입 으로 가기
        request.getRequestDispatcher("/WEB-INF/member/signForm.jsp").forward(request, response);
      } else if (cmd.equals("/signUp_insert.me")) {// 회원가입
        MemberDTO dto = new MemberDTO();
        String email = request.getParameter("email");// 이메일형식 id
        String pw = request.getParameter("pwcheck");
        String name = request.getParameter("name");
        String nickname = request.getParameter("nickname");
        String age = request.getParameter("age");
        String gender = request.getParameter("gender");
        dto.setEmail(email);
        dto.setPw(pw);
        dto.setName(name);
        dto.setNickname(nickname);
        dto.setBan("");
        dto.setGender(gender);
        dto.setAge(age);
        dto.setType(3);
        int result = me.insert_member(dto);
        if (result == 1) {
          response.getWriter()
            .append("<script> if(alert('가입을 축하드립니다.')!= 0){ location.href='goMain.win' }</script>");
        } else {
          response.getWriter().append(
            "<script> if(alert('가입 실패 다시 시도 해주세요!')!= 0){ location.href='goMain.win' }</script>");
        }
      } else if (cmd.equals("/check.me")) {// 아이디중복확인
        String email = request.getParameter("id");
        int result = me.check(email);
        pt.print(result);
        // 마이페이지로
      } else if (cmd.equals("/mPageGo.me")) {
        int seq = (int) request.getSession().getAttribute("id");
        String currentPage = request.getParameter("currentPage");
        List<StudyDTO> study_dto = st.getStudy(Integer.parseInt(currentPage), seq);
        List<MemberDTO> dto = me.select_Member(seq);
        request.setAttribute("list", dto);
        request.setAttribute("s_list", study_dto);
        request.setAttribute("navi", st.getNavi(seq, Integer.parseInt(currentPage)));
        request.getRequestDispatcher("/WEB-INF/member/mypage.jsp").forward(request, response);
        // 마이페이지에서 패스워드 변경하는 페이지로 이동
      } else if (cmd.equals("/pwChangeGo.me")) {
        request.getRequestDispatcher("/WEB-INF/member/pwChange.jsp").forward(request, response);

      } else if (cmd.equals("/pwChange.me")) {
        int seq = (int) request.getSession().getAttribute("id");
        String beforePw = request.getParameter("pw");
        List<MemberDTO> dto = me.select_Member(seq);
        String dbPw = dto.get(0).getPw();
        String pw = me.testSHA256(beforePw);
        if (dbPw.equals(pw)) {
          // 비밀번호일치
          pt.print(1);
        } else {
          // 비밀번호 불일치
          pt.print(0);
        }
        // 패스워드 변경
      } else if (cmd.equals("/pwChangeOn.me")) {
        String pw = request.getParameter("pwCheck");
        int seq = (int) request.getSession().getAttribute("id");
        int result = me.pwUpdate(pw, seq);
        if (result == 1) {
          response.getWriter().append("<script> if(alert('패스워드가 변경되었습니다.')!= 0){ self.close() }</script>");
        } else {
          response.getWriter().append("<script> if(alert('패스워드 변경에 실패했습니다!')!= 0){ self.close() }</script>");
        }
      } else if (cmd.equals("/main.me")) {
        request.getRequestDispatcher("goMain.win").forward(request, response);
        // 마이페이지 수정하기
      } else if (cmd.equals("/modify.me")) {
        int seq = (int) request.getSession().getAttribute("id");// 씨꿘스
        String nickname = request.getParameter("nickname");
        String gender = request.getParameter("gender");
        String age = request.getParameter("age");
        int result = me.mpUpdate(nickname, gender, age, seq);
        request.getSession().setAttribute("nickname", nickname);

        if (result == 1) {
          response.getWriter()
            .append("<script> if(alert('회원정보를 수정했습니다.')!= 0){ location.href='goMain.win' }</script>");
        } else {
          response.getWriter().append(
            "<script> if(alert('회원정보 수정을 실패했습니다.')!= 0){ location.href='goMain.win' }</script>");
        }
      } else if (cmd.equals("/goWithdrawal.me")) {// 회원 탈퇴 가기
        String email = (String) request.getSession().getAttribute("email");
        Pattern p = Pattern.compile("^((.*) |(.*))");
        Matcher m = p.matcher(email);
        m.find();
        String realEmail = m.group(1);

        request.setAttribute("email", realEmail);
        request.getRequestDispatcher("/WEB-INF/member/withdrawal.jsp").forward(request, response);
      } else if (cmd.equals("/withdrawal.me")) {// 회원 탈퇴 가기
        int id = (int) request.getSession().getAttribute("id");
        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);
        int result = me.delete(id);
        response.getWriter().append(
          "<script> if(alert('탈퇴가 완료 되었습니다!.')!= 0){ opener.location.reload(true); window.close(); }</script>");
      }
    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("error.html");
    }
  }

  private void showMessageDialog(Object object, String string) {
    // TODO Auto-generated method stub

  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
    doGet(request, response);
  }

}
