import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InfoSoldi({ 
    eta,
    prezzoAbbonamento,
    mediaPresenze,
    giorniUltimaPresenza,
    annoIscrizione,
    meseIscrizione,
    tipoAbbonamento,
    sessoF,
    sessoM
}) {
    const [data, setData] = useState(null);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchInfoSoldi = async () => {
          try {
            const res = await fetch(`${API_URL}/info_soldi`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                valori: [
                  eta,
                  prezzoAbbonamento,
                  mediaPresenze,
                  giorniUltimaPresenza,
                  annoIscrizione,
                  meseIscrizione,
                  tipoAbbonamento,
                  sessoF,
                  sessoM
                ]
              })
            });
      
            const json = await res.json();
            setData(json);
          } catch (err) {
            console.error("Errore fetch:", err);
          }
        };
      
        fetchInfoSoldi();
    }, [
        eta, prezzoAbbonamento, mediaPresenze,
        giorniUltimaPresenza, annoIscrizione,
        meseIscrizione, tipoAbbonamento,
        sessoF, sessoM, backendUrl
    ]);

    useEffect(() => {
      AOS.init();
    }, []);

    useEffect(() => {
      if (data) {
        AOS.refresh();
      }
    }, [data]);

    return (
        <div>
          {data ? (
              <>
                  {console.log("Dati info_soldi ricevuti:", data)}
                  <div
                      data-aos="fade-right"
                      data-aos-offset="200"
                      data-aos-easing="ease-in-sine"
                      className="min-w-60 bg-red-500/10 border border-red-400 text-red-200 rounded-lg p-6 text-lg mb-40 mt-10"
                  >
                      <p>{data.messaggio}</p>
                  </div>
              </>
          ) : (
              <p>Caricamento dati...</p>
          )}
        </div>
    );
}
