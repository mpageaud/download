'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icônes Leaflet avec Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Pin {
  id: number;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type: string;
}

interface MapProps {
  pins?: Pin[];
}

export default function MapComponent({ pins = [] }: MapProps) {
  useEffect(() => {
    // Vérifier si la carte existe déjà
    const container = document.getElementById('festiville-map');
    if (!container) return;
    if ((container as any)._leaflet_id) return;

    // Initialiser la carte centrée sur la Suisse/France
    const map = L.map('festiville-map').setView([46.8, 7.0], 7);

    // Fond de carte OpenStreetMap (gratuit)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Couleurs par type de pin
    const pinColors: Record<string, string> = {
      DECORATION: '#FF6B2B',
      MERCHANT: '#2ECC71',
      EVENT: '#9B59B6',
    };

    // Ajouter les pins
    pins.forEach(pin => {
      const color = pinColors[pin.type] || '#FF6B2B';
      const icon = L.divIcon({
        html: `<div style="
          background:${color};
          width:16px; height:16px;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:2px solid white;
          box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        className: '',
        iconSize: [16, 16],
        iconAnchor: [8, 16],
      });

      L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:sans-serif; min-width:160px;">
            <strong style="color:#1A1035;">${pin.title}</strong>
            ${pin.description ? `<p style="color:#666; margin:4px 0 0;">${pin.description}</p>` : ''}
            <span style="
              display:inline-block; margin-top:6px;
              background:${color}; color:white;
              padding:2px 8px; border-radius:10px; font-size:11px;
            ">${pin.type}</span>
          </div>
        `);
    });

    return () => { map.remove(); };
  }, [pins]);

  return (
    <div
      id="festiville-map"
      style={{ width: '100%', height: '500px', borderRadius: '16px' }}
    />
  );
}
