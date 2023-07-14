package dto;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class FreeCommentsDTO {
  private int seq;
  private String comment;
  private int postNum;
  private String postTitle;
  private String writer;
  private String ip;
  private Timestamp writeDate;
  private String email;
  private int id;
  private String timeForm;


  public FreeCommentsDTO() {
    super();
    // TODO Auto-generated constructor stub
  }

  public FreeCommentsDTO(int seq, String comment, int postNum, String postTitle, String writer, String ip,
                         Timestamp writeDate, String email, int id) {
    super();
    this.seq = seq;
    this.comment = comment;
    this.postNum = postNum;
    this.postTitle = postTitle;
    this.writer = writer;
    this.ip = ip;
    this.writeDate = writeDate;
    this.email = email;
    this.id = id;
    if (writeDate != null) {
      this.timeForm = getFormedTime();
    }
  }

  public int getSeq() {
    return seq;
  }

  public void setSeq(int seq) {
    this.seq = seq;
  }

  public String getComment() {
    return comment;
  }

  public void setComment(String comment) {
    this.comment = comment;
  }

  public int getPostNum() {
    return postNum;
  }

  public void setPostNum(int postNum) {
    this.postNum = postNum;
  }

  public String getPostTitle() {
    return postTitle;
  }

  public void setPostTitle(String postTitle) {
    this.postTitle = postTitle;
  }

  public String getWriter() {
    return writer;
  }

  public void setWriter(String writer) {
    this.writer = writer;
  }

  public String getIp() {
    return ip;
  }

  public void setIp(String ip) {
    this.ip = ip;
  }

  public Timestamp getWriteDate() {
    return writeDate;
  }

  public void setWriteDate(Timestamp writeDate) {
    this.writeDate = writeDate;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getTimeForm() {
    return timeForm;
  }

  public String getFormedTime() {
    long currentTime = System.currentTimeMillis();
    long writeTime = this.writeDate.getTime();

    if (currentTime - writeTime < (1000 * 60 * 60)) {
      long time = currentTime - writeTime;
      return time / 1000 / 60 + "분 전";
    } else if (currentTime - writeTime < (1000 * 60 * 60 * 24)) {
      long time = currentTime - writeTime;
      return time / 1000 / 60 / 60 + "시간 전";
    } else {
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd");
      return sdf.format(writeDate);
    }

  }
}