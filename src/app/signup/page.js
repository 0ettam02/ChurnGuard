"use client";
import { useState } from "react";
import Header from "../components/headerComponent";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName }),
      });
      if (res.ok) setMsg("Registrazione completata! Ora effettua il login.");
      else {
        const err = await res.json().catch(() => ({}));
        setMsg(err.detail || "Errore registrazione");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-8 pt-28">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-2">Registrati</h1>
            <p className="text-center text-white/70 mb-6">Crea il tuo account</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1">Nome completo</label>
                <input
                  className="w-full p-4 px-3 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Mario Rossi"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Email</label>
                <input
                  className="w-full p-4 px-3 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="email@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-white/70 mb-1">Password</label>
                <input
                  type="password"
                  className="w-full p-4 px-3 py-3 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {msg && <p className="text-sm text-cyan-200">{msg}</p>}

              <div className="mt-4">
              <button
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:opacity-60 font-semibold"
              >
                {loading ? "Invio in corso..." : "Registrati"}
              </button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-white/70">
              Hai già un account?{" "}
              <a href="/login" className="text-cyan-300 hover:text-cyan-200 underline">
                Accedi
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}