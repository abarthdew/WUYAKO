package controllers;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.SupportDAO;
import dto.SupportDTO;

@WebServlet("*.su")
public class SupportController extends HttpServlet {

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String requestURI = request.getRequestURI();
    String contextPath = request.getContextPath();
    String cmd = requestURI.substring(contextPath.length());
    SupportDAO su = new SupportDAO();
    try {
      if (cmd.equals("/goSupport.su")) {
        request.getRequestDispatcher("/WEB-INF/etc/support.jsp").forward(request, response);
      } else if (cmd.equals("/callback.su")) {
      } else if (cmd.equals("/insert.su")) {
        String email = request.getParameter("email");
        String name = request.getParameter("name");
        int id = 0;
        int amount = Integer.parseInt(request.getParameter("amount"));
        if (request.getParameter("id").equals("")) {
        } else {
          id = Integer.parseInt(request.getParameter("id"));
        }
        int result = su.insert(new SupportDTO(0, email, id, name, null, null, amount));


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
