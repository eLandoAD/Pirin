export async function uploadFile(file, password, encryptFile) {

  const { encrypted, salt, iv } = await encryptFile(file, password);

  const formData = new FormData();

  formData.append("file", new Blob([encrypted]));
  formData.append("salt", btoa(String.fromCharCode(...salt)));
  formData.append("iv", btoa(String.fromCharCode(...iv)));

  await fetch("http://localhost:8080/upload", {
    method: "POST",
    body: formData
  });
}