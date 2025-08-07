'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LoadingModal from '../components/LoadingModal';
import TopMenu from '../components/TopMenu';

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Показываем модальное окно сразу после загрузки
    setShowModal(true);
  }, []);

  return (
    <>
      <div className="map-container mobile-optimized performance-optimized fade-in">
        <MapContainer
          center={[43.2389, 76.8897]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      </div>

      <TopMenu />

      <LoadingModal 
        isVisible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
