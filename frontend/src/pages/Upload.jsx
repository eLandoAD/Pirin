import { uploadFile } from "../api/upload";
import { encryptFile } from "../crypto/encrypt";

export default function Upload() {

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const password = prompt("Password per cifrare");

    await uploadFile(file, password, encryptFile);
    alert("Uploaded!");
  };

  return (
    <input type="file" onChange={handleUpload} />
  );
}