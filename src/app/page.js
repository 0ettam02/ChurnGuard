'use client'
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/headerComponent';
import Hero from './components/heroComponent';
import FeatureSection from './components/featureComponent';
import StatsSection from './components/statsSectionComponent';
import CTA from './components/ctaComponent';
import Footer from './components/footerComponent';

const ChurnGuardHomepage = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [counters, setCounters] = useState({
    accuracy: 0,
    retention: 0,
    revenue: 0,
    clients: 0
  });
  const statsRef = useRef(null);

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
    const targets = { accuracy: 92, retention: 35, revenue: 150, clients: 500 };
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        accuracy: Math.floor(targets.accuracy * easeOut),
        retention: Math.floor(targets.retention * easeOut),
        revenue: Math.floor(targets.revenue * easeOut),
        clients: Math.floor(targets.clients * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounters(targets);
      }
    }, stepTime);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {isClient && (
        <div className="fixed inset-0 pointer-events-none">
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
      ciao
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <FeatureSection />
      
      {/* Stats Section */}
      <StatsSection />

      {/* Final CTA */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ChurnGuardHomepage;