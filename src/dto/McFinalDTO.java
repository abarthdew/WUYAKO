package dto;

import java.sql.Date;
import java.sql.Timestamp;

public class McFinalDTO {
  private String code;
  private String takeIOM;
  private String takeIOY;
  private String burgerNameM;
  private String burgerNameY;
  private String sideNameM;
  private String sideNameY;
  private String cafeNameM;
  private String cafeNameY;
  private String beverageNameM;
  private String beverageNameY;
  private String desertNameM;
  private String desertNaemY;
  private long begin;
  private long end;
  private Date today;

  public McFinalDTO() {
    super();
  }

  public McFinalDTO(String code, String takeIOM, String takeIOY, String burgerNameM, String burgerNameY,
                    String sideNameM, String sideNameY, String cafeNameM, String cafeNameY, String beverageNameM,
                    String beverageNameY, String desertNameM, String desertNaemY, long begin, long end, Date today) {
    super();
    this.code = code;
    this.takeIOM = takeIOM;
    this.takeIOY = takeIOY;
    this.burgerNameM = burgerNameM;
    this.burgerNameY = burgerNameY;
    this.sideNameM = sideNameM;
    this.sideNameY = sideNameY;
    this.cafeNameM = cafeNameM;
    this.cafeNameY = cafeNameY;
    this.beverageNameM = beverageNameM;
    this.beverageNameY = beverageNameY;
    this.desertNameM = desertNameM;
    this.desertNaemY = desertNaemY;
    this.begin = begin;
    this.end = end;
    this.today = today;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getTakeIOM() {
    return takeIOM;
  }

  public void setTakeIOM(String takeIOM) {
    this.takeIOM = takeIOM;
  }

  public String getTakeIOY() {
    return takeIOY;
  }

  public void setTakeIOY(String takeIOY) {
    this.takeIOY = takeIOY;
  }

  public String getBurgerNameM() {
    return burgerNameM;
  }

  public void setBurgerNameM(String burgerNameM) {
    this.burgerNameM = burgerNameM;
  }

  public String getBurgerNameY() {
    return burgerNameY;
  }

  public void setBurgerNameY(String burgerNameY) {
    this.burgerNameY = burgerNameY;
  }

  public String getSideNameM() {
    return sideNameM;
  }

  public void setSideNameM(String sideNameM) {
    this.sideNameM = sideNameM;
  }

  public String getSideNameY() {
    return sideNameY;
  }

  public void setSideNameY(String sideNameY) {
    this.sideNameY = sideNameY;
  }

  public String getCafeNameM() {
    return cafeNameM;
  }

  public void setCafeNameM(String cafeNameM) {
    this.cafeNameM = cafeNameM;
  }

  public String getCafeNameY() {
    return cafeNameY;
  }

  public void setCafeNameY(String cafeNameY) {
    this.cafeNameY = cafeNameY;
  }

  public String getBeverageNameM() {
    return beverageNameM;
  }

  public void setBeverageNameM(String beverageNameM) {
    this.beverageNameM = beverageNameM;
  }

  public String getBeverageNameY() {
    return beverageNameY;
  }

  public void setBeverageNameY(String beverageNameY) {
    this.beverageNameY = beverageNameY;
  }

  public String getDesertNameM() {
    return desertNameM;
  }

  public void setDesertNameM(String desertNameM) {
    this.desertNameM = desertNameM;
  }

  public String getDesertNaemY() {
    return desertNaemY;
  }

  public void setDesertNaemY(String desertNaemY) {
    this.desertNaemY = desertNaemY;
  }

  public long getBegin() {
    return begin;
  }

  public void setBegin(long begin) {
    this.begin = begin;
  }

  public long getEnd() {
    return end;
  }

  public void setEnd(long end) {
    this.end = end;
  }

  public Date getToday() {
    return today;
  }

  public void setToday(Date today) {
    this.today = today;
  }
}
