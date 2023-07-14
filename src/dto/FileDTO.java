package dto;

import java.util.ArrayList;
import java.util.List;

public class FileDTO {
  private boolean flag = false;

  private List<String> filePath = new ArrayList<>();

  public FileDTO() {
    super();
    // TODO Auto-generated constructor stub
  }

  public FileDTO(boolean flag, List<String> filePath) {
    super();
    this.flag = flag;
    this.filePath = filePath;
  }

  public boolean isFlag() {
    return flag;
  }

  public void setFlag(boolean flag) {
    this.flag = flag;
  }

  public List<String> getFilePath() {
    return filePath;
  }

  public void setFilePath(List<String> filePath) {
    this.filePath = filePath;
  }
}
