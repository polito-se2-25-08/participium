import { MapWindow } from '../components/mapWindow';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="header">
        <h1>Participium</h1>
        <p>Citizen Participation in Urban Environment Management</p>
      </header>
      
      <main className="main-content">
        <section className="map-section">
          <MapWindow />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
