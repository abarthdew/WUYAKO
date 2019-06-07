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

@WebServlet("*.kiosk")
public class MachineController extends HttpServlet {
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("utf8");
		PrintWriter out = response.getWriter();
		
		String cmd = request.getRequestURI().substring(request.getContextPath().length());
		MenuDataDAO machine = new MenuDataDAO();
		
//		int[] randomNumber = new int[] {1000, 1500, 2000, 3500, 4500, 5800, 6300, 7000};
//		int num = randomNumber[(int) (Math.floor(Math.random()*(randomNumber.length-1)+1))];
		
		if(cmd.equals("/burger_morning.kiosk")) {
			//100=버거/110=세트메뉴/140=맥모닝/130=행복의 나라 메뉴/180=해피밀/150=스낵과 사이드/190=맥카페/170=음료/160=디저트
			try {
				machine.mcSaveDB(100, "burger");
				machine.mcSaveDB(110, "set_menu");
				machine.mcSaveDB(140, "mc_morning");
				request.getRequestDispatcher("db.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				request.getRequestDispatcher("error.jsp").forward(request, response);
			}
		}else if(cmd.equals("/happy_snack.kiosk")) { 
			try {
				machine.mcSaveDB(130, "happy");
				machine.mcSaveDB(180, "happy_meal");
				machine.mcSaveDB(150, "snack_side");
				request.getRequestDispatcher("db.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				request.getRequestDispatcher("error.jsp").forward(request, response);
			}
		}else if(cmd.equals("/cafe_desert.kiosk")) {
			try {
				machine.mcSaveDB(190, "mc_cafe");
				machine.mcSaveDB(170, "beverage");
				machine.mcSaveDB(160, "desert");
				request.getRequestDispatcher("db.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				request.getRequestDispatcher("error.html").forward(request, response);
			}
		}else if(cmd.equals("/updateTableNull.kiosk")) {
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
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/getCode.kiosk")) {
				String personalCode = machine.personalCode();
			try {
				machine.insertGameCode(personalCode);
				request.getSession().setAttribute("personalCode", personalCode);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_2.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/mc_mainMenu.kiosk")) {
			try {
				ArrayList<McdonaldDTO> burgers = machine.getMcInfo("burger");
				request.setAttribute("burgers", burgers);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_3.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/mc_sideMenu.kiosk")) {
			try {
				ArrayList<McdonaldDTO> snack_sides = machine.getMcInfo("snack_side");
				request.setAttribute("snack_sides", snack_sides);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_4.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/mc_beverage.kiosk")) {
			try {
				ArrayList<McdonaldDTO> beverages = machine.getMcInfo("beverage");
				request.setAttribute("beverages", beverages);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_5.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/mc_slide.kiosk")) {
			try {
				McdonaldDTO dto1 = machine.joinquery("burger", "burgerNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("burgerResult", dto1);
				McdonaldDTO dto2 = machine.joinquery("snack_side", "sideNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("sideResult", dto2);
				McdonaldDTO dto3 = machine.joinquery("beverage", "beverageNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("beverageResult", dto3);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_6.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/mc_fin.kiosk")) {
			try {
				machine.updateEnd(request.getSession().getAttribute("personalCode").toString());
				McFinalDTO dto = machine.selectMcFinal(request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("dto", dto);
				long timeLast = dto.getEnd()-dto.getBegin();
				String time = null;
					if(0 < timeLast && timeLast < 60000) {
						time = timeLast / 1000 + "초 걸림";
					}else if(60000 < timeLast){
						time = timeLast / (1000 * 60) + "분 걸림";
					}
				request.setAttribute("time", time);
				McdonaldDTO dto1 = machine.joinquery("burger", "burgerNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("burgerResult", dto1);
				McdonaldDTO dto2 = machine.joinquery("snack_side", "sideNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("sideResult", dto2);
				McdonaldDTO dto3 = machine.joinquery("beverage", "beverageNameY", request.getSession().getAttribute("personalCode").toString());
				request.setAttribute("beverageResult", dto3);
				request.getRequestDispatcher("/WEB-INF/game/mc_score1_7.jsp").forward(request, response);
			}catch(Exception e) {
				e.printStackTrace();
				response.sendRedirect("error.html");
			}
		}else if(cmd.equals("/takeio.kiosk")) {
			String takeIOM = request.getParameter("key1");
			String takeIOY = request.getParameter("key2");
			int result = machine.updateGameStuff("takeIOM", takeIOM, "takeIOY", takeIOY, request.getSession().getAttribute("personalCode").toString());
			if(result>0) {
				out.print("다음 단계로 넘어갑니다");
			}else {
				out.print("오류발생");
			}	
		}else if(cmd.equals("/burger_value.kiosk")) {
			String burgerNameM = request.getParameter("key1");
			String burgerNameY = request.getParameter("key2");
			int result = machine.updateGameStuff("burgerNameM", burgerNameM, "burgerNameY", burgerNameY, request.getSession().getAttribute("personalCode").toString());
			if(result>0) {
				out.print("다음 단계로 넘어갑니다");
			}else {
				out.print("오류발생");
			}	
		}else if(cmd.equals("/snack_value.kiosk")) {
			String sideNameM = request.getParameter("key1");
			String sideNameY = request.getParameter("key2");
			int result = machine.updateGameStuff("sideNameM", sideNameM, "sideNameY", sideNameY, request.getSession().getAttribute("personalCode").toString());
			if(result>0) {
				out.print("다음 단계로 넘어갑니다");
			}else {
				out.print("오류발생");
			}	
		}else if(cmd.equals("/beverage_value.kiosk")) {
			String beverageNameM = request.getParameter("key1");
			String beverageNameY = request.getParameter("key2");
			int result = machine.updateGameStuff("beverageNameM", beverageNameM, "beverageNameY", beverageNameY, request.getSession().getAttribute("personalCode").toString());
			if(result>0) {
				out.print("다음 단계로 넘어갑니다");
			}else {
				out.print("오류발생");
			}	
		}else if(cmd.equals("/session_end.kiosk")) { //게임종료 후 세션 속성 지우기
			request.getSession().removeAttribute("personalCode");
		}
		
		//WEB-INF우회
		else if(cmd.equals("/startGame.kiosk")) {
			request.getRequestDispatcher("/WEB-INF/game/mc_score1_1.jsp").forward(request, response);
		}else if(cmd.equals("/returnMain.kiosk")) {
			request.getRequestDispatcher("/WEB-INF/main.jsp").forward(request, response);
		}
		///////
		
		
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
