'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingModal from '../components/LoadingModal';
import TopMenu from '../components/TopMenu';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchAirQualityData, selectLoading, selectError } from '../store/slices/airQualitySlice';

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
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);

  useEffect(() => {
    // Загружаем данные при монтировании компонента
    dispatch(fetchAirQualityData());
  }, [dispatch]);

  return (
    <>
      <div className="map-container mobile-optimized performance-optimized fade-in">
        <Map />
      </div>

      <TopMenu />

      <LoadingModal 
        isVisible={loading} 
        onClose={() => {}} 
      />
    </>
  );
}
