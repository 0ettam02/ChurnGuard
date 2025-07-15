import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useEffect, useState} from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; 


export default function GraficoAbbandoniPerAbbonamento() {
  const [data, setData] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;


  useEffect(() => {
    fetch(`${backendUrl}/grafico_abbandoni_per_abbonamento`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        setData(json);
      });

    AOS.init({});
  }, [backendUrl]); 

  return (
    <>
    <div data-aos="fade-right" data-aos-offset="200" data-aos-easing="ease-in-sine" className='mt-10'>
    <div className="text-purple-900 p-4 bg-white rounded-xl shadow-md md:min-w-[650px] ">
        <h2 className="text-xl font-bold mb-4">Grafico Degli Abbandoni Per Abbonamento</h2>
        <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="tipo_abbonamento" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="numero_abbandoni" fill="purple" />
        </BarChart>
        </ResponsiveContainer>
    </div>
    </div>
    </>
  );
}
