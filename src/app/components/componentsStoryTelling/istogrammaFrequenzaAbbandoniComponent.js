import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AOS from 'aos';
import 'aos/dist/aos.css'; 

export default function IstogrammaFrequenzaAbbandoni() {
  const [data, setData] = useState([]);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetch(`${backendUrl}/istogramma_distribuzione_frequenza_abbandoni`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        setData(json);
      });

    AOS.init({});
  }, [backendUrl]); 

  return (
    <div data-aos="fade-right" data-aos-offset="200" data-aos-easing="ease-in-sine" className='mt-10'>
        <div className="text-purple-900 p-4 bg-white rounded-xl shadow-md md:min-w-[650px] ">
            <h2 className="text-xl font-bold mb-4">Distribuzione Frequenza Degli Abbandoni</h2>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                  <XAxis dataKey="eta" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="frequenza" fill="purple" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
}
