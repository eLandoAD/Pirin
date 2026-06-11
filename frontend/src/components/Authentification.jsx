import { useState } from "react";
import { register, login, forgotPassword } from "../api/auth";
import { createUserKeys } from "../crypto/dek";  

function Input({ label, name, type = "text", value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-[13px] font-medium text-slate-800">
        {label}
      </label>
      <input
        id={name} name={name} type={type}
        value={value} onChange={onChange} required
        className="rounded-md border border-slate-300 px-3 py-2 text-[13px] outline-none bg-slate-50 text-slate-900 focus:border-green transition-colors"
      />
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
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
      <h2 className="m-0 mb-1 text-[20px] font-bold text-slate-900">Welcome back!</h2>
      <p className="m-0 mb-6 text-[13px] text-slate-500">
        You don't have an account?{" "}
        <button onClick={() => onSwitch("signup")} className="bg-transparent border-none text-green-dark cursor-pointer text-[13px] p-0 font-semibold">
          Sign Up
        </button>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-[13px] font-medium text-slate-800">Password</label>
            <button type="button" onClick={() => onSwitch("forgot")} className="bg-transparent border-none text-[11px] text-slate-400 cursor-pointer p-0">
              Password forgotten?
            </button>
          </div>
          <input
            id="password" name="password" type="password"
            value={form.password} onChange={update} required
            className="rounded-md border border-slate-300 px-3 py-2 text-[13px] outline-none bg-slate-50 text-slate-900 focus:border-green transition-colors"
          />
        </div>
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600 m-0">{error}</p>}
        <button type="submit" disabled={loading}
          className={`mt-1 w-full rounded-md bg-slate-900 border-none p-2.5 text-[13px] font-semibold text-white cursor-pointer ${loading ? 'opacity-70' : 'opacity-100'}`}>
          {loading ? "Logging in..." : "Log in"}
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
    if (form.password !== form.confirm) { setError("The passwords do not match."); return; }
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
      <h2 className="m-0 mb-1 text-[20px] font-bold text-slate-900">Crea account</h2>
      <p className="m-0 mb-6 text-[13px] text-slate-500">
        You already have an account?{" "}
        <button onClick={() => onSwitch("login")} className="bg-transparent border-none text-green-dark cursor-pointer text-[13px] p-0 font-semibold">
          Log In
        </button>
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Username" name="username" value={form.username} onChange={update} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={update} hint="At least 8 characters" />
        <Input label="Confirm password" name="confirm" type="password" value={form.confirm} onChange={update} />
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600 m-0">{error}</p>}
        <button type="submit" disabled={loading}
          className={`mt-1 w-full rounded-md bg-slate-900 border-none p-2.5 text-[13px] font-semibold text-white cursor-pointer ${loading ? 'opacity-70' : 'opacity-100'}`}>
          {loading ? "Registration in progress..." : "Create account"}
        </button>
      </form>
    </>
  );
}

function VerifyView({ onSwitch }) {
  return (
    <div className="text-center py-4">
      <div className="text-[40px] mb-4">✉️</div>
      <h2 className="m-0 mb-2 text-[18px] font-semibold text-slate-900">Check your email</h2>
      <p className="text-[13px] text-slate-500 mb-6">
        We've sent you a verification link.<br />
        Click the link to activate your account.
      </p>
      <button onClick={() => onSwitch("login")} className="bg-transparent border-none text-[13px] text-teal-700 cursor-pointer font-semibold">
        Return to login
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
      <div className="text-center py-4">
        <div className="text-[40px] mb-4">📬</div>
        <h2 className="m-0 mb-2 text-[18px] font-semibold text-slate-900">Link sent</h2>
        <p className="text-[13px] text-slate-500 mb-6">
          If your email address is registered, you will receive a reset link.
        </p>
        <button onClick={() => onSwitch("login")} className="bg-transparent border-none text-[13px] text-teal-700 cursor-pointer font-semibold">
          Return to login
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="m-0 mb-1 text-[20px] font-bold text-slate-900">Reset password</h2>
      <p className="m-0 mb-6 text-[13px] text-slate-500">Enter your email and we'll send you a link.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600 m-0">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full rounded-md bg-slate-900 border-none p-2.5 text-[13px] font-semibold text-white cursor-pointer">
          {loading ? "Sending..." : "Send link"}
        </button>
        <button type="button" onClick={() => onSwitch("login")} className="bg-transparent border-none text-[12px] text-slate-400 cursor-pointer">
          Return to login
        </button>
      </form>
    </>
  );
}

export default function AuthModal({ initialView = "login", onClose, onLoginSuccess }) {
  const [view, setView] = useState(initialView);

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-100 mx-4 rounded-xl border border-slate-200 bg-white p-8 shadow-[0_25px_60px_rgba(0,0,0,0.2)]">
        <button onClick={onClose} className="absolute right-4 top-4 bg-transparent border-none text-[16px] text-slate-400 cursor-pointer line-height-none">✕</button>
        {view === "login"  && <LoginView  onSwitch={setView} onClose={onClose} onLoginSuccess={onLoginSuccess} />}
        {view === "signup" && <SignUpView onSwitch={setView} onClose={onClose} />}
        {view === "verify" && <VerifyView onSwitch={setView} />}
        {view === "forgot" && <ForgotView onSwitch={setView} />}
      </div>
    </div>
  );
}