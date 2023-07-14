package dto;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

public class FreeBoardDTO {
  private int seq;
  private String title;
  private String content;
  private String writer; // 이메일의 앞부분
  private int viewCount;
  private String ip;
  private Timestamp writeDate;
  private String timeForm;
  private int id;
  private String email;


  public FreeBoardDTO() {
    super();
    // TODO Auto-generated constructor stub
  }

  public FreeBoardDTO(int seq, String title, String content, String writer, int viewCount, String ip,
                      Timestamp writeDate, int id, String email) {
    super();
    this.seq = seq;
    this.title = title;
    this.content = content;
    this.writer = writer;
    this.viewCount = viewCount;
    this.ip = ip;
    this.writeDate = writeDate;
    this.id = id;
    this.email = email;
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

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getWriter() {
    return writer;
  }

  public void setWriter(String writer) {
    this.writer = writer;
  }

  public int getViewCount() {
    return viewCount;
  }

  public void setViewCount(int viewCount) {
    this.viewCount = viewCount;
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

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
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
