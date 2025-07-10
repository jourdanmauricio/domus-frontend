// components/LucideLeafletMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { ReactElement } from 'react';

interface CustomDivIconOptions extends L.DivIconOptions {
  html: string;
}

const createLucideIcon = (
  icon: ReactElement,
  color: string = 'red',
  size: number = 24
): L.DivIcon => {
  // Convertir el componente React a string SVG
  const iconString = renderToString(icon);

  return L.divIcon({
    html: `
      <div style="
        color: ${color};
        background: white;
        border-radius: 50%;
        width: ${size}px;
        height: ${size}px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
      ">
        ${iconString}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  } as CustomDivIconOptions);
};

const LeafletMap = () => {
  const position: LatLngExpression = [51.505, -0.09]; // Coordenadas tipadas

  // Icono tipado
  const lucideIcon = createLucideIcon(<MapPin color='currentColor' size={20} />, '#3b82f6', 32);

  return (
    <div className='h-[400px] w-full'>
      <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position} icon={lucideIcon}>
          <Popup className='font-sans text-sm'>Ubicación con icono Lucide tipado</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
