package dto;

public class MemberDTO {
  private int id;
  private String email;
  private String pw;
  private String name;
  private String nickname;
  private String ban;
  private String gender;
  private String age;
  private int type;

  public MemberDTO() {
    super();
  }

  public MemberDTO(int id, String email, String pw, String name, String nickname, String ban, String gender,
                   String age, int type) {
    super();
    this.id = id;
    this.email = email;
    this.pw = pw;
    this.name = name;
    this.nickname = nickname;
    this.ban = ban;
    this.gender = gender;
    this.age = age;
    this.type = type;
  }

  public MemberDTO(int id, String email, String name, String gender, String age, String ban) {
    super();
    this.id = id;
    this.email = email;
    this.name = name;
    this.gender = gender;
    this.age = age;
    this.ban = ban;
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

  public String getPw() {
    return pw;
  }

  public void setPw(String pw) {
    this.pw = pw;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getNickname() {
    return nickname;
  }

  public void setNickname(String nickname) {
    this.nickname = nickname;
  }

  public String getBan() {
    return ban;
  }

  public void setBan(String ban) {
    this.ban = ban;
  }

  public String getGender() {
    return gender;
  }

  public void setGender(String gender) {
    this.gender = gender;
  }

  public String getAge() {
    return age;
  }

  public void setAge(String age) {
    this.age = age;
  }

  public int getType() {
    return type;
  }

  public void setType(int type) {
    this.type = type;
  }


}
