package dto;

public class AdminDTO {
  private String visitDate;
  private int visitCount;
  private int male;
  private int female;
  private int teenage;
  private int twenty;
  private int thirty;
  private int forty;
  private int fifty;
  private int sixty;
  private int seventy;
  private int eighty;
  private int ninety;
  private int perTeenage;
  private int perTwenty;
  private int perThirty;
  private int perForty;
  private int perFifty;
  private int perSixty;
  private int perSeventy;
  private int perEighty;
  private int perNinety;

  public AdminDTO(String visitDate, int visitCount) {
    super();
    this.visitDate = visitDate;
    this.visitCount = visitCount;
  }

  public AdminDTO(int male, int female) {
    super();
    this.male = male;
    this.female = female;
  }

  public AdminDTO(int teenage, int twenty, int thirty, int forty, int fifty, int sixty, int seventy, int eighty, int ninety) {
    super();
    this.teenage = teenage;
    this.twenty = twenty;
    this.thirty = thirty;
    this.forty = forty;
    this.fifty = fifty;
    this.sixty = sixty;
    this.seventy = seventy;
    this.eighty = eighty;
    this.ninety = ninety;
  }

  public AdminDTO(int male, int perTeenage, int perTwenty, int perThirty, int perForty, int perFifty, int perSixty, int perSeventy, int perEighty, int perNinety) {
    super();
    this.male = male;
    this.perTeenage = perTeenage;
    this.perTwenty = perTwenty;
    this.perThirty = perThirty;
    this.perForty = perForty;
    this.perFifty = perFifty;
    this.perSixty = perSixty;
    this.perSeventy = perSeventy;
    this.perEighty = perEighty;
    this.perNinety = perNinety;
  }

  public AdminDTO() {
  }

  public String getVisitDate() {
    return visitDate;
  }

  public void setVisitDate(String visitDate) {
    this.visitDate = visitDate;
  }

  public int getVisitCount() {
    return visitCount;
  }

  public void setVisitCount(int visitCount) {
    this.visitCount = visitCount;
  }

  public int getMale() {
    return male;
  }

  public void setMale(int male) {
    this.male = male;
  }

  public int getFemale() {
    return female;
  }

  public void setFemale(int female) {
    this.female = female;
  }

  public int getTeenage() {
    return teenage;
  }

  public void setTeenage(int teenage) {
    this.teenage = teenage;
  }

  public int getTwenty() {
    return twenty;
  }

  public void setTwenty(int twenty) {
    this.twenty = twenty;
  }

  public int getThirty() {
    return thirty;
  }

  public void setThirty(int thirty) {
    this.thirty = thirty;
  }

  public int getForty() {
    return forty;
  }

  public void setForty(int forty) {
    this.forty = forty;
  }

  public int getFifty() {
    return fifty;
  }

  public void setFifty(int fifty) {
    this.fifty = fifty;
  }

  public int getSixty() {
    return sixty;
  }

  public void setSixty(int sixty) {
    this.sixty = sixty;
  }

  public int getSeventy() {
    return seventy;
  }

  public void setSeventy(int seventy) {
    this.seventy = seventy;
  }

  public int getEighty() {
    return eighty;
  }

  public void setEighty(int eighty) {
    this.eighty = eighty;
  }

  public int getNinety() {
    return ninety;
  }

  public void setNinety(int ninety) {
    this.ninety = ninety;
  }

  public int getPerTeenage() {
    return perTeenage;
  }

  public void setPerTeenage(int perTeenage) {
    this.perTeenage = perTeenage;
  }

  public int getPerTwenty() {
    return perTwenty;
  }

  public void setPerTwenty(int perTwenty) {
    this.perTwenty = perTwenty;
  }

  public int getPerThirty() {
    return perThirty;
  }

  public void setPerThirty(int perThirty) {
    this.perThirty = perThirty;
  }

  public int getPerForty() {
    return perForty;
  }

  public void setPerForty(int perForty) {
    this.perForty = perForty;
  }

  public int getPerFifty() {
    return perFifty;
  }

  public void setPerFifty(int perFifty) {
    this.perFifty = perFifty;
  }

  public int getPerSixty() {
    return perSixty;
  }

  public void setPerSixty(int perSixty) {
    this.perSixty = perSixty;
  }

  public int getPerSeventy() {
    return perSeventy;
  }

  public void setPerSeventy(int perSeventy) {
    this.perSeventy = perSeventy;
  }

  public int getPerEighty() {
    return perEighty;
  }

  public void setPerEighty(int perEighty) {
    this.perEighty = perEighty;
  }

  public int getPerNinety() {
    return perNinety;
  }

  public void setPerNinety(int perNinety) {
    this.perNinety = perNinety;
  }


}
