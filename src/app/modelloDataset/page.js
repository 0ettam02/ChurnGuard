'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/headerComponent';

export default function SceltaFunzionalita() {
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prendo URL backend da variabile d'ambiente
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  async function handleFileUpload() {
    if (!file) {
      setUploadStatus("Nessun file selezionato.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${backendUrl}/modello_dataset`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Errore durante l'invio del file");

      const data = await res.json();
      setUploadStatus("Dataset caricato correttamente.");
    } catch (err) {
      setUploadStatus("Errore nell'invio del file.");
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col">
      {isClient && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <Header />

      <div className="p-8 z-10">
        <h2 className="text-lg font-semibold mb-2">Carica il tuo dataset:</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-black mb-4"
        />
        <button
          onClick={handleFileUpload}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Invia Dataset
        </button>
        {uploadStatus && <p className="mt-4">{uploadStatus}</p>}
      </div>
    </div>
  );
}
