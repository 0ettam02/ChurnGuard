'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/headerComponent';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ModelloDataset() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { router.replace('/login'); return; }
    setIsClient(true);
  }, [router]);

  async function handleFileUpload() {
    const token = localStorage.getItem('token');
    if (!token) { setUploadStatus("Effettua il login per usare questa funzione."); return; }
    if (!file) { setUploadStatus("Nessun file selezionato."); return; }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setUploadStatus("");
      const res = await fetch(`${API_URL}/modello_dataset`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Errore durante l'invio del file");
      await res.json();
      setUploadStatus("Dataset caricato correttamente. Reindirizzamento…");
      setTimeout(() => router.push("/"), 800); // redirect veloce alla home
    } catch (err) {
      setUploadStatus("Errore nell'invio del file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const onDragOver = (e) => e.preventDefault();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col">
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random()*100}%`,
                top: `${Math.random()*100}%`,
                animationDelay: `${Math.random()*3}s`,
                animationDuration: `${3+Math.random()*2}s`
              }}
            />
          ))}
        </div>
      )}

      <Header />

      <main className="min-h-screen flex items-center justify-center px-6 pt-28 pb-12 z-10">
        <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8 mt-24">
          <h1 className="text-3xl font-bold mb-2">Valutazione dinamica basata su dataset</h1>
          <p className="text-white/70 mb-6">
            Carica un file CSV per eseguire l’analisi dinamica e le predizioni.
          </p>

          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="rounded-xl border-2 border-dashed border-white/20 bg-black/20 p-6 text-center hover:border-cyan-400/50 transition"
          >
            <div className="text-white/70 mb-3">Trascina qui il tuo file CSV</div>
            <div className="mt-10">
            <label className="inline-block cursor-pointer px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition">
              Scegli file
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            </div>

            {file && (
              <div className="mt-3 text-sm text-cyan-200 break-all">
                Selezionato: {file.name}
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleFileUpload}
              disabled={loading || !file}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60 transition p-4"
            >
              {loading ? "Invio in corso..." : "Invia Dataset"}
            </button>

            {uploadStatus && (
              <span className={`text-sm ${uploadStatus.startsWith("Errore") ? "text-red-300" : "text-cyan-200"}`}>
                {uploadStatus}
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
