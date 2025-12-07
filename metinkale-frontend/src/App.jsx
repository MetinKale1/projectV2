// src/App.jsx
import { Link } from 'react-router-dom'; // 👈
import './AppStyles.css';

function App() {
  return (
    <div>
      <h1>Welkom!</h1>
      <p>Kies één van de volgende links:</p>
      <ul>
        <li>
          <Link to='/home'>Home</Link> {/* 👈 */}
        </li>
        <li>
          <Link to='/feedback'>Feedback</Link> {/* 👈 */}
        </li>
        <li>
          <Link to='/fietsen'>Fietsen</Link> {/* 👈 */}
        </li>
        <li>
          <Link to='/verhuur'>verhuur</Link> {/* 👈 */}
        </li>
        <li>
          <Link to='/about'>Over ons</Link> {/* 👈 */}
        </li>
        <li>
          <Link to='/login'>login</Link> {/* 👈 */}
        </li>
      </ul>
    </div>
  );
}
export default App;
