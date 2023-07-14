package controllers;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import dao.FreeBoardDAO;
import dao.FreeCommentsDAO;
import dto.FileDTO;
import dto.FreeBoardDTO;
import dto.FreeCommentsDTO;

@WebServlet("*.board01")
public class FreeBoardController extends HttpServlet {
  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    response.setContentType("text/html;charset=utf-8");
    PrintWriter pw = response.getWriter();
    String requestURI = request.getRequestURI();
    String contextPath = request.getContextPath();
    String command = requestURI.substring(contextPath.length());
    FreeBoardDAO dao = new FreeBoardDAO();
    FreeCommentsDAO cdao = new FreeCommentsDAO();

    if (command.equals("/list.board01")) {//자유게시판 목록페이지로
      int recordCount = 0;
      int freeCurrentPage = Integer.parseInt(request.getParameter("freeCurrentPage"));
      request.getSession().setAttribute("freeCurrentPage", freeCurrentPage);

      List<FreeBoardDTO> freeList = null;
      try {
        recordCount = dao.recordCount();
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }

      if (recordCount == 0) {
        request.setAttribute("recordCount", recordCount);
      } else {
        try {
          freeList = dao.selectByPage(freeCurrentPage);
          ;
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        String getNavi = null;
        try {
          getNavi = dao.getNavi(freeCurrentPage); // 페이지 네비 보여주기
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        request.setAttribute("freeList", freeList);
        request.setAttribute("getNavi", getNavi);
      }
      request.getRequestDispatcher("/WEB-INF/board/freeList.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/freeWrite.board01")) {//자유게시판 글작성 페이지로
      request.getRequestDispatcher("/WEB-INF/board/freeWrite.jsp").forward(request, response);
      ;
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/imageUpload.board01")) {//서버에 이미지 업로드
      response.setCharacterEncoding("utf8");
      FileDTO fdto = new FileDTO();
      String rootPath = this.getServletContext().getRealPath("/"); // 서블릿에 대한 환경정보 꺼내옴 -> getRealPath: 코드가 실행되는 진짜 경로
      String nickForderPath = rootPath + (String) request.getSession().getAttribute("email");
      String dateForderPath = new SimpleDateFormat("yyyyMMdd").format(new java.util.Date());
      String filePath = nickForderPath + "/" + dateForderPath; // 파일이 업로드될 경로
      File uploadPath = new File(filePath);
      if (!uploadPath.exists()) {// 폴더 생성
        uploadPath.mkdir();
      }
      DiskFileItemFactory diskFactory = new DiskFileItemFactory();
      diskFactory.setRepository(new File(rootPath + "/WEB-INF/temp")); // 임시폴더 생성
      ServletFileUpload sfu = new ServletFileUpload(diskFactory);
      sfu.setSizeMax(10 * 1024 * 1024);
      try {
        List<FileItem> items = sfu.parseRequest(request);
        for (FileItem fi : items) {
          if (fi.getSize() == 0) {
            continue;
          } // 파일사이즈가 0이라면(파일이 없다면) continue
          String tempFileName = null;
          while (true) {
            try {
              long tempTime = System.currentTimeMillis(); //
              tempFileName = tempTime + "_" + fi.getName(); //파일이름설정
              fi.write(new File(filePath + "/" + tempFileName)); // 경로에 파일 저장
              break;
            } catch (Exception e) {
              break;
            }
          }
          String realFilePath = (String) request.getSession().getAttribute("email") + "/" + dateForderPath + "/" + tempFileName;
          fdto.getFilePath().add(realFilePath);//FileDTO에 파일 경로 담아줌 (arraylist)
          request.getSession().setAttribute("files", fdto); //세션에 파일 경로 담아줌
          response.getWriter().append(realFilePath);
        }
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/flag.board01")) {//flag 바꿔주기
      FileDTO fdto = (FileDTO) request.getSession().getAttribute("files");
      fdto.setFlag(true);
      fdto.setFilePath(null);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/freeBaord.board01")) {//등록버튼 누르면
      String title = request.getParameter("title");
      String content = request.getParameter("inputContent");
      String email = (String) request.getSession().getAttribute("email");
      Pattern p = Pattern.compile("^[a-z0-9]*");
      Matcher m = p.matcher(email);
      m.find();
      String ip = request.getRemoteAddr();
      int id = (int) request.getSession().getAttribute("id");
      FreeBoardDTO dto = null;
      try {
        dto = new FreeBoardDTO(0, title, content, m.group(), 0, ip, null, id, email);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      int result = 0;
      try {
        result = dao.insert(dto); // 데이터베이스에 게시물 정보 담기
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      request.setAttribute("result", result);
      if (result > 0) {
        response.sendRedirect("list.board01?freeCurrentPage=" + request.getSession().getAttribute("freeCurrentPage"));
      } else {
        System.out.println("입력안됨");
      }
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/deleteFile.board01")) {//서버에 있는 파일 삭제
      String rootPath = this.getServletContext().getRealPath("/");
      String imgPath = request.getParameter("img");
      FileDTO files = (FileDTO) request.getSession().getAttribute("files");
      boolean flag = files.isFlag();
      if (flag == false) {
        File file = new File(rootPath + imgPath);
        if (file.exists()) { // 이미지가 서버에 존재 할 경우
          if (file.delete()) {
            System.out.println("파일삭제성공");
          } else {

            System.out.println("파일삭제실패");
          }
        } else {
          System.out.println("파일존재안함");
        }
      }
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/freeContent.board01")) {//글 내용보기
      int seq = Integer.parseInt(request.getParameter("seq"));
      request.getSession().setAttribute("seq", seq);

      int countComment = 0;
      try {
        countComment = cdao.countComment(seq);
      } catch (Exception e) {
        e.printStackTrace();
      }
      try {
        int viewCount = dao.viewCount(seq); //조회수 올리기
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      FreeBoardDTO content = null;
      try {
        content = dao.content(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      request.setAttribute("content", content);

      if (countComment == 0) { // 댓글이 없다면
        request.setAttribute("countComment", countComment);
      } else {
        int commentPage = Integer.parseInt(request.getParameter("commentPage")); //댓글 창 현재페이지
        System.out.println("commentPage");
        request.getSession().setAttribute("cmCurrnetPage", commentPage);
        List<FreeCommentsDTO> commentList = null;
        try {
          commentList = cdao.selectByComment(commentPage, seq);// 댓글 목록 불러오기
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }

        String navi = null;
        try {
          navi = cdao.getNavi(commentPage, seq);
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        request.setAttribute("comList", commentList);
        request.setAttribute("navi", navi);
      }

      int commentPage = Integer.parseInt(request.getParameter("commentPage")); //댓글 창 현재페이지
      request.getSession().setAttribute("cmCurrnetPage", commentPage);
      List<FreeCommentsDTO> commentList = null;
      try {
        commentList = cdao.selectByComment(commentPage, seq);// 댓글 목록 불러오기
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      String navi = null;
      try {
        navi = cdao.getNavi(commentPage, seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      request.setAttribute("content", content);
      request.setAttribute("comList", commentList);
      request.setAttribute("navi", navi);

      request.getRequestDispatcher("/WEB-INF/board/freeContent.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/deleteContent.board01")) { // 글 삭제
      int seq = (int) request.getSession().getAttribute("seq");
      System.out.println(seq);
      int result = 0;
      try {
        result = dao.deleteContent(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      if (result > 0) {
        System.out.println("삭제");
      } else {
        System.out.println("삭제 ㄴ");
      }
      request.getRequestDispatcher("list.board01?freeCurrentPage=" + request.getSession().getAttribute("freeCurrentPage")).forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/alterForm.board01")) {//글 수정하는 페이지로 이동

      int seq = Integer.parseInt(request.getParameter("seq"));
      request.getSession().setAttribute("seq", seq);
      FreeBoardDTO content = null;
      try {
        content = dao.content(seq);

      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }

      request.setAttribute("content", content);
      request.getRequestDispatcher("/WEB-INF/board/freeAlterContent.jsp").forward(request, response);

    } else if (command.equals("/alterContent.board01")) {//글 수정 완료버튼 누르면
      int seq = (int) request.getSession().getAttribute("seq"); // 글번호
      String title = request.getParameter("title");
      String content = request.getParameter("inputContent");
      int result = 0;
      try {
        result = dao.alterContent(title, content, seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }

      request.getRequestDispatcher("freeContent.board01?commentPage=" + request.getSession().getAttribute("cmCurrnetPage") + "&&seq=" + seq).forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/comment.board01")) { // 댓글정보 디비에 넣기
      String comments = request.getParameter("comments");
      JsonParser jp = new JsonParser();
      JsonObject root = jp.parse(comments).getAsJsonObject();
      String comment = root.get("comment").getAsString(); // 댓글
      int postNum = Integer.parseInt(root.get("postNum").getAsString()); // 글번호
      String postTitle = root.get("postTitle").getAsString();//글제목
      String email = (String) request.getSession().getAttribute("email");//댓글쓴사람 이메일
      Pattern p = Pattern.compile("^[a-z0-9]*");
      Matcher m = p.matcher(email); // 이메일 앞부분 -작성자
      m.find();
      String writer = m.group();//댓글 쓴 사람
      System.out.println(writer);
      String ip = request.getRemoteAddr();
      int id = (int) request.getSession().getAttribute("id");
      FreeCommentsDTO fcdto = new FreeCommentsDTO(0, comment, postNum, postTitle, writer, ip, null, email, id);
      int result = 0;
      try {
        result = cdao.insertComment(fcdto);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      if (result > 0) {
        System.out.println("등록");
      } else {
        System.out.println("등록 ㄴ");
      }
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/wirteComment.board01")) {//댓글 등록하기 - 조회수 안 올라감!
      int seq = Integer.parseInt(request.getParameter("seq"));
      FreeBoardDTO content = null;
      try {
        content = dao.content(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      int commentPage = Integer.parseInt(request.getParameter("commentPage")); //댓글 창 현재페이지
      System.out.println("commentPage");
      request.getSession().setAttribute("cmCurrnetPage", commentPage);
      List<FreeCommentsDTO> commentList = null;
      try {
        commentList = cdao.selectByComment(commentPage, seq);// 댓글 목록 불러오기
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      String navi = null;
      try {
        navi = cdao.getNavi(commentPage, seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      request.setAttribute("content", content);
      request.setAttribute("comList", commentList);
      request.setAttribute("navi", navi);
      request.getRequestDispatcher("/WEB-INF/board/freeContent.jsp").forward(request, response);
    } else if (command.equals("/deleteComment.board01")) {//댓글 삭제하기
      int postNum = Integer.parseInt(request.getParameter("postNum"));
      int seq = Integer.parseInt(request.getParameter("seq"));
      int result = 0;
      try {
        result = cdao.deleteComment(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      if (result > 0) {
        System.out.println("댓글삭제");
      } else {
        System.out.println("댓글삭제 ㄴ");
      }
      request.getRequestDispatcher("/freeContent.board01?commentPage=" + request.getSession().getAttribute("cmCurrnetPage") + "&&seq=" + postNum).forward(request, response);
    } else if (command.equals("/alterComment.board01")) {//댓글 수정하기
      int seq = Integer.parseInt(request.getParameter("seq"));
      String comment = request.getParameter("comment");
      int result = 0;
      try {
        result = cdao.alterComment(seq, comment);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      if (result > 0) {
        System.out.println("수정 됨");
        pw.write("수정됨");
      } else {
        System.out.println("수정 안됨 ㅠ");
        pw.write("수정안됨");
      }
    } else if (command.equals("/searchContent.board01")) { //검색버튼 누르면
      request.getSession().setAttribute("freeCurrentPage", 1);
      int freeCurrentPage = (int) request.getSession().getAttribute("freeCurrentPage");
      String searchWord = request.getParameter("searchWord");
      String option = request.getParameter("option");

      if (option.equals("글제목")) {
        int recordCount = 0;
        try {
          recordCount = dao.selectCount(searchWord, "title");
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }

        if (recordCount == 0) {
          request.setAttribute("recordCount", recordCount);
        } else {
          List<FreeBoardDTO> freeSelectList = null;
          try {
            freeSelectList = dao.selectBySearchPage(freeCurrentPage, searchWord, "title");
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          String getNaviSelect = null;
          try {
            getNaviSelect = dao.getNaviSelect(freeCurrentPage, "title", searchWord); // 페이지 네비 보여주기
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("freeList", freeSelectList);
          request.setAttribute("getNavi", getNaviSelect);
        }
      } else if (option.equals("작성자")) {
        int recordCount = 0;
        try {
          recordCount = dao.selectCount(searchWord, "writer");
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        if (recordCount == 0) {
          request.setAttribute("recordCount", recordCount);
        } else {
          List<FreeBoardDTO> freeSelectList = null;
          try {
            freeSelectList = dao.selectBySearchPage(freeCurrentPage, searchWord, "writer");
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          String getNaviSelect = null;
          try {
            getNaviSelect = dao.getNaviSelect(freeCurrentPage, "writer", searchWord); // 페이지 네비 보여주기
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("freeList", freeSelectList);
          request.setAttribute("getNavi", getNaviSelect);
        }
      }


      request.getRequestDispatcher("/WEB-INF/board/freeList.jsp").forward(request, response);
    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    doGet(request, response);
  }
}