package dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import com.google.gson.Gson;
import com.google.gson.JsonParser;

public class KakaoDAO {
  Gson g = new Gson();
  JsonParser parse = new JsonParser();

  public String login() {
    String apiURL;
    apiURL = "https://kauth.kakao.com/oauth/authorize?";
    apiURL += "client_id=" + "eb3f2943dfb95e8918af19f33d1e72e4";
    apiURL += "&redirect_uri=" + "http://192.168.60.22:8080/callback.ka";
    apiURL += "&response_type=code";
    return apiURL;
  }

  public String getToken(String code) throws IOException {
    String apiURL;
    apiURL = "https://kauth.kakao.com/oauth/token?grant_type=authorization_code";
    apiURL += "&client_id=" + "eb3f2943dfb95e8918af19f33d1e72e4";
    apiURL += "&redirect_uri=" + "http://192.168.60.22:8080/callback.ka";
    apiURL += "&code=" + code;
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else { // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    if (responseCode == 200) {
      return res.toString();
    } else {
      return null;
    }
  }

  public String getInfo(String accessToken) throws IOException {
    String token = accessToken;
    String header = "Bearer " + token;
    String apiURL;
    apiURL = "https://kapi.kakao.com/v2/user/me";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("GET");
    con.setRequestProperty("Authorization", header);
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else { // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    return res.toString();
  }

  public void remove(String accessToken) throws IOException {
    String token = accessToken;
    String header = "Bearer " + token;
    String apiURL;
    apiURL = "https://kapi.kakao.com/v1/user/unlink";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Authorization", header);
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else { // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    System.out.println(res.toString());
  }

  public String getAccessToken(String refresh_token) throws IOException {
    String apiURL;
    apiURL = "https://kauth.kakao.com/oauth/token?grant_type=refresh_token";
    apiURL += "&client_id=" + "eb3f2943dfb95e8918af19f33d1e72e4";
    apiURL += "&refresh_token=" + refresh_token;
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else { // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    if (responseCode == 200) {
      return res.toString();
    } else {
      return null;
    }
  }

  public void logout(String accessToken) throws IOException {
    String token = accessToken;
    String header = "Bearer " + token;
    String apiURL;
    apiURL = "https://kapi.kakao.com/v1/user/logout";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("POST");
    con.setRequestProperty("Authorization", header);
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else { // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
  }

}
