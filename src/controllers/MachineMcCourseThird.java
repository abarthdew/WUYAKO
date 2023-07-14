package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.MenuDataDAO;
import dto.McFinalDTO;
import dto.McdonaldDTO;

@WebServlet("*.third")
public class MachineMcCourseThird extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setCharacterEncoding("utf8");
    PrintWriter out = response.getWriter();

    String cmd = request.getRequestURI().substring(request.getContextPath().length());
    MenuDataDAO machine = new MenuDataDAO();

    if (cmd.equals("/getCode.third")) {
      String personalCode = machine.personalCode();
      try {
        machine.insertGameCode(personalCode);
        request.getSession().setAttribute("personalCode", personalCode);
        request.getRequestDispatcher("/WEB-INF/game/mc_score3_takeio.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/takeio.third")) {
      String takeIOY = request.getParameter("key2");
      int result = machine.updateGameStuff("takeIOY", takeIOY, request.getSession().getAttribute("personalCode").toString());
      if (result > 0) {
        out.print("다음 단계로 넘어갑니다");
      } else {
        out.print("오류발생");
      }
    } else if (cmd.equals("/mc_allMenu.third")) {
      try {
        ArrayList<McdonaldDTO> burgers = machine.getMcInfo("burger");
        request.setAttribute("burgers", burgers);
        ArrayList<McdonaldDTO> snack_sides = machine.getMcInfo("snack_side");
        request.setAttribute("snack_sides", snack_sides);
        ArrayList<McdonaldDTO> mc_cafes = machine.getMcInfo("mc_cafe");
        request.setAttribute("mc_cafes", mc_cafes);
        ArrayList<McdonaldDTO> beverages = machine.getMcInfo("beverage");
        request.setAttribute("beverages", beverages);
        ArrayList<McdonaldDTO> deserts = machine.getMcInfo("desert");
        request.setAttribute("deserts", deserts);
        request.getRequestDispatcher("/WEB-INF/game/mc_score3_slider.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/burger_value.third")) {
      String burgerNameY = request.getParameter("key2");
      int result = machine.updateGameStuff("burgerNameY", burgerNameY, request.getSession().getAttribute("personalCode").toString());
    } else if (cmd.equals("/snack_value.third")) {
      String sideNameY = request.getParameter("key2");
      int result = machine.updateGameStuff("sideNameY", sideNameY, request.getSession().getAttribute("personalCode").toString());
    } else if (cmd.equals("/beverage_value.third")) {
      String beverageNameY = request.getParameter("key2");
      int result = machine.updateGameStuff("beverageNameY", beverageNameY, request.getSession().getAttribute("personalCode").toString());
    } else if (cmd.equals("/cafe_value.third")) {
      String cafeNameY = request.getParameter("key2");
      int result = machine.updateGameStuff("cafeNameY", cafeNameY, request.getSession().getAttribute("personalCode").toString());
    } else if (cmd.equals("/desert_value.third")) {
      String desertNaemY = request.getParameter("key2");
      int result = machine.updateGameStuff("desertNaemY", desertNaemY, request.getSession().getAttribute("personalCode").toString());
    } else if (cmd.equals("/mc_slide.third")) {
      try {
        McdonaldDTO dto1 = machine.joinquery("burger", "burgerNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("burgerResult", dto1);
        McdonaldDTO dto2 = machine.joinquery("snack_side", "sideNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("sideResult", dto2);
        McdonaldDTO dto3 = machine.joinquery("beverage", "beverageNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("beverageResult", dto3);
        McdonaldDTO dto4 = machine.joinquery("mc_cafe", "cafeNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("cafeResult", dto4);
        McdonaldDTO dto5 = machine.joinquery("desert", "desertNaemY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("desertResult", dto5);
        request.getRequestDispatcher("/WEB-INF/game/mc_score3_almostdone.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/mc_fin.third")) {
      try {
        machine.updateEnd(request.getSession().getAttribute("personalCode").toString());
        McFinalDTO dto = machine.selectMcFinal(request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("dto", dto);
        long timeLast = dto.getEnd() - dto.getBegin();
        String time = null;
        if (0 < timeLast && timeLast < 60000) {
          time = timeLast / 1000 + "초 걸림";
        } else if (60000 < timeLast) {
          time = timeLast / (1000 * 60) + "분 걸림";
        }
        request.setAttribute("time", time);
        McdonaldDTO dto1 = machine.joinquery("burger", "burgerNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("burgerResult", dto1);
        McdonaldDTO dto2 = machine.joinquery("snack_side", "sideNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("sideResult", dto2);
        McdonaldDTO dto3 = machine.joinquery("beverage", "beverageNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("beverageResult", dto3);
        McdonaldDTO dto4 = machine.joinquery("mc_cafe", "cafeNameY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("cafeResult", dto4);
        McdonaldDTO dto5 = machine.joinquery("desert", "desertNaemY", request.getSession().getAttribute("personalCode").toString());
        request.setAttribute("desertResult", dto5);
        request.getRequestDispatcher("/WEB-INF/game/mc_score3_done.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    }


    //WEB-INF우회
    else if (cmd.equals("/startGame.third")) {
      request.getRequestDispatcher("/WEB-INF/game/mc_score3_start.jsp").forward(request, response);
      ;
    } else if (cmd.equals("/returnMain.third")) {
      request.getRequestDispatcher("/WEB-INF/main.jsp").forward(request, response);
      ;
    } else if (cmd.equals("/canclegame.third")) {
      request.getRequestDispatcher("/WEB-INF/game/game_start.jsp").forward(request, response);
      ;
    }


  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }

}
