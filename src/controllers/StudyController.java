package controllers;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.StudyDAO;
import dto.StudyDTO;

@WebServlet("*.st")
public class StudyController extends HttpServlet {

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String requestURI = request.getRequestURI();
    String contextPath = request.getContextPath();
    String cmd = requestURI.substring(contextPath.length());
    StudyDAO st = new StudyDAO();
    try {
      if (cmd.equals("/insert.st")) {
        String brand = request.getParameter("brand");
        String answer = request.getParameter("answer");
        if (request.getParameter("id").equals("")) {
          st.insert(new StudyDTO(0, brand, answer, null));
        } else {
          int id = Integer.parseInt(request.getParameter("id"));
          st.insert(new StudyDTO(id, brand, answer, null));
        }
      } else if (cmd.equals("/getList.st")) {

      } else if (cmd.equals("/getCount.st")) {

      }
    } catch (Exception e) {
      e.printStackTrace();
      response.sendRedirect("error.html");
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    doGet(request, response);
  }


}
