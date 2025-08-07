'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import TopMenu from '../components/TopMenu';
import { useAppDispatch } from '../hooks/redux';
import { fetchAirQualityData } from '../store/slices/airQualitySlice';

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
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Загружаем данные при монтировании компонента
    dispatch(fetchAirQualityData('2025-08-01T12:00:00Z'));
  }, [dispatch]);

  return (
    <>
      <div className="map-container mobile-optimized performance-optimized fade-in">
        <Map />
      </div>

      <TopMenu />
    </>
  );
}
