const BASE_URL = "/api/auth";

export function saveToken(token) {
  localStorage.setItem("jwt", token);
}

export function getToken() {
  return localStorage.getItem("jwt");
}

export function removeToken() {
  localStorage.removeItem("jwt");
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(username, email, password, encryptedDek, dekSalt, dekIv) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, encryptedDek, dekSalt, dekIv }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registrazione fallita");
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login fallito");
  saveToken(data.token);
  if (data.encryptedDek) localStorage.setItem("encryptedDek", data.encryptedDek);
  if (data.dekSalt)      localStorage.setItem("dekSalt",      data.dekSalt);
  if (data.dekIv)        localStorage.setItem("dekIv",        data.dekIv);
  return data;
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  removeToken();
  localStorage.removeItem("encryptedDek");
  localStorage.removeItem("dekSalt");
  localStorage.removeItem("dekIv");
  return res.ok;
}

export async function forgotPassword(email) {
  const res = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Errore");
  return data;
}

export async function resetPassword(token, newPassword) {
  const res = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Errore");
  return data;
}