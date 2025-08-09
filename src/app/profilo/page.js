"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/headerComponent";

export default function ProfiloPage() {
  const router = useRouter();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) { router.replace("/login"); return; }

    fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${t}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(setMe)
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, [API_URL, router]);

  const initials = (me?.full_name || me?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center p-8 pt-28">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10">
          {/* Header profilo */}
          <div className="p-8 border-b border-white/10 flex items-center gap-6">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-2xl font-bold">
              {loading ? "…" : initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {loading ? "Caricamento…" : (me?.full_name || "Utente")}
              </h1>
              <p className="text-white/70 text-sm">
                {loading ? "" : me?.email}
              </p>
            </div>
          </div>

          {/* Info grid (solo Email e Nome) */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-xs">Email</div>
              <div className="text-lg font-semibold break-all">{loading ? "—" : me?.email}</div>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-xs">Nome completo</div>
              <div className="text-lg font-semibold">{loading ? "—" : (me?.full_name || "—")}</div>
            </div>
          </div>

          {/* Azioni */}
          <div className="px-8 pb-8 flex flex-col md:flex-row gap-3 md:gap-4 md:items-center md:justify-end">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition"
              type="button"
            >
              Vai alla Home
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </>
  );
}