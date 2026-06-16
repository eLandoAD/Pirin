const BASE_URL = import.meta.env.VITE_BACKEND_URL 
  ? `${import.meta.env.VITE_BACKEND_URL}/api/auth` 
  : "/api/auth";

// Dati sensibili → sessionStorage (spariscono alla chiusura del tab)
export function saveToken(token) {
  sessionStorage.setItem("jwt", token);
}

export function getToken() {
  return sessionStorage.getItem("jwt");
}

export function removeToken() {
  sessionStorage.removeItem("jwt");
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

  // Tutto in sessionStorage — sparisce alla chiusura del tab
  saveToken(data.token);
  if (data.encryptedDek) sessionStorage.setItem("encryptedDek", data.encryptedDek);
  if (data.dekSalt)      sessionStorage.setItem("dekSalt",      data.dekSalt);
  if (data.dekIv)        sessionStorage.setItem("dekIv",        data.dekIv);
  if (data.username)     sessionStorage.setItem("username",     data.username);
  if (data.email)        sessionStorage.setItem("email",        data.email);

  return data;
}

export async function logout() {
  await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  // Pulisce tutti i dati sensibili
  sessionStorage.removeItem("jwt");
  sessionStorage.removeItem("encryptedDek");
  sessionStorage.removeItem("dekSalt");
  sessionStorage.removeItem("dekIv");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("email");
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