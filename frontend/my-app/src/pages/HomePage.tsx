import MapView from '../components/MapView.tsx';
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
          <MapView />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
