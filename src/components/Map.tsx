'use client';

import dynamic from 'next/dynamic';

// Динамический импорт контейнера карты
const MapContainer = dynamic(() => import('./map/MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="map-loading">
      Загрузка карты...
    </div>
  )
});

export default function Map() {
  return <MapContainer />;
} 