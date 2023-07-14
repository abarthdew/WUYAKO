package dao;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.security.SecureRandom;

import com.google.gson.Gson;
import com.google.gson.JsonParser;

public class NaverDAO {
  String clientId = "yc7ffRAYYcREWyvOEDYU";//애플리케이션 클라이언트 아이디값";
  String clientSecret = "33o9NLNxi7";//애플리케이션 클라이언트 시크릿값";
  Gson g = new Gson();
  JsonParser parse = new JsonParser();

  public String login() throws UnsupportedEncodingException {
    String redirectURI = URLEncoder.encode("http://192.168.60.22:8080/callback.na", "UTF-8");
    SecureRandom random = new SecureRandom();
    String state = new BigInteger(130, random).toString();
    String apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
    apiURL += "&client_id=" + clientId;
    apiURL += "&redirect_uri=" + redirectURI;
    apiURL += "&state=" + state;
    return apiURL;
  }

  public String getToken(String code, String state) throws IOException {
    String redirectURI = URLEncoder.encode("http://192.168.60.22:8080/callback.na", "UTF-8");
    String apiURL;
    apiURL = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&";
    apiURL += "client_id=" + clientId;
    apiURL += "&client_secret=" + clientSecret;
    apiURL += "&redirect_uri=" + redirectURI;
    apiURL += "&code=" + code;
    apiURL += "&state=" + state;
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("GET");
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else {  // 에러 발생
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
    } else
      return null;
  }

  public String getInfo(String accessToken) throws IOException {
    String token = accessToken;
    String header = "Bearer " + token;
    String apiURL;
    apiURL = "https://openapi.naver.com/v1/nid/me";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("GET");
    con.setRequestProperty("Authorization", header);
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else {  // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    return parse.parse(res.toString()).getAsJsonObject().get("response").toString();
  }

  public String reprompt() throws UnsupportedEncodingException {
    String redirectURI = URLEncoder.encode("http://192.168.60.22:8080/callback.na", "UTF-8");
    SecureRandom random = new SecureRandom();
    String state = new BigInteger(130, random).toString();
    String apiURL = "https://nid.naver.com/oauth2.0/authorize?response_type=code";
    apiURL += "&client_id=" + clientId;
    apiURL += "&redirect_uri=" + redirectURI;
    apiURL += "&state=" + state;
    apiURL += "&auth_type=reprompt";
    return apiURL;
  }

  public String getAccessToken(String refresh_token) throws IOException {
    String apiURL;
    apiURL = "https://nid.naver.com/oauth2.0/token?";
    apiURL += "client_id=" + clientId;
    apiURL += "&client_secret=" + clientSecret;
    apiURL += "&refresh_token=" + refresh_token;
    apiURL += "&grant_type=refresh_token";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("GET");
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else {  // 에러 발생
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
    } else
      return null;
  }

  public String delete(String access_token) throws IOException {
    String apiURL;
    apiURL = "https://nid.naver.com/oauth2.0/token?";
    apiURL += "client_id=" + clientId;
    apiURL += "&client_secret=" + clientSecret;
    apiURL += "&access_token=" + access_token;
    apiURL += "&grant_type=delete";
    apiURL += "&service_provider=NAVER";
    URL url = new URL(apiURL);
    HttpURLConnection con = (HttpURLConnection) url.openConnection();
    con.setRequestMethod("GET");
    int responseCode = con.getResponseCode();
    BufferedReader br;
    if (responseCode == 200) { // 정상 호출
      br = new BufferedReader(new InputStreamReader(con.getInputStream()));
    } else {  // 에러 발생
      br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
    }
    String inputLine;
    StringBuffer res = new StringBuffer();
    while ((inputLine = br.readLine()) != null) {
      res.append(inputLine);
    }
    br.close();
    if (responseCode == 200) {
      System.out.println(res.toString());
      return res.toString();
    } else
      return null;
  }
}
