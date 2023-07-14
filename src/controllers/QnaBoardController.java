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

import dao.QnaBoardDAO;
import dao.QnaCommentsDAO;
import dto.FileDTO;

import dto.QnaBoardDTO;
import dto.QnaCommentsDTO;


@WebServlet("*.board02")
public class QnaBoardController extends HttpServlet {

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    response.setContentType("text/html;charset=utf-8");
    PrintWriter pw = null;
    try {
      pw = response.getWriter();
    } catch (IOException e1) {
      e1.printStackTrace();
      response.sendRedirect("error.html");
    }
    String requestURI = request.getRequestURI();
    String contextPath = request.getContextPath();
    String command = requestURI.substring(contextPath.length());
    QnaBoardDAO dao = new QnaBoardDAO();
    QnaCommentsDAO cdao = new QnaCommentsDAO();
    if (command.equals("/list.board02")) {//질문게시판 목록페이지로
      int recordCount = 0;
      int qnaCurrentPage = Integer.parseInt(request.getParameter("qnaCurrentPage"));
      request.getSession().setAttribute("qnaCurrentPage", qnaCurrentPage);

      List<QnaBoardDTO> qnaList = null;
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
          qnaList = dao.selectByPage(qnaCurrentPage);
          ;
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        String getNavi = null;
        try {
          getNavi = dao.getNavi(qnaCurrentPage); // 페이지 네비 보여주기
        } catch (Exception e) {
          e.printStackTrace();
          response.sendRedirect("error.html");
        }
        request.setAttribute("qnaList", qnaList);
        request.setAttribute("getNavi", getNavi);
      }
      request.getRequestDispatcher("/WEB-INF/board/qnaList.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/qnaWrite.board02")) {//건의 게시판 글작성 페이지로
      request.getRequestDispatcher("/WEB-INF/board/qnaWrite.jsp").forward(request, response);
//---------------------------------------------------------------------------------------------------------------------         
    } else if (command.equals("/imageUpload.board02")) {//서버에 이미지 업로드
      response.setCharacterEncoding("utf8");
      request.setCharacterEncoding("utf8");
      FileDTO fdto = new FileDTO();
      String rootPath = this.getServletContext().getRealPath("/"); // 서블릿에 대한 환경정보 꺼내옴 -> getRealPath: 코드가 실행되는 진짜 경로
      System.out.println(rootPath);
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
          response.setCharacterEncoding("utf8");

          String realFilePath = (String) request.getSession().getAttribute("email") + "/" + dateForderPath + "/" + tempFileName;
          System.out.println(realFilePath);
          fdto.getFilePath().add(realFilePath);//FileDTO에 파일 경로 담아줌 (arraylist)
          request.getSession().setAttribute("files", fdto); //세션에 파일 경로 담아줌
          response.getWriter().append(realFilePath);
        }
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
//---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/flag.board02")) {//flag 바꿔주기
      FileDTO fdto = (FileDTO) request.getSession().getAttribute("files");

      fdto.setFlag(true);

      fdto.setFilePath(null);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/qnaBaord.board02")) {//등록버튼 누르면
      String title = request.getParameter("title");
      String content = request.getParameter("inputContent");
      String email = (String) request.getSession().getAttribute("email");
      Pattern p = Pattern.compile("^[a-z0-9]*");
      Matcher m = p.matcher(email);
      m.find();
      String ip = request.getRemoteAddr();
      int id = (int) request.getSession().getAttribute("id");
      QnaBoardDTO dto = null;
      try {
        dto = new QnaBoardDTO(0, title, content, m.group(), 0, ip, null, email, id, null);
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
        response.sendRedirect("list.board02?qnaCurrentPage=" + request.getSession().getAttribute("qnaCurrentPage"));
      } else {
        System.out.println("입력안됨");
      }
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/deleteFile.board02")) {//서버에 있는 파일 삭제
      String rootPath = this.getServletContext().getRealPath("/");
      String imgPath = request.getParameter("img");
      FileDTO files = (FileDTO) request.getSession().getAttribute("files");
      boolean flag = files.isFlag();
      System.out.println("파일삭제:" + flag);
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
    } else if (command.equals("/qnaContent.board02")) {//글 내용 보기
      int seq = Integer.parseInt(request.getParameter("seq"));
      request.getSession().setAttribute("seq", seq);
      int countComment = 0;
      try {
        countComment = cdao.countComment(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      try {
        int viewCount = dao.viewCount(seq); //조회수 올리기
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      QnaBoardDTO content = null;
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
        List<QnaCommentsDTO> commentList = null;
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
      List<QnaCommentsDTO> commentList = null;
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

      request.getRequestDispatcher("/WEB-INF/board/qnaContent.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/deleteContent.board02")) { // 글 삭제
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
      request.getRequestDispatcher("list.board02?qnaCurrentPage=" + request.getSession().getAttribute("qnaCurrentPage")).forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/alterForm.board02")) {//글 수정하는 페이지로 이동
      int seq = Integer.parseInt(request.getParameter("seq"));
      request.getSession().setAttribute("seq", seq);
      QnaBoardDTO content = null;
      try {
        content = dao.content(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      request.setAttribute("content", content);
      request.getRequestDispatcher("/WEB-INF/board/qnaAlterContent.jsp").forward(request, response);

    } else if (command.equals("/alterContent.board02")) {//글 수정 완료버튼 누르면
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

      request.getRequestDispatcher("qnaContent.board02?commentPage=" + request.getSession().getAttribute("cmCurrnetPage") + "&&seq=" + seq).forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/comment.board02")) { // 댓글정보 디비에 넣기
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
      QnaCommentsDTO qcdto = new QnaCommentsDTO(0, comment, postNum, postTitle, writer, ip, null, email, id);
      int result = 0;
      try {
        result = cdao.insertComment(qcdto);
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
    } else if (command.equals("/wirteComment.board02")) {//댓글 등록하기 - 조회수 안 올라감!
      int seq = Integer.parseInt(request.getParameter("seq"));
      QnaBoardDTO content = null;
      try {
        content = dao.content(seq);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      int commentPage = Integer.parseInt(request.getParameter("commentPage")); //댓글 창 현재페이지
      System.out.println("commentPage");
      request.getSession().setAttribute("cmCurrnetPage", commentPage);
      List<QnaCommentsDTO> commentList = null;
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
      request.getRequestDispatcher("/WEB-INF/board/qnaContent.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------

    } else if (command.equals("/deleteComment.board02")) {//댓글 삭제하기
      int postNum = Integer.parseInt(request.getParameter("postNum"));
      int seq = (int) request.getSession().getAttribute("seq");
      System.out.println(seq);
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
      request.getRequestDispatcher("/qnaContent.board02?commentPage=" + request.getSession().getAttribute("cmCurrnetPage") + "&&seq=" + postNum).forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------

    } else if (command.equals("/alterComment.board02")) {//댓글 수정하기
      int seq = Integer.parseInt(request.getParameter("seq"));
      String comment = request.getParameter("comment");
      System.out.println(comment);

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
      //---------------------------------------------------------------------------------------------------------------------

    } else if (command.equals("/searchContent.board02")) { //검색버튼 누르면
      request.getSession().setAttribute("qnaCurrentPage", 1);
      int qnaCurrentPage = (int) request.getSession().getAttribute("qnaCurrentPage");
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
          List<QnaBoardDTO> qnaSelectList = null;
          try {
            qnaSelectList = dao.selectBySearchPage(qnaCurrentPage, searchWord, "title");
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          String getNaviSelect = null;
          try {
            getNaviSelect = dao.getNaviSelect(qnaCurrentPage, "title", searchWord); // 페이지 네비 보여주기
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("qnaList", qnaSelectList);
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
          List<QnaBoardDTO> qnaSelectList = null;
          try {
            qnaSelectList = dao.selectBySearchPage(qnaCurrentPage, searchWord, "writer");
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          String getNaviSelect = null;
          try {
            getNaviSelect = dao.getNaviSelect(qnaCurrentPage, "writer", searchWord); // 페이지 네비 보여주기
          } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("error.html");
          }
          request.setAttribute("qnaList", qnaSelectList);
          request.setAttribute("getNavi", getNaviSelect);
        }
      }


      request.getRequestDispatcher("/WEB-INF/board/qnaList.jsp").forward(request, response);
      //---------------------------------------------------------------------------------------------------------------------
    } else if (command.equals("/changeAnswer.board02")) {//관리자가 쓴 댓글 디비에 저장 -> answer y로 바꿔줌
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
      QnaCommentsDTO qcdto = new QnaCommentsDTO(0, comment, postNum, postTitle, writer, ip, null, email, id);
      int result = 0;
      try {
        result = cdao.insertComment(qcdto);
        int changeY = dao.changeAnswer(postNum);
      } catch (Exception e) {
        e.printStackTrace();
        response.sendRedirect("error.html");
      }
      if (result > 0) {
        System.out.println("등록");
      } else {
        System.out.println("등록 ㄴ");
      }

    }
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    // TODO Auto-generated method stub
    doGet(request, response);
  }
}