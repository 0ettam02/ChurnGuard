'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/headerComponent';

export default function SceltaFunzionalita() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const funzionalita = [
    {
      id: 'a',
      title: 'Valutazione Singolo utente',
      desc: 'Puoi inserire manualmente i dati di un singolo utente per ottenere informazioni dettagliate e personalizzate.'
    },
    {
      id: 'b',
      title: 'Valutazione dinamica basata su dataset',
      desc: 'Carica il tuo dataset per analisi dinamiche e predizioni intelligenti grazie al nostro modello AI.'
    }
  ];

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

      {/* Header */}
      <Header />

      <main className="flex items-center justify-center px-6 z-10" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="bg-black/50 p-8 rounded-lg max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {funzionalita.map(({ id, title, desc }) => (
            <div key={id} className="flex flex-col text-center bg-slate-800/50 rounded-lg p-6">
              <Link href={id === 'a' ? "/modello" : "/modelloDataset"}>
                <button
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 
                  px-6 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/25"
                >
                  {title}
                </button>
              </Link>
              <p className="mt-4 text-sm text-cyan-300">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
