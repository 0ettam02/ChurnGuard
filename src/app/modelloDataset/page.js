'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/headerComponent';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ordine colonne master per CSV finale
const MASTER_ORDER = [
  'customer_id','sesso','età','data_iscrizione','tipo_abbonamento',
  'prezzo_abbonamento','ultima_presenza','media_presenze_sett',
  'giorni_da_ultima_presenza','churn'
];

function jsonToCsv(rows) {
  const headers = MASTER_ORDER;
  const esc = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    // se contiene separatori o virgolette, wrappa tra doppi apici e raddoppia i doppi apici interni
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const head = headers.join(',');
  const body = rows.map(r => headers.map(h => esc(r[h])).join(',')).join('\n');
  return `${head}\n${body}`;
}

export default function ModelloDataset() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleanedData, setCleanedData] = useState([]);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) { router.replace('/login'); return; }
    setIsClient(true);
  }, [router]);

  async function handleClean() {
    if (!file) { setStatus('Nessun file selezionato.'); return; }
    try {
      setLoading(true);
      setStatus('Pulizia dataset in corso...');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/clean-dataset', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Errore nella pulizia del dataset');
      const data = await res.json();
      setCleanedData(Array.isArray(data) ? data : []);
      setStatus('Dataset pulito! Controlla l’anteprima e poi invia.');
    } catch (e) {
      console.error(e);
      setStatus('Errore durante la pulizia del dataset.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSend() {
    const token = localStorage.getItem('token');
    if (!token) { setStatus('Effettua il login per usare questa funzione.'); return; }
    if (!cleanedData.length) { setStatus('Prima pulisci il dataset.'); return; }

    try {
      setLoading(true);
      setStatus('Invio del dataset pulito in corso...');

      // Ricrea un CSV pulito per mantenere la tua logica standard (upload multipart)
      const csv = jsonToCsv(cleanedData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      const cleanedFile = new File([blob], 'dataset_pulito.csv', { type: 'text/csv' });

      const formData = new FormData();
      formData.append('file', cleanedFile);

      // Manteniamo la chiamata standard al tuo endpoint
      const res = await fetch(`${API_URL}/modello_dataset`, {
        method: 'POST',
        body: formData,
        // se il tuo backend richiede header di auth, aggiungili qui:
        // headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Errore durante l’invio del dataset');
      await res.json();

      setStatus('Dataset inviato correttamente. Reindirizzamento…');
      setTimeout(() => router.push('/'), 800);
    } catch (e) {
      console.error(e);
      setStatus('Errore nell’invio del dataset.');
    } finally {
      setLoading(false);
    }
  }

  const onDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };
  const onDragOver = (e) => e.preventDefault();

  const previewCols = useMemo(() => MASTER_ORDER, []);
  const previewRows = useMemo(() => cleanedData.slice(0, 15), [cleanedData]); // anteprima prime 15 righe

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

      <main className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-12 z-10">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/10 p-8 mt-24">
          <h1 className="text-3xl font-bold mb-2">Valutazione dinamica basata su dataset</h1>
          <p className="text-white/70 mb-6">
            Carica un file CSV, puliscilo con Gemini, verifica l’anteprima e poi invialo al server.
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

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={handleClean}
              disabled={loading || !file}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60 transition"
            >
              {loading ? 'Elaborazione…' : '1) Pulisci Dataset'}
            </button>

            <button
              onClick={handleSend}
              disabled={loading || cleanedData.length === 0}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-5 py-2.5 rounded-lg font-semibold disabled:opacity-60 transition"
            >
              {loading ? 'Invio…' : '2) Invia Dataset Pulito'}
            </button>

            {status && (
              <span className={`text-sm ${status.startsWith('Errore') ? 'text-red-300' : 'text-cyan-200'}`}>
                {status}
              </span>
            )}
          </div>

          {/* Anteprima tabellare */}
          {cleanedData.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-3">Anteprima (prime 15 righe)</h2>
              <div className="overflow-auto rounded-lg border border-white/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/10">
                    <tr>
                      {previewCols.map((c) => (
                        <th key={c} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((r, idx) => (
                      <tr key={idx} className="odd:bg-white/5 even:bg-white/0">
                        {previewCols.map((c) => (
                          <td key={c} className="px-3 py-2 whitespace-nowrap">{String(r?.[c] ?? '')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-white/60 mt-2">Il file inviato sarà un CSV ricostruito a partire dai dati puliti mostrati qui.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


