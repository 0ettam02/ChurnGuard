'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

export default function FeatureImportanceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/feature_importance.json')
      .then(res => res.json())
      .then(json => {
        const dati = Object.entries(json).map(([key, value]) => ({
          feature: key,
          importanza: value,
        }));
        setData(dati);
      });
  }, []);

  useEffect(() => {
    AOS.init({})
  }, [])

  return (
    <>
    <div data-aos="fade-right" data-aos-offset="200" data-aos-easing="ease-in-sine" className='mt-10'>
      <p className="mb-4 text-white text-lg">
        Il modello analizza diversi fattori per capire se un cliente abbandonerà la palestra. 
        Qui sotto puoi vedere quali caratteristiche hanno avuto maggiore peso nella previsione.
      </p>

      <div className="text-purple-900 p-4 bg-white rounded-xl shadow-md md:min-w-[650px] ">
        <h2 className="text-xl font-bold mb-4">Importanza delle Feature</h2>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart data={data} layout="vertical">
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="feature" type="category" width={200} />
            <Tooltip />
            <Bar dataKey="importanza" fill="purple" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
}



                
                


