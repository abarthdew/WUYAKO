package controllers;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.MailDAO;
import dao.MemberDAO;


@WebServlet("*.ma")
public class MailController extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String reqUri = request.getRequestURI();
    String ctxPath = request.getContextPath();
    String cmd = reqUri.substring(ctxPath.length());
    MemberDAO me = new MemberDAO();
    MailDAO ma = new MailDAO();
    PrintWriter pw = response.getWriter();
    response.setCharacterEncoding("UTF8");
    response.setContentType("text/html;charset=UTF-8");
    try {
      if (cmd.equals("/check.ma")) {
        String email = request.getParameter("email");
        int result = me.check(email);
        pw.print(result);
      } else if (cmd.equals("/post.ma")) {
        String email = request.getParameter("email");
        String certi = ma.Mail(email);
        pw.print(certi);
      }
    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("error.html");
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // TODO Auto-generated method stub
    doGet(request, response);
  }

}
