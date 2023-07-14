package dao;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailDAO {
  private String getDigit() {
    Integer a = ((int) (Math.random() * 9));
    return a.toString();
  }

  private String ranAcc() {
    String result = getDigit() + getDigit() + getDigit() + getDigit() + getDigit() + getDigit() + getDigit() + getDigit();
    return result;
  }

  public String Mail(String to) {
    String host = "smtp.naver.com";
    final String user = "cwg94";
    final String password = "1q2w3e4r%T";
    Properties props = new Properties();
    props.put("mail.smtp.host", host);
    props.put("mail.smtp.auth", "true");
    String certi = this.ranAcc();
    Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(user, password);
      }
    });
    try {
      MimeMessage message = new MimeMessage(session);
      message.setFrom(new InternetAddress(user));
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
      message.setSubject("Assembly 인증번호");
      // Text
      message.setText("인증번호 : " + certi);
      Transport.send(message);
      return certi;
    } catch (MessagingException e) {
      e.printStackTrace();
      return null;
    }
  }
}
