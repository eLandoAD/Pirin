const BASE_URL = "https://crispy-potato-qv76gg55rgxxc99r5-8080.app.github.dev/api/auth";

// Salva il token JWT nel localStorage
export function saveToken(token) {
  localStorage.setItem("jwt", token);
}

// Leggi il token JWT
export function getToken() {
  return localStorage.getItem("jwt");
}

// Elimina il token (logout)
export function removeToken() {
  localStorage.removeItem("jwt");
}

// Restituisce l'header Authorization da aggiungere a ogni chiamata autenticata
export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Registrazione
// body: { username, email, password }
export async function register(username, email, password) {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registrazione fallita");
  return data; // { message: "..." }
}

// Login
// Restituisce il token JWT e lo salva automaticamente
export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login fallito");
  saveToken(data.token); // salva il JWT nel localStorage
  return data; // { token, ... }
}

// Logout
export async function logout() {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  removeToken();
  return res.ok;
}

// Reset password — step 1: manda l'email
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

// Reset password — step 2: imposta la nuova password con il token dall'email
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
