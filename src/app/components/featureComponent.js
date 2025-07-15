const FeatureCard = ({ icon, title, description, delay = 0 }) => (
    <div 
      className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-8 text-center transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-3xl">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-white/80 leading-relaxed">{description}</p>
    </div>
  );
export default function FeatureSection(){
    return(
        <section id="features" className="py-20 px-6 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
              Tecnologia Avanzata
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Algoritmi di machine learning all'avanguardia per massimizzare la retention dei tuoi clienti
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="🤖"
              title="IA Predittiva"
              description="Algoritmi di machine learning che analizzano comportamenti, frequenza di utilizzo e pattern di engagement per predire l'abbandono con precisione superiore al 90%."
              delay={0}
            />
            <FeatureCard
              icon="📊"
              title="Analytics Avanzati"
              description="Dashboard intuitiva con metriche chiave, report personalizzabili e insights actionable per prendere decisioni basate sui dati."
              delay={100}
            />
            <FeatureCard
              icon="⚡"
              title="Automazione Smart"
              description="Campagne di retention automatizzate che si attivano quando un cliente viene identificato come a rischio, con messaggi personalizzati."
              delay={200}
            />
            <FeatureCard
              icon="🎯"
              title="Segmentazione Intelligente"
              description="Raggruppa automaticamente i clienti in base al rischio di churn e caratteristiche comportamentali per strategie mirate."
              delay={300}
            />
            <FeatureCard
              icon="📱"
              title="Integrazione Facile"
              description="Connessione seamless con i tuoi sistemi esistenti tramite API REST. Setup in meno di 10 minuti, nessuna competenza tecnica richiesta."
              delay={400}
            />
            <FeatureCard
              icon="🔒"
              title="Sicurezza Garantita"
              description="Crittografia end-to-end, conformità GDPR e backup automatici. I tuoi dati sono sempre protetti e al sicuro."
              delay={500}
            />
          </div>
        </div>
      </section>
    )
}

