'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingModal from '../components/LoadingModal';
import TopMenu from '../components/TopMenu';

// Динамический импорт карты
const Map = dynamic(() => import('../components/Map'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '100%', width: '100%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Загрузка карты...
    </div>
  )
});

export default function Home() {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Показываем модальное окно сразу после загрузки
    setShowModal(true);
  }, []);

  return (
    <>
      <div className="map-container mobile-optimized performance-optimized fade-in">
        <Map />
      </div>

      <TopMenu />

      <LoadingModal 
        isVisible={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
