'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import Header from "../components/headerComponent";

export default function GestioneUtentiClient() {
  const searchParams = useSearchParams();
  const customer_id = searchParams.get("customer_id");
  const [message, setMessage] = useState({});
  const [loading, setLoading] = useState(true);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (!customer_id) return;

    const fetchRetention = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${backendUrl}/retention/?customer_id=${customer_id}`);
        if (!res.ok) throw new Error("Errore nel recupero notifiche");
        const data = await res.json();
        setMessage(data);
      } catch (err) {
        console.error("Errore nel fetch delle notifiche:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRetention();
  }, [customer_id, backendUrl]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-gray-800 bg-opacity-70 rounded-2xl p-8 max-w-md w-full shadow-lg">
          <h1 className="text-3xl font-bold mb-4">Dettagli Cliente</h1>
          <p className="text-lg">
            <span className="font-semibold">ID Cliente:</span> {customer_id || "Non specificato"}
          </p>
        </div>
        <div className="mt-4 bg-gray-700 p-4 rounded-lg ">
          <h2 className="text-xl font-semibold mb-2">Suggerimenti Retention</h2>
          {loading ? (
            <p className="text-gray-300 italic">Caricamento in corso...</p>
          ) : (
            <ReactMarkdown>{message.azione_retenzione_consigliata}</ReactMarkdown>
          )}
        </div>
      </main>
    </>
  );
}
