import { LoremIpsum } from 'react-lorem-ipsum';
import './About.css';

const About = () => (
  <div className="about-container">
    <h1 className="about-title">Over ons</h1>
    <div className="about-content">
      <p>Welkom bij onze fietshuurservice! Wij zijn een innovatieve en klantgerichte onderneming die zich richt op het aanbieden van hoogwaardige fietsen voor verhuur, zodat jij de stad op een gemakkelijke, duurzame en plezierige manier kunt verkennen. Of je nu een dagtocht plant, een langere reis maakt, of gewoon door de stad wilt rijden, wij hebben de perfecte fiets voor jou!</p>
      
      <h2>Onze Missie</h2>
      <p>Onze missie is om het gebruik van duurzame vervoersmiddelen zoals fietsen te bevorderen en de mobiliteit in de stad te verbeteren. We willen fietsen toegankelijk maken voor iedereen, zodat je snel en eenvoudig een fiets kunt huren, waar en wanneer je maar wilt.</p>
      
      <h2>Wat Wij Aanbieden</h2>
      <p>We bieden een breed scala aan fietsen, van stadsfietsen en elektrische fietsen tot racefietsen en kinderfietsen. Al onze fietsen zijn goed onderhouden en worden regelmatig gecontroleerd om een veilige en comfortabele rit te garanderen. Je kunt onze fietsen huren via onze gebruiksvriendelijke app of op één van onze verhuurlocaties in de stad.</p>
      
      <h2>Onze Visie</h2>
      <p>We streven ernaar om de fietservaring te verbeteren door gebruik te maken van de nieuwste technologieën en door voortdurend onze service te verbeteren. We willen een verschil maken door de lokale gemeenschappen te ondersteunen en de impact op het milieu te verkleinen.</p>
      
      <h2>Waarom Kiezen Voor Ons?</h2>
      <ul>
        <li>Veilige en goed onderhouden fietsen</li>
        <li>Flexibele huurperiodes</li>
        <li>Gebruiksvriendelijke app voor het reserveren en huren van fietsen</li>
        <li>Betaalbare prijzen</li>
        <li>Gratis service en ondersteuning</li>
      </ul>

      <h2>Contacteer Ons</h2>
      <p>Heb je vragen of opmerkingen? 
        Neem gerust contact met ons op via onze klantenservice of bezoek ons op één van onze locaties. 
        Wij staan klaar om je te helpen!</p>

      <div>
        <LoremIpsum p={2} />
      </div>
    </div>
  </div>
);

export default About;
