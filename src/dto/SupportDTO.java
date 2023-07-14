package dto;

import java.sql.Date;
import java.sql.Timestamp;

public class SupportDTO {
  private int sep;
  private String email;
  private int id;
  private String name;
  private Date supportDate;
  private Timestamp supportTimestamp;
  private int amount;

  public SupportDTO() {
    super();
    // TODO Auto-generated constructor stub
  }

  public SupportDTO(int sep, String email, int id, String name, Date supportDate, Timestamp supportTimestamp,
                    int amount) {
    super();
    this.sep = sep;
    this.email = email;
    this.id = id;
    this.name = name;
    this.supportDate = supportDate;
    this.supportTimestamp = supportTimestamp;
    this.amount = amount;
  }

  public int getSep() {
    return sep;
  }

  public void setSep(int sep) {
    this.sep = sep;
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

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getSupportDate() {
    return supportDate;
  }

  public void setSupportDate(Date supportDate) {
    this.supportDate = supportDate;
  }

  public Timestamp getSupportTimestamp() {
    return supportTimestamp;
  }

  public void setSupportTimestamp(Timestamp supportTimestamp) {
    this.supportTimestamp = supportTimestamp;
  }

  public int getAmount() {
    return amount;
  }

  public void setAmount(int amount) {
    this.amount = amount;
  }

}