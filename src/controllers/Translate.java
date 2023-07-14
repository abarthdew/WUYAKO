package controllers;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import dao.MenuDataDAO;
import dao.WebApiDAO;
import dto.McdonaldDTO;


@WebServlet("*.go")
public class Translate extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setCharacterEncoding("utf8");
    PrintWriter pw = response.getWriter();
    String cmd = request.getRequestURI().substring(request.getContextPath().length());
    MenuDataDAO machine = new MenuDataDAO();

    if (cmd.equals("/papago.go")) {
      JsonParser parser = new JsonParser();
      String msg = request.getParameter("source");
      WebApiDAO p = new WebApiDAO();
      String rst = p.translate(msg, "ko", "en");
      System.out.println(rst);
      String translate = null;
      try {
        JsonObject root = parser.parse(rst).getAsJsonObject();
        JsonObject message = root.get("message").getAsJsonObject();
        JsonObject result = message.get("result").getAsJsonObject();
        translate = result.get("translatedText").toString();

        String rst2 = p.translate(msg, "en", "ko");
        JsonObject root2 = parser.parse(rst2).getAsJsonObject();
        JsonObject message2 = root2.get("message").getAsJsonObject();
        JsonObject result2 = message2.get("result").getAsJsonObject();
        translate = result2.get("translatedText").toString();
        pw.append(translate);
      } catch (Exception e) {
        pw.print("잘못된 접근입니다. 다시 입력하세요.");
      }
    } else if (cmd.equals("/menupapago.go")) {
      JsonParser parser = new JsonParser();
      String msg = request.getParameter("key");
      WebApiDAO p = new WebApiDAO();
      String rst = p.translate(msg, "en", "ko");
      String translate = null;
      try {
        JsonObject root = parser.parse(rst).getAsJsonObject();
        JsonObject message = root.get("message").getAsJsonObject();
        JsonObject result = message.get("result").getAsJsonObject();
        translate = result.get("translatedText").toString();

//					String rst2 = p.translate(msg, "en", "ko");
//					JsonObject root2 = parser.parse(rst2).getAsJsonObject();
//					JsonObject message2 = root2.get("message").getAsJsonObject();
//					JsonObject result2 = message2.get("result").getAsJsonObject();
//					translate = result2.get("translatedText").toString();
        pw.append(translate);
      } catch (Exception e) {
        pw.print("잘못된 접근입니다. 다시 입력하세요." + "<br>");
      }
    } else if (cmd.equals("/translateMenu.go")) {
      try {
        //
        ArrayList<McdonaldDTO> burgers = machine.getAllInfo("burger");
        request.setAttribute("burgers", burgers);
        ArrayList<McdonaldDTO> set_menus = machine.getAllInfo("set_menu");
        request.setAttribute("set_menus", set_menus);
        ArrayList<McdonaldDTO> mc_mornings = machine.getAllInfo("mc_morning");
        request.setAttribute("mc_mornings", mc_mornings);
        ArrayList<McdonaldDTO> happys = machine.getAllInfo("happy");
        request.setAttribute("happys", happys);
        ArrayList<McdonaldDTO> happy_meals = machine.getAllInfo("happy_meal");
        request.setAttribute("happy_meals", happy_meals);
        ArrayList<McdonaldDTO> snack_sides = machine.getAllInfo("snack_side");
        request.setAttribute("snack_sides", snack_sides);
        ArrayList<McdonaldDTO> mc_cafes = machine.getAllInfo("mc_cafe");
        request.setAttribute("mc_cafes", mc_cafes);
        ArrayList<McdonaldDTO> beverages = machine.getAllInfo("beverage");
        request.setAttribute("beverages", beverages);
        ArrayList<McdonaldDTO> deserts = machine.getAllInfo("desert");
        request.setAttribute("deserts", deserts);
        //
//					ArrayList<McdonaldDTO> coffee_coffees = machine.getAllInfo("coffee_coffee");
//					request.setAttribute("coffee_coffees", coffee_coffees);
//					ArrayList<McdonaldDTO> coffee_lattes = machine.getAllInfo("coffee_latte");
//					request.setAttribute("coffee_lattes", coffee_lattes);
//					ArrayList<McdonaldDTO> coffee_hollys = machine.getAllInfo("coffee_holly");
//					request.setAttribute("coffee_hollys", coffee_hollys);
//					ArrayList<McdonaldDTO> coffee_teas = machine.getAllInfo("coffee_tea");
//					request.setAttribute("coffee_teas", coffee_teas);
//					ArrayList<McdonaldDTO> coffee_bakerys = machine.getAllInfo("coffee_bakery");
//					request.setAttribute("coffee_bakerys", coffee_bakerys);
        //
//					ArrayList<McdonaldDTO> lotte_burgersets = machine.getAllInfo("lotte_burgerset");
//					request.setAttribute("lotte_burgersets", lotte_burgersets);
//					ArrayList<McdonaldDTO> lotte_chickensets = machine.getAllInfo("lotte_chickenset");
//					request.setAttribute("lotte_chickensets", lotte_chickensets);
//					ArrayList<McdonaldDTO> lotte_goods = machine.getAllInfo("lotte_good");
//					request.setAttribute("lotte_goods", lotte_goods);
//					ArrayList<McdonaldDTO> lotte_burgers = machine.getAllInfo("lotte_burger");
//					request.setAttribute("lotte_burgers", lotte_burgers);
//					ArrayList<McdonaldDTO> lotte_chickens = machine.getAllInfo("lotte_chicken");
//					request.setAttribute("lotte_chickens", lotte_chickens);
//					ArrayList<McdonaldDTO> lotte_deserts = machine.getAllInfo("lotte_desert");
//					request.setAttribute("lotte_deserts", lotte_deserts);
//					ArrayList<McdonaldDTO> lotte_drinks = machine.getAllInfo("lotte_drink");
//					request.setAttribute("lotte_drinks", lotte_drinks);
        //
//					ArrayList<McdonaldDTO> pizza_seeds = machine.getAllInfo("pizza_seed");
//					request.setAttribute("pizza_seeds", pizza_seeds);
//					ArrayList<McdonaldDTO> pizza_prms = machine.getAllInfo("pizza_prm");
//					request.setAttribute("pizza_prms", pizza_prms);
//					ArrayList<McdonaldDTO> pizza_clss = machine.getAllInfo("pizza_cls");
//					request.setAttribute("pizza_clss", pizza_clss);
//					ArrayList<McdonaldDTO> pizza_sides = machine.getAllInfo("pizza_side");
//					request.setAttribute("pizza_sides", pizza_sides);
//					ArrayList<McdonaldDTO> pizza_beverages = machine.getAllInfo("pizza_beverage");
//					request.setAttribute("pizza_beverages", pizza_beverages);
//					ArrayList<McdonaldDTO> pizza_souces = machine.getAllInfo("pizza_souce");
//					request.setAttribute("pizza_souces", pizza_souces);
        request.getRequestDispatcher("/WEB-INF/game/game_start.jsp").forward(request, response);
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
