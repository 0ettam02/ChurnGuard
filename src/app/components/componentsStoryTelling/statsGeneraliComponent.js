import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css'; 

export default function StatsGenerali({
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
  const [dataMensili, setDataMensili] = useState(null);
  const [dataSett, setDataSett] = useState(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchChurnInfo = async () => {
      try {
        const res = await fetch(`https://churnguard-juao.onrender.com/churn_info`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Errore fetch:", err);
      }
    };
    fetchChurnInfo();
  }, [backendUrl]);


  useEffect(() => {
    const fetchChurnInfoMensili = async () => {
      try {
        const res = await fetch(`https://churnguard-juao.onrender.com/churn_info_mensili`, {
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
        setDataMensili(json);
      } catch (err) {
        console.error("Errore fetch:", err);
      }
    };
  
    if (
      eta && prezzoAbbonamento && mediaPresenze &&
      giorniUltimaPresenza && annoIscrizione &&
      meseIscrizione && tipoAbbonamento !== null
    ) {
      fetchChurnInfoMensili();
    }
  }, [
    eta, prezzoAbbonamento, mediaPresenze,
    giorniUltimaPresenza, annoIscrizione,
    meseIscrizione, tipoAbbonamento,
    sessoF, sessoM, backendUrl
  ]);


  useEffect(() => {
    const fetchChurnPresenzSett = async () => {
      try {
        const res = await fetch(`https://churnguard-juao.onrender.com/churn_presenzaSett`);
        const json = await res.json();
        setDataSett(json);
      } catch (err) {
        console.error("Errore fetch:", err);
      }
    };
    fetchChurnPresenzSett();
  }, [backendUrl]);
  

  useEffect(() => {
    AOS.init();
  }, []);

  useEffect(() => {
    if (data) {
      AOS.refresh();
    }
  }, [data]);
  

  return (
    <>
    <div>
      {data ? (
        <div
          data-aos="fade-right"
          data-aos-offset="200"
          data-aos-easing="ease-in-sine"
          className="min-w-60 bg-red-500/10 border border-red-400 text-red-200 rounded-lg p-6 text-lg"
        >
          <p>
            Clienti che hanno abbandonato: {data.totale_churn}, ovvero il{" "}
            {data.percentuale_churn}%{" "}
          </p>
        </div>
      ) : (
        <p>Caricamento dati...</p>
      )}
    </div>

    <div>
      {dataMensili ? (
        <div
          data-aos="fade-right"
          data-aos-offset="200"
          data-aos-easing="ease-in-sine"
          className="min-w-60 bg-red-500/10 border border-red-400 text-red-200 rounded-lg p-6 text-lg"
        >
          <p>{dataMensili.messaggio}</p>

        </div>
      ) : (
        <p>Caricamento dati...</p>
      )}
    </div>

    <div>
      {dataSett ? (
        <div
          data-aos="fade-right"
          data-aos-offset="200"
          data-aos-easing="ease-in-sine"
          className="min-w-60 bg-red-500/10 border border-red-400 text-red-200 rounded-lg p-6 text-lg"
        >
          <p>{dataSett.messaggio_presenze}</p>

        </div>
      ) : (
        <p>Caricamento dati...</p>
      )}
    </div>
    </>
  );
}
