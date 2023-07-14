package dto;

import java.text.SimpleDateFormat;

import dao.MenuDataDAO;

public class McdonaldDTO {
  private int seq;
  private String imgAddr;
  private String menuName;
  private String menuNameEng;
  private int price;

  public McdonaldDTO() {
    super();
  }

  public McdonaldDTO(int seq, String imgAddr, String menuName, String menuNameEng, int price) {
    super();
    this.seq = seq;
    this.imgAddr = imgAddr;
    this.menuName = menuName;
    this.menuNameEng = menuNameEng;
    this.price = price;
  }

  public int getSeq() {
    return seq;
  }

  public void setSeq(int seq) {
    this.seq = seq;
  }

  public String getImgAddr() {
    return imgAddr;
  }

  public void setImgAddr(String imgAddr) {
    this.imgAddr = imgAddr;
  }

  public String getMenuName() {
    return menuName;
  }

  public void setMenuName(String menuName) {
    this.menuName = menuName;
  }

  public String getMenuNameEng() {
    return menuNameEng;
  }

  public void setMenuNameEng(String menuNameEng) {
    this.menuNameEng = menuNameEng;
  }

  public int getPrice() {
    return price;
  }

  public void setPrice(int price) {
    this.price = price;
  }
}
