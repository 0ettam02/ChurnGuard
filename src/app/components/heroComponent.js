import Link from "next/link";

const MetricCard = ({ value, label }) => (
    <div className="bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-white/10">
      <div className="text-3xl font-bold text-cyan-400 mb-2">{value}</div>
      <div className="text-sm text-white/70">{label}</div>
    </div>
  );

export default function Hero(){
    return (
        <section className="pt-32 pb-16 px-6 text-center relative">
        <div className="absolute inset-0 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent leading-tight animate-pulse">
            Predici l&apos;Abbandono.<br />Salva i Clienti.
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Utilizza l&apos;intelligenza artificiale per identificare i clienti a rischio di abbandono e attiva strategie di retention mirate. Perfetto per palestre, centri fitness e PMI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Link href="/sceltaFunzionalita">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-cyan-500/25">
              Inizia Gratis
            </button>
          </Link>
            <button className="border-2 border-white/30 hover:border-cyan-400 hover:bg-cyan-400/10 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-1">
              Guarda la Demo
            </button>
          </div>

          {/* Dashboard Preview */}
          <div className="max-w-5xl mx-auto perspective-1000">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 transform hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 group">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <h3 className="text-2xl font-bold text-white">Dashboard Churn Prediction</h3>
                <div className="text-sm text-white/70">Ultimo aggiornamento: oggi</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <MetricCard value="87%" label="Accuratezza Predizioni" />
                <MetricCard value="156" label="Clienti a Rischio" />
                <MetricCard value="€12.4K" label="Revenue Salvata" />
                <MetricCard value="+23%" label="Retention Rate" />
              </div>
              
              <div className="h-48 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl flex items-center justify-center text-xl font-semibold border border-white/10">
                <span className="text-2xl mr-3">📊</span>
                Analisi Predittiva in Tempo Reale
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}