'use client';
import FeatureImportanceChart from './componentsStoryTelling/featureImportanceComponent';
import StatsGenerali from './componentsStoryTelling/statsGeneraliComponent';
import IstogrammaFrequenzaAbbandoni from './componentsStoryTelling/istogrammaFrequenzaAbbandoniComponent';
import GraficoAbbandoniPerAbbonamento from './componentsStoryTelling/graficoAbbandoniPerAbbonamento';
import InfoSoldi from './componentsStoryTelling/infoSoldiComponent';

export default function Charts({
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
  return (
    <div className='h-screnn'>
    <div className='flex flex-col gap-4 '>
      <div><FeatureImportanceChart /></div>
      <div className=" flex flex-col md:flex-row mt-10 gap-8">
      <StatsGenerali
        eta={eta}
        prezzoAbbonamento={prezzoAbbonamento}
        mediaPresenze={mediaPresenze}
        giorniUltimaPresenza={giorniUltimaPresenza}
        annoIscrizione={annoIscrizione}
        meseIscrizione={meseIscrizione}
        tipoAbbonamento={tipoAbbonamento}
        sessoF={sessoF}
        sessoM={sessoM}
      />
    </div>
    <div><IstogrammaFrequenzaAbbandoni /></div>
    <div><GraficoAbbandoniPerAbbonamento /></div>
    <div><InfoSoldi 
        eta={eta}
        prezzoAbbonamento={prezzoAbbonamento}
        mediaPresenze={mediaPresenze}
        giorniUltimaPresenza={giorniUltimaPresenza}
        annoIscrizione={annoIscrizione}
        meseIscrizione={meseIscrizione}
        tipoAbbonamento={tipoAbbonamento}
        sessoF={sessoF}
        sessoM={sessoM}
    /></div>
    </div>
    </div>
  )
}
