import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
          <span className="gradient-text">Ontdek de vrijheid</span>
          <br />
          <span className="text-white">op twee wielen</span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Bij BikeFlow huur je eenvoudig de perfecte fiets voor jouw avontuur. 
          Kwaliteit, gemak en de beste prijs.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/fietsen" className="btn-primary">
            Bekijk Fietsen
          </Link>
          <Link to="/locaties" className="btn-secondary">
            Onze Locaties
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { icon: '🚲', title: 'Ruime Keuze', desc: 'Van stadsfiets tot e-bike' },
          { icon: '💰', title: 'Scherpe Prijzen', desc: 'Betaalbaar voor iedereen' },
          { icon: '📍', title: 'Meerdere Locaties', desc: 'Altijd in de buurt' },
          { icon: '📱', title: 'Online Reserveren', desc: 'Snel en gemakkelijk' },
        ].map((item, i) => (
          <div key={i} className="card text-center">
            <div className="text-4xl mb-4">{item.icon}</div>
            <h3 className="font-display text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-white/60">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="card bg-gradient-to-r from-[#FF6B35]/20 to-[#F7C948]/20 text-center py-12">
        <h2 className="font-display text-3xl font-bold text-white mb-4">
          Klaar om te fietsen?
        </h2>
        <p className="text-white/60 mb-6">
          Maak een account aan en start direct met huren!
        </p>
        <Link to="/register" className="btn-primary">
          Start Nu
        </Link>
      </div>
    </div>
  );
}
