'use client'

import Link from 'next/link'

export default function CTA() {
  return (
    <section className="py-24 px-6 text-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
          Trasforma i Dati in Crescita
        </h2>
        <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
          Inizia oggi stesso a utilizzare l'intelligenza artificiale per salvare i tuoi clienti e aumentare le tue revenue. Prova gratuita di 14 giorni, nessuna carta di credito richiesta.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link href="/modello">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/25">
              Inizia la Prova Gratuita
            </button>
          </Link>
          <button className="border-2 border-white/30 hover:border-cyan-400 hover:bg-cyan-400/10 px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1">
            Parla con un Esperto
          </button>
        </div>
      </div>
    </section>
  );
}
