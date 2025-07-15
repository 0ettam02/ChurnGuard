'use client'
import React, { useState, useEffect, useRef } from 'react';

export default function StatsSection() {
  const statsRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({
    accuracy: 0,
    retention: 0,
    revenue: 0,
    clients: 0,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  const animateCounters = () => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    const target = {
      accuracy: 89,
      retention: 23,
      revenue: 120,
      clients: 350,
    };

    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setCounters({
        accuracy: Math.round(target.accuracy * progress),
        retention: Math.round(target.retention * progress),
        revenue: Math.round(target.revenue * progress),
        clients: Math.round(target.clients * progress),
      });

      if (frame === totalFrames) {
        clearInterval(counterInterval);
      }
    }, frameRate);
  };

  return (
    <section ref={statsRef} className="py-20 px-6 text-center">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-extrabold mb-12 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
          Risultati Comprovati
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              {counters.accuracy}%
            </div>
            <div className="text-lg text-white/80">Accuratezza Predizioni</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              +{counters.retention}%
            </div>
            <div className="text-lg text-white/80">Retention Rate</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              €{counters.revenue}K
            </div>
            <div className="text-lg text-white/80">Revenue Media Salvata</div>
          </div>
          <div className="p-6">
            <div className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
              {counters.clients}+
            </div>
            <div className="text-lg text-white/80">Clienti Soddisfatti</div>
          </div>
        </div>
      </div>
    </section>
  );
}
