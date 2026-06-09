import { useState } from "react";

// ── tiny helpers ──────────────────────────────────────────────

function Input({ label, name, type = "text", value, onChange, hint }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#00a86b] focus:ring-2 focus:ring-[#00a86b]/20 transition"
      />
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}

// ── views ─────────────────────────────────────────────────────

function LoginView({ onSwitch, onClose }) {
  const [form, setForm] = useState({ email: "", password: "" });

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: chiamata al backend
    console.log("Login con:", form);
    onClose();
  }

  return (
    <>
      <h2 className="mb-1 text-xl font-bold tracking-tight">Bentornato</h2>
      <p className="mb-6 text-sm text-slate-500">
        Non hai un account?{" "}
        <button onClick={() => onSwitch("signup")} className="text-[#00a86b] hover:underline">
          Registrati
        </button>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <button
              type="button"
              onClick={() => onSwitch("forgot")}
              className="text-xs text-slate-400 hover:text-[#00a86b] hover:underline"
            >
              Password dimenticata?
            </button>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={update}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#00a86b] focus:ring-2 focus:ring-[#00a86b]/20 transition"
          />
        </div>

        <button
          type="submit"
          className="mt-1 w-full rounded-lg bg-[#00a86b] py-2 text-sm font-medium text-white hover:bg-[#048059] transition-colors"
        >
          Accedi
        </button>
      </form>
    </>
  );
}

function SignUpView({ onSwitch, onClose }) {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Le password non corrispondono.");
      return;
    }
    // TODO: chiamata al backend
    console.log("Registrazione con:", form);
    onSwitch("verify");
  }

  return (
    <>
      <h2 className="mb-1 text-xl font-bold tracking-tight">Crea account</h2>
      <p className="mb-6 text-sm text-slate-500">
        Hai già un account?{" "}
        <button onClick={() => onSwitch("login")} className="text-[#00a86b] hover:underline">
          Accedi
        </button>
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label="Username" name="username" value={form.username} onChange={update} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={update} />
        <Input label="Password" name="password" type="password" value={form.password} onChange={update} hint="Almeno 8 caratteri" />
        <Input label="Conferma password" name="confirm" type="password" value={form.confirm} onChange={update} />

        {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="mt-1 w-full rounded-lg bg-[#00a86b] py-2 text-sm font-medium text-white hover:bg-[#048059] transition-colors"
        >
          Crea account
        </button>
      </form>
    </>
  );
}

function VerifyView({ onSwitch }) {
  return (
    <div className="text-center py-4">
      <div className="mb-4 text-4xl">✉️</div>
      <h2 className="mb-2 text-xl font-semibold">Controlla la tua email</h2>
      <p className="text-sm text-slate-500 mb-6">
        Ti abbiamo inviato un link di verifica.<br />
        Clicca il link per attivare il tuo account.
      </p>
      <button onClick={() => onSwitch("login")} className="text-sm text-[#00a86b] hover:underline">
        Torna al login
      </button>
    </div>
  );
}

function ForgotView({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Reset password per:", email);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center py-4">
        <div className="mb-4 text-4xl">📬</div>
        <h2 className="mb-2 text-xl font-semibold">Link inviato</h2>
        <p className="text-sm text-slate-500 mb-6">
          Se l'email è registrata, riceverai un link per il reset.
        </p>
        <button onClick={() => onSwitch("login")} className="text-sm text-[#00a86b] hover:underline">
          Torna al login
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-1 text-xl font-bold tracking-tight">Reset password</h2>
      <p className="mb-6 text-sm text-slate-500">
        Inserisci la tua email e ti mandiamo un link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          className="mt-1 w-full rounded-lg bg-[#00a86b] py-2 text-sm font-medium text-white hover:bg-[#048059] transition-colors"
        >
          Invia link
        </button>
        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="text-center text-xs text-slate-400 hover:underline"
        >
          Torna al login
        </button>
      </form>
    </>
  );
}

//main modal

export default function AuthModal({ initialView = "login", onClose }) {
  const [view, setView] = useState(initialView);

  return (
 
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {}
      <div
        className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 text-lg leading-none"
        >
          ✕
        </button>

        {view === "login"  && <LoginView  onSwitch={setView} onClose={onClose} />}
        {view === "signup" && <SignUpView onSwitch={setView} onClose={onClose} />}
        {view === "verify" && <VerifyView onSwitch={setView} />}
        {view === "forgot" && <ForgotView onSwitch={setView} />}
      </div>
    </div>
  );
}