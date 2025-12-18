export default function About() {
  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold gradient-text mb-4">Over BikeFlow</h1>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Wij maken fietsen toegankelijk voor iedereen
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="font-display text-2xl font-bold text-white mb-4">🎯 Onze Missie</h2>
          <p className="text-white/70 leading-relaxed">
            Onze missie is om het gebruik van duurzame vervoersmiddelen te bevorderen. 
            We willen fietsen toegankelijk maken voor iedereen, zodat je snel en eenvoudig 
            een fiets kunt huren, waar en wanneer je maar wilt.
          </p>
        </div>

        <div className="card">
          <h2 className="font-display text-2xl font-bold text-white mb-4">👁️ Onze Visie</h2>
          <p className="text-white/70 leading-relaxed">
            We streven ernaar om de fietservaring te verbeteren door gebruik te maken van 
            de nieuwste technologieën. We willen een verschil maken door lokale gemeenschappen 
            te ondersteunen en de impact op het milieu te verkleinen.
          </p>
        </div>
      </div>

      <div className="card mb-12">
        <h2 className="font-display text-2xl font-bold text-white mb-6">✨ Wat Wij Aanbieden</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🚲', title: 'Stadsfietsen', desc: 'Perfect voor de stad' },
            { icon: '⚡', title: 'E-bikes', desc: 'Elektrisch gemak' },
            { icon: '🏔️', title: 'Mountainbikes', desc: 'Voor avontuur' },
            { icon: '👶', title: 'Kinderfietsen', desc: 'Voor de kleintjes' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-white/5">
              <div className="text-4xl mb-2">{item.icon}</div>
              <h3 className="font-bold text-white">{item.title}</h3>
              <p className="text-white/60 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gradient-to-r from-[#FF6B35]/20 to-[#00B4D8]/20">
        <h2 className="font-display text-2xl font-bold text-white mb-4">📞 Contact</h2>
        <p className="text-white/70">
          Heb je vragen of opmerkingen? Neem gerust contact met ons op via onze klantenservice 
          of bezoek ons op één van onze locaties. Wij staan klaar om je te helpen!
        </p>
      </div>
    </div>
  );
}
