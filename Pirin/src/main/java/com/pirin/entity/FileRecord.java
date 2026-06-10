@Entity
public class FileRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filename;

    private String storagePath;


    private String iv;

    private Long ownerId;
    
    private Long folderId;

    public FileRecord() {}

    public FileRecord(String filename, String storagePath, String iv) {
        this.filename = filename;
        this.storagePath = storagePath;
        this.iv = iv;
        this.ownerId = ownerId;
        this.folderId = folderId;
    }

    public Long getId() { return id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public String getStoragePath() { return storagePath; }
    public void setStoragePath(String storagePath) { this.storagePath = storagePath; }

    public String getIv() { return iv; }
    public void setIv(String iv) { this.iv = iv; }


}