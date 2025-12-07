import './HomePage.css';
import { useTheme } from '../contexts/theme';

function Home() {
  const { theme } = useTheme();
  return (
    <div className={`homepage-container theme-${theme}`}>
      <h1 className="homepage-title">Welkom</h1>
      <div className="homepage-welcome">Welkom op de fietsverhuur app!</div>
      <p>Ontdek de mooiste routes en geniet van de vrijheid op twee wielen!
        Bij ons huur je eenvoudig de perfecte fiets, waar je ook bent.</p>
      <div>
        <h2>Waarom kiezen voor FietsVerhuur?</h2>
        <ul className="homepage-list">
          <li>Ruime keuze uit verschillende fietsen</li>
          <li>Betaalbare tarieven</li>
          <li>Beschikbaar op meerdere locaties</li>
          <li>Eenvoudig online reserveren</li>
        </ul>
      </div>
      <button onClick={() => window.location.href = '/locaties'}>Bekijk Locaties</button>
    </div>
  );
}

export default Home;
