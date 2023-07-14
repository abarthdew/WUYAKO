package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.JsonParser;

import dao.AdminDAO;
import dao.KakaoDAO;
import dao.MemberDAO;
import dto.MemberDTO;

@WebServlet("*.ka")
public class KaController extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String reqUri = request.getRequestURI();
    String ctxPath = request.getContextPath();
    String cmd = reqUri.substring(ctxPath.length());
    response.setCharacterEncoding("UTF8");
    response.setContentType("text/html;charset=UTF-8");
    KakaoDAO ka = new KakaoDAO();
    MemberDAO me = new MemberDAO();
    Gson g = new Gson();
    JsonParser parse = new JsonParser();
    try {
      if (cmd.equals("/login.ka")) {
        String apiURL = ka.login();
        response.sendRedirect(apiURL);
      } else if (cmd.equals("/callback.ka")) {
        String code = request.getParameter("code");
        String res = ka.getToken(code);
        String access_token = parse.parse(res.toString()).getAsJsonObject().get("access_token").getAsString();
        String refresh_token = parse.parse(res.toString()).getAsJsonObject().get("refresh_token").getAsString();
        String info = ka.getInfo(access_token);
        try {
          String nickname = parse.parse(info).getAsJsonObject().get("properties").getAsJsonObject()
            .get("nickname").getAsString();
          String email = "";
          String age = "";
          String gender = "";
          if (parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject().get("has_email")
            .getAsString().equals("true")) {
            email = parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject().get("email")
              .getAsString();
          }
          if (parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject().get("has_age_range")
            .getAsString().equals("true")) {
            age = parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject()
              .get("age_range").getAsString();
          }
          if (parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject().get("has_gender")
            .getAsString().equals("true")) {
            gender = parse.parse(info).getAsJsonObject().get("kakao_account").getAsJsonObject()
              .get("gender").getAsString();
          }
          int type = 2;
          email += " " + type;
          if (gender.equals("male") || gender.equals("m") || gender.equals("M"))
            gender = "M";
          else if (gender.equals("female") || gender.equals("f") || gender.equals("F")) {
            gender = "F";
          }
          if (me.check(email) == 0) {
            me.insert_member(new MemberDTO(0, email, null, nickname, nickname, null, gender, age, type));
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
          e.printStackTrace();
          ka.remove(access_token);
          request.setAttribute("type", 2);
          request.getRequestDispatcher("/WEB-INF/member/reprompt.jsp").forward(request, response);
        }
      } else if (cmd.equals("/reprompt.ka")) {
        response.sendRedirect(ka.login());
      } else if (cmd.equals("/logout.ka")) {
        String refresh_token = (String) request.getSession().getAttribute("refresh_token");
        String access_token = parse.parse(ka.getAccessToken(refresh_token)).getAsJsonObject()
          .get("access_token").getAsString();
        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);
        request.getSession().setAttribute("refresh_token", null);
        ka.logout(access_token);
      } else if (cmd.equals("/withdrawal.ka")) {
        int id = (int) request.getSession().getAttribute("id");
        String refresh_token = (String) request.getSession().getAttribute("refresh_token");

        request.getSession().setAttribute("id", null);
        request.getSession().setAttribute("email", null);
        request.getSession().setAttribute("type", null);
        request.getSession().setAttribute("nickname", null);
        request.getSession().setAttribute("refresh_token", null);
        int result = me.delete(id);
        String res = ka.getAccessToken(refresh_token);
        String access_token = parse.parse(res.toString()).getAsJsonObject().get("access_token").getAsString();
        ka.remove(access_token);
        response.getWriter().append(
          "<script> if(alert('탈퇴가 완료 되었습니다!.')!= 0){ opener.location.reload(true); window.close(); }</script>");
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
