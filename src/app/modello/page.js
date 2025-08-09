'use client'
import React, { useEffect, useState } from 'react';
import Header from '../components/headerComponent';
import { Button } from "@heroui/button";
import Charts from '../components/chartsComponent';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Modello() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [eta, setEta] = useState('');
    const [prezzoAbbonamento, setPrezzoAbbonamento] = useState('');
    const [mediaPresenzeSettimanali, setMediaPresenzeSettimanali] = useState('');
    const [giorniDaUltimaPresenza, setGiorniDaUltimaPresenza] = useState('');
    const [annoIscrizione, setAnnoIscrizione] = useState('');
    const [meseIscrizione, setMeseIscrizione] = useState('');
    const [tipoAbbonamento, setTipoAbbonamento] = useState('');
    const [sessoF, setSessoF] = useState(0);
    const [sessoM, setSessoM] = useState(1);
    const [meseAbbandono, setMeseAbbandono] = useState(null);
    const [risultato, setRisultato] = useState(null);


    async function handleClick() {
        const res = await fetch(`${API_URL}/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eta: parseFloat(eta),
                prezzo_abbonamento: parseFloat(prezzoAbbonamento),
                media_presenze_sett: parseFloat(mediaPresenzeSettimanali),
                giorni_da_ultima_presenza: parseFloat(giorniDaUltimaPresenza),
                anno_iscrizione: parseInt(annoIscrizione),
                mese_iscrizione: parseInt(meseIscrizione),
                tipo_abbonamento_encoder: parseInt(tipoAbbonamento),
                sesso_F: parseInt(sessoF),
                sesso_M: parseInt(sessoM)
            }),
        });

        const data = await res.json();
        setRisultato(data.churn_predetto);
        setMeseAbbandono(data.mese_abbandono_predetto);
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col relative">
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

            {/* Contenuto */}
            <main className="pt-24 px-4 z-10">
                <div className="grid gap-4 max-w-xl mx-auto items-center justify-center">
                    {/* Input */}
                    <input
                        type="number"
                        placeholder="Età"
                        value={eta}
                        onChange={e => setEta(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Prezzo abbonamento"
                        value={prezzoAbbonamento}
                        onChange={e => setPrezzoAbbonamento(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Presenze settimanali"
                        value={mediaPresenzeSettimanali}
                        onChange={e => setMediaPresenzeSettimanali(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Giorni da ultima presenza"
                        value={giorniDaUltimaPresenza}
                        onChange={e => setGiorniDaUltimaPresenza(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Anno iscrizione"
                        value={annoIscrizione}
                        onChange={e => setAnnoIscrizione(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="number"
                        placeholder="Mese iscrizione"
                        value={meseIscrizione}
                        onChange={e => setMeseIscrizione(e.target.value)}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <select
                        value={tipoAbbonamento}
                        onChange={e => setTipoAbbonamento(parseInt(e.target.value))}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">Seleziona Abbonamento</option>
                        <option value="0">Annuale</option>
                        <option value="1">Mensile</option>
                        <option value="2">Trimestrale</option>
                    </select>

                    <select
                        onChange={e => {
                            const sesso = e.target.value;
                            setSessoF(sesso === "F" ? 1 : 0);
                            setSessoM(sesso === "M" ? 1 : 0);
                        }}
                        className="w-80 mx-auto px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="">Seleziona Sesso</option>
                        <option value="M">Maschio</option>
                        <option value="F">Femmina</option>
                    </select>

                    {/* Bottone */}
                    <div className='text-center mt-4'>
                        <Button color="primary" onClick={handleClick} className='bg-blue-500 rounded w-24'>Invio</Button>
                    </div>

                    {/* Risultato */}
                    {risultato !== null && (
                        <div
                            className={`rounded-2xl p-6 mt-6 shadow-lg transition-all duration-300 ${
                                risultato === 1
                                    ? "bg-red-500/10 border border-red-400 text-red-200"
                                    : "bg-green-500/10 border border-green-400 text-green-200"
                            }`}
                        >
                            <div className="text-4xl mb-2">
                                {risultato === 1 ? "⚠️" : "✅"}
                            </div>
                            <h2 className="text-2xl font-bold mb-2">
                                {risultato === 1 ? "Cliente a rischio abbandono" : "Cliente stabile"}
                            </h2>
                            {risultato === 1 && (
                                <p className="text-base">
                                    Secondo i dati forniti, il modello prevede che il cliente potrebbe abbandonare la palestra entro <span className="font-semibold text-white">{meseAbbandono}</span> mese/i.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Grafico */}
                    {risultato === 1 && (
                        <Charts
                            eta={parseFloat(eta)}
                            prezzoAbbonamento={parseFloat(prezzoAbbonamento)}
                            mediaPresenze={parseFloat(mediaPresenzeSettimanali)}
                            giorniUltimaPresenza={parseFloat(giorniDaUltimaPresenza)}
                            annoIscrizione={parseInt(annoIscrizione)}
                            meseIscrizione={parseInt(meseIscrizione)}
                            tipoAbbonamento={parseInt(tipoAbbonamento)}
                            sessoF={parseInt(sessoF)}
                            sessoM={parseInt(sessoM)}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
