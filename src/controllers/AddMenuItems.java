package controllers;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import dao.MenuDataDAO;

@WebServlet("*.additems")
public class AddMenuItems extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setCharacterEncoding("utf8");
    PrintWriter out = response.getWriter();

    String cmd = request.getRequestURI().substring(request.getContextPath().length());
    MenuDataDAO machine = new MenuDataDAO();

    if (cmd.equals("/mc.additems")) {
      //100=버거/110=세트메뉴/140=맥모닝/130=행복의 나라 메뉴/180=해피밀/150=스낵과 사이드/190=맥카페/170=음료/160=디저트
      try {
        machine.mcSaveDB(100, "burger");
        machine.mcSaveDB(110, "set_menu");
        machine.mcSaveDB(140, "mc_morning");
        machine.mcSaveDB(130, "happy");
        machine.mcSaveDB(180, "happy_meal");
        machine.mcSaveDB(150, "snack_side");
        machine.mcSaveDB(190, "mc_cafe");
        machine.mcSaveDB(170, "beverage");
        machine.mcSaveDB(160, "desert");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        request.getRequestDispatcher("error.html").forward(request, response);
      }
    } else if (cmd.equals("/updatemc.additems")) {
      try {
        machine.mcUpdateDB("burger");
        machine.mcUpdateDB("set_menu");
        machine.mcUpdateDB("mc_morning");
        machine.mcUpdateDB("happy");
        machine.mcUpdateDB("happy_meal");
        machine.mcUpdateDB("snack_side");
        machine.mcUpdateDB("mc_cafe");
        machine.mcUpdateDB("beverage");
        machine.mcUpdateDB("desert");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/coffee.additems")) {
      //espresso.do //signature.do //hollyccino.do //tea.do //bakery.do
      try {
        machine.mcSaveDB_coffee("coffee_coffee", "espresso.do");
        machine.mcSaveDB_coffee("coffee_latte", "signature.do");
        machine.mcSaveDB_coffee("coffee_holly", "hollyccino.do");
        machine.mcSaveDB_coffee("coffee_tea", "tea.do");
        machine.mcSaveDB_coffee("coffee_bakery", "bakery.do");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();

        request.getRequestDispatcher("error.html").forward(request, response);
      }
    } else if (cmd.equals("/updatecoffee.additems")) {
      try {
        machine.mcUpdateDB("coffee_coffee");
        machine.mcUpdateDB("coffee_latte");
        machine.mcUpdateDB("coffee_holly");
        machine.mcUpdateDB("coffee_tea");
        machine.mcUpdateDB("coffee_bakery");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/lotte.additems")) {
      try {
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(10)", "lotte_burgerset");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(12)", "lotte_chickenset");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(14)", "lotte_good");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(16)", "lotte_burger");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(18)", "lotte_chicken");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(20)", "lotte_desert");
        machine.mcSaveDB_lotte("#frmNavi > div:nth-child(22)", "lotte_drink");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        request.getRequestDispatcher("error.html").forward(request, response);


      }
    } else if (cmd.equals("/updatelotte.additems")) {
      try {
        machine.mcUpdateDB("lotte_burgerset");
        machine.mcUpdateDB("lotte_chickenset");
        machine.mcUpdateDB("lotte_good");
        machine.mcUpdateDB("lotte_burger");
        machine.mcUpdateDB("lotte_chicken");
        machine.mcUpdateDB("lotte_desert");
        machine.mcUpdateDB("lotte_drink");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    } else if (cmd.equals("/pizza.additems")) {
      //C0101,C0102,C0104,C0201,C0202,C0203
      try {
        machine.mcSaveDB_pizza("pizza_seed", "C0101");
        machine.mcSaveDB_pizza("pizza_prm", "C0102");
        machine.mcSaveDB_pizza("pizza_cls", "C0104");
        machine.mcSaveDB_pizzads("pizza_side", "C0201");
        machine.mcSaveDB_pizzads("pizza_beverage", "C0202");
        machine.mcSaveDB_pizzads("pizza_souce", "C0203");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        request.getRequestDispatcher("error.html").forward(request, response);
      }
    } else if (cmd.equals("/updatepizza.additems")) {
      try {
        machine.mcUpdateDB("lotte_burgerset");
        machine.mcUpdateDB("lotte_chickenset");
        machine.mcUpdateDB("lotte_good");
        machine.mcUpdateDB("lotte_burger");
        machine.mcUpdateDB("lotte_chicken");
        machine.mcUpdateDB("lotte_desert");
        machine.mcUpdateDB("lotte_drink");
        request.getRequestDispatcher("db.jsp").forward(request, response);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
    }

  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }

}
