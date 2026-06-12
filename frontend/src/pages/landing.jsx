import React, { useState } from 'react';
import { Shield, Lock, Eye, Mail, KeyRound, User, Bell, LogOut } from 'lucide-react';
import { logout, login, register } from "../api/auth";
import { createUserKeys } from "../crypto/dek";

function Landing({ onLoginSuccess, onLogout, user }) {
    const [activeTab, setActiveTab] = useState('accedi');
    const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyMode, setVerifyMode] = useState(false); // mostra schermata "controlla email"

    function update(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        setError("");
    }

    async function handleLogout() {
        await logout();
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        if (onLogout) onLogout();
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (activeTab === 'accedi') {
                // LOGIN
                const data = await login(form.email, form.password);
                if (onLoginSuccess) onLoginSuccess(data);
            } else {
                // REGISTRAZIONE
                if (form.password !== form.confirm) {
                    setError("Le password non corrispondono.");
                    setLoading(false);
                    return;
                }
                if (form.password.length < 8) {
                    setError("La password deve avere almeno 8 caratteri.");
                    setLoading(false);
                    return;
                }
                const { encryptedDek, dekSalt, dekIv } = await createUserKeys(form.password);
                await register(form.username, form.email, form.password, encryptedDek, dekSalt, dekIv);
                setVerifyMode(true);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Schermata "controlla email" dopo la registrazione
    if (verifyMode) {
        return (
            <div className="min-h-screen bg-primary-white flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-[60px] mb-4">✉️</div>
                    <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        We've sent you a verification link.<br />
                        Click the link to activate your account.
                    </p>
                    <button
                        onClick={() => { setVerifyMode(false); setActiveTab('accedi'); }}
                        className="text-green text-sm font-semibold cursor-pointer bg-transparent border-none"
                    >
                        Return to login
                    </button>
                </div>
            </div>
        );
    }

    // Vista non loggato — landing + form
    return (
        <div className="min-h-screen bg-primary-white text-slate-500 flex flex-col font-sans select-none">
            <header className="w-full mx-auto px-6 py-4 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-2 text-green font-bold text-xl tracking-wide">
                    <Shield className="w-6 h-6 fill-primary-white/10" />
                    SecureVault
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-5xl bg-primary-white rounded-xl border border-slate-700 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                    
                    {/* Left Panel */}
                    <div className="p-8 md:p-12 flex flex-col justify-center bg-linear-to-br from-primary-white to-secondary-white">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
                            Security Without <br />
                            <span className="text-green">Compromise.</span>
                        </h1>
                        <p className="text-sm text-slate-500 leading-relaxed mb-8">
                            Protect your most valuable data with enterprise-level encryption.
                            Your personal digital vault—always accessible, never vulnerable.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-4 rounded-lg bg-primary-white/50 border border-slate-700/50">
                                <div className="text-green mt-0.5"><Lock className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">E2E Encrypted</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Only you hold the access keys.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-4 rounded-lg bg-primary-white/50 border border-slate-700/50">
                                <div className="text-green mt-0.5"><Eye className="w-5 h-5" /></div>
                                <div>
                                    <h3 className="text-sm font-semibold text-white">Audit Log</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Monitor every single activity in real time.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel — Form */}
                    <div className="p-8 md:p-12 bg-secondary-white flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-700">
                        <div className="flex gap-6 border-b border-slate-700 mb-6 text-sm font-medium">
                            <button type="button" onClick={() => { setActiveTab('accedi'); setError(""); }}
                                className={`pb-2 px-1 transition ${activeTab === 'accedi' ? 'text-green border-b-2 border-green' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}`}>
                                Sign In
                            </button>
                            <button type="button" onClick={() => { setActiveTab('registrati'); setError(""); }}
                                className={`pb-2 px-1 transition ${activeTab === 'registrati' ? 'text-green border-b-2 border-green' : 'text-slate-500 hover:text-slate-300 cursor-pointer'}`}>
                                Sign Up
                            </button>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {activeTab === 'registrati' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-500 block">USERNAME</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input name="username" type="text" value={form.username} onChange={update}
                                            placeholder="Enter your username"
                                            className="w-full bg-primary-white border border-slate-700 rounded-md py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-green-dark transition" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold tracking-wider text-slate-500 block">EMAIL</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input name="email" type="email" value={form.email} onChange={update}
                                        placeholder="name@company.com"
                                        className="w-full bg-primary-white border border-slate-700 rounded-md py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-green-dark transition" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-500">PASSWORD</label>
                                    {activeTab === 'accedi' && (
                                        <a href="#forgot" className="text-[10px] font-semibold text-green hover:underline">Forgot password?</a>
                                    )}
                                </div>
                                <div className="relative">
                                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input name="password" type="password" value={form.password} onChange={update}
                                        placeholder="••••••••"
                                        className="w-full bg-primary-white border border-slate-700 rounded-md py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-green-dark transition" />
                                </div>
                                {activeTab === 'registrati' && (
                                    <p className="text-[10px] text-slate-500 italic">Password must be at least 8 characters long.</p>
                                )}
                            </div>

                            {activeTab === 'registrati' && (
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold tracking-wider text-slate-500 block">CONFIRM PASSWORD</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input name="confirm" type="password" value={form.confirm} onChange={update}
                                            placeholder="••••••••"
                                            className="w-full bg-primary-white border border-slate-700 rounded-md py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-green-dark transition" />
                                    </div>
                                </div>
                            )}

                            {/* Errore */}
                            {error && (
                                <p className="text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 rounded-md px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <button type="submit" disabled={loading}
                                className={`w-full bg-green text-[#030914] font-bold py-2.5 rounded-md text-sm transition mt-2 uppercase tracking-wide cursor-pointer ${loading ? 'opacity-70' : 'hover:bg-green-dark'}`}>
                                {loading
                                    ? (activeTab === 'accedi' ? 'Signing in...' : 'Creating account...')
                                    : (activeTab === 'accedi' ? 'Sign In' : 'Sign Up')}
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="w-full mx-auto px-6 py-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                <div><span className="font-semibold text-slate-400">SecureVault</span> &copy; 2026 SecureVault Inc. All rights reserved.</div>
            </footer>
        </div>
    );
}

export default Landing;
