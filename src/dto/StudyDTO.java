package dto;

import java.sql.Date;

public class StudyDTO {
  private int id;
  private String brand;
  private String answer;
  private Date comp_date;

  public StudyDTO() {
    super();
    // TODO Auto-generated constructor stub
  }

  public StudyDTO(int id, String brand, String answer, Date comp_date) {
    super();
    this.id = id;
    this.brand = brand;
    this.answer = answer;
    this.comp_date = comp_date;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getBrand() {
    return brand;
  }

  public void setBrand(String brand) {
    this.brand = brand;
  }

  public String getAnswer() {
    return answer;
  }

  public void setAnswer(String answer) {
    this.answer = answer;
  }

  public Date getComp_date() {
    return comp_date;
  }

  public void setComp_date(Date comp_date) {
    this.comp_date = comp_date;
  }
}
