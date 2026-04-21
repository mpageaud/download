'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const MapComponent = dynamic(
  () => import('@/components/Map/MapComponent'),
  { ssr: false, loading: () => <div style={{height:'500px', background:'#1A1035', borderRadius:'16px', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>Chargement de la carte...</div> }
);

interface Pin {
  id: number; lat: number; lng: number;
  title: string; description?: string; type: string;
}

export default function MapPage() {
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    fetch('/api/pins')
      .then(r => r.json())
      .then(setPins)
      .catch(console.error);
  }, []);

  return (
    <main style={{ padding: '20px', fontFamily: 'sans-serif', background: '#FFF8F0', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'sans-serif', color: '#1A1035', marginBottom: '20px' }}>
        🗺️ Carte Festiville
      </h1>
      <MapComponent pins={pins} />
      <p style={{ marginTop: '12px', color: '#666', fontSize: '14px' }}>
        {pins.length} point{pins.length > 1 ? 's' : ''} sur la carte
      </p>
    </main>
  );
}
