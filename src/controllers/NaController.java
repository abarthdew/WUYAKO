package controllers;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonParser;

import dao.AdminDAO;
import dao.MemberDAO;
import dao.NaverDAO;
import dto.MemberDTO;


@WebServlet("*.na")
public class NaController extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String reqUri = request.getRequestURI();
    String ctxPath = request.getContextPath();
    String cmd = reqUri.substring(ctxPath.length());
    NaverDAO na = new NaverDAO();
    MemberDAO me = new MemberDAO();
    Gson g = new Gson();
    JsonParser parse = new JsonParser();
    response.setCharacterEncoding("UTF8");
    response.setContentType("text/html;charset=UTF-8");
    try {
      if (cmd.equals("/login.na")) {
        String apiURL = na.login();
        response.sendRedirect(apiURL);
      } else if (cmd.equals("/callback.na")) {
        String code = request.getParameter("code");
        String state = request.getParameter("state");
        String res = na.getToken(code, state);
        String access_token = parse.parse(res.toString()).getAsJsonObject().get("access_token").getAsString();
        String refresh_token = parse.parse(res.toString()).getAsJsonObject().get("refresh_token").getAsString();
        String info = na.getInfo(access_token);
        try {
          String email = parse.parse(info).getAsJsonObject().get("email").getAsString();
          String nickname = parse.parse(info).getAsJsonObject().get("nickname").getAsString();
          String age = parse.parse(info).getAsJsonObject().get("age").getAsString();
          String gender = parse.parse(info).getAsJsonObject().get("gender").getAsString();
          String name = parse.parse(info).getAsJsonObject().get("name").getAsString();
          int type = 1;
          email += " " + type;
          if (me.check(email) == 0) {
            int result = me.insert_member(new MemberDTO(0, email, null, name, nickname, null, gender, age, type));
          }
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
            String realNickname = me.getNickname(email);
            request.getSession().setAttribute("id", id);
            request.getSession().setAttribute("email", email);
            request.getSession().setAttribute("type", type);
            request.getSession().setAttribute("nickname", realNickname);
            request.getSession().setAttribute("refresh_token", refresh_token);
            response.sendRedirect("goMain.win");
          }
        } catch (Exception e) {
          request.setAttribute("type", 1);
          request.getRequestDispatcher("/WEB-INF/member/reprompt.jsp").forward(request, response);
        }
      } else if (cmd.equals("/reprompt.na")) {
        response.sendRedirect(na.reprompt());
      } else if (cmd.equals("/logout.na")) {
        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);
        request.getSession().setAttribute("refresh_token", null);
      } else if (cmd.equals("/withdrawal.na")) {
        int id = (int) request.getSession().getAttribute("id");
        String refresh_token = (String) request.getSession().getAttribute("refresh_token");
        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);
        request.getSession().setAttribute("refresh_token", null);
        int result = me.delete(id);
        String res = na.getAccessToken(refresh_token);
        String access_token = parse.parse(res.toString()).getAsJsonObject().get("access_token").getAsString();
        String a = na.delete(access_token);
        response.getWriter().append("<script> if(alert('탈퇴가 완료 되었습니다!.')!= 0){ opener.location.reload(true); window.close(); }</script>");
      }
    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("error.html");

    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }
}
