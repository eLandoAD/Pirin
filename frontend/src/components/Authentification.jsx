import { useState } from "react";
import { register, login, forgotPassword } from "../api/auth";
import { createUserKeys } from "../crypto/dek";  

function Input({ label, name, type = "text", value, onChange, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      <label htmlFor={name} style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>
        {label}
      </label>
      <input
        id={name} name={name} type={type}
        value={value} onChange={onChange} required
        style={{ borderRadius: "6px", border: "1px solid #cbd5e1", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a" }}
        onFocus={e => e.target.style.borderColor = "#5eead4"}
        onBlur={e => e.target.style.borderColor = "#cbd5e1"}
      />
      {hint && <span style={{ fontSize: "11px", color: "#94a3b8" }}>{hint}</span>}
    </div>
  );
}

function LoginView({ onSwitch, onClose, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      onLoginSuccess(data);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Bentornato</h2>
      <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>
        Non hai un account?{" "}
        <button onClick={() => onSwitch("signup")} style={{ background: "none", border: "none", color: "#0f766e", cursor: "pointer", fontSize: "13px", padding: 0, fontWeight: 600 }}>
          Registrati
        </button>
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label htmlFor="password" style={{ fontSize: "13px", fontWeight: 500, color: "#1e293b" }}>Password</label>
            <button type="button" onClick={() => onSwitch("forgot")} style={{ background: "none", border: "none", fontSize: "11px", color: "#94a3b8", cursor: "pointer", padding: 0 }}>
              Password dimenticata?
            </button>
          </div>
          <input
            id="password" name="password" type="password"
            value={form.password} onChange={update} required
            style={{ borderRadius: "6px", border: "1px solid #cbd5e1", padding: "8px 12px", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a" }}
            onFocus={e => e.target.style.borderColor = "#5eead4"}
            onBlur={e => e.target.style.borderColor = "#cbd5e1"}
          />
        </div>
        {error && <p style={{ borderRadius: "6px", backgroundColor: "#fef2f2", padding: "8px 12px", fontSize: "13px", color: "#dc2626", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ marginTop: "4px", width: "100%", borderRadius: "6px", backgroundColor: "#0f172a", border: "none", padding: "10px", fontSize: "13px", fontWeight: 600, color: "white", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>
    </>
  );
}

function SignUpView({ onSwitch }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Le password non corrispondono."); return; }
    setLoading(true);
    try {
      const { encryptedDek, dekSalt, dekIv } = await createUserKeys(form.password);
      await register(form.username, form.email, form.password, encryptedDek, dekSalt, dekIv);
      onSwitch("verify");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Crea account</h2>
      <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>
        Hai già un account?{" "}
        <button onClick={() => onSwitch("login")} style={{ background: "none", border: "none", color: "#0f766e", cursor: "pointer", fontSize: "13px", padding: 0, fontWeight: 600 }}>
          Accedi
        </button>
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input label="Username" name="username" value={form.username} onChange={update} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={update} hint="Almeno 8 caratteri" />
        <Input label="Conferma password" name="confirm" type="password" value={form.confirm} onChange={update} />
        {error && <p style={{ borderRadius: "6px", backgroundColor: "#fef2f2", padding: "8px 12px", fontSize: "13px", color: "#dc2626", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ marginTop: "4px", width: "100%", borderRadius: "6px", backgroundColor: "#0f172a", border: "none", padding: "10px", fontSize: "13px", fontWeight: 600, color: "white", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Registrazione in corso..." : "Crea account"}
        </button>
      </form>
    </>
  );
}

function VerifyView({ onSwitch }) {
  return (
    <div style={{ textAlign: "center", padding: "16px 0" }}>
      <div style={{ fontSize: "40px", marginBottom: "16px" }}>✉️</div>
      <h2 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 600, color: "#0f172a" }}>Controlla la tua email</h2>
      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>
        Ti abbiamo inviato un link di verifica.<br />
        Clicca il link per attivare il tuo account.
      </p>
      <button onClick={() => onSwitch("login")} style={{ background: "none", border: "none", fontSize: "13px", color: "#0f766e", cursor: "pointer", fontWeight: 600 }}>
        Torna al login
      </button>
    </div>
  );
}

function ForgotView({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "16px 0" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>📬</div>
        <h2 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 600, color: "#0f172a" }}>Link inviato</h2>
        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "24px" }}>
          Se l'email è registrata, riceverai un link per il reset.
        </p>
        <button onClick={() => onSwitch("login")} style={{ background: "none", border: "none", fontSize: "13px", color: "#0f766e", cursor: "pointer", fontWeight: 600 }}>
          Torna al login
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Reset password</h2>
      <p style={{ margin: "0 0 24px", fontSize: "13px", color: "#64748b" }}>Inserisci la tua email e ti mandiamo un link.</p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p style={{ borderRadius: "6px", backgroundColor: "#fef2f2", padding: "8px 12px", fontSize: "13px", color: "#dc2626", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={loading}
          style={{ width: "100%", borderRadius: "6px", backgroundColor: "#0f172a", border: "none", padding: "10px", fontSize: "13px", fontWeight: 600, color: "white", cursor: "pointer" }}>
          {loading ? "Invio in corso..." : "Invia link"}
        </button>
        <button type="button" onClick={() => onSwitch("login")} style={{ background: "none", border: "none", fontSize: "12px", color: "#94a3b8", cursor: "pointer" }}>
          Torna al login
        </button>
      </form>
    </>
  );
}

export default function AuthModal({ initialView = "login", onClose, onLoginSuccess }) {
  const [view, setView] = useState(initialView);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", width: "100%", maxWidth: "400px", margin: "0 16px", borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "white", padding: "32px", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }}>
        <button onClick={onClose} style={{ position: "absolute", right: "16px", top: "16px", background: "none", border: "none", fontSize: "16px", color: "#94a3b8", cursor: "pointer", lineHeight: 1 }}>✕</button>
        {view === "login"  && <LoginView  onSwitch={setView} onClose={onClose} onLoginSuccess={onLoginSuccess} />}
        {view === "signup" && <SignUpView onSwitch={setView} onClose={onClose} />}
        {view === "verify" && <VerifyView onSwitch={setView} />}
        {view === "forgot" && <ForgotView onSwitch={setView} />}
      </div>
    </div>
  );
}