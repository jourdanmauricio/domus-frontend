// components/MultiMarkerMap.tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import { MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { renderToString } from 'react-dom/server';
import { ReactElement, useEffect, useState } from 'react';

// Definición de tipos
interface MarkerData {
  position: LatLngExpression;
  popupText?: string;
  iconColor?: string;
  iconSize?: number;
  id?: string; // ID único para identificar el marcador
}

interface MultiMarkerMapProps {
  center: LatLngExpression;
  markers: MarkerData[];
  defaultIconColor?: string;
  defaultIconSize?: number;
  className?: string;
  onMarkerClick?: (markerId: string) => void; // Callback para cuando se hace clic en un marcador
  selectedMarkerId?: string; // ID del marcador seleccionado
}

const createLucideIcon = (
  icon: ReactElement,
  color: string = 'red',
  size: number = 24,
  isSelected: boolean = false
): L.DivIcon => {
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
        border: 2px solid ${isSelected ? '#ef4444' : 'white'};
        box-shadow: ${isSelected ? '0 0 0 3px rgba(239, 68, 68, 0.3)' : '0 2px 4px rgba(0,0,0,0.1)'};
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        ${iconString}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size / 2],
  });
};

const MultiMarkerMap = ({
  center,
  markers,
  defaultIconColor = '#3b82f6',
  defaultIconSize = 24,
  className = 'h-[400px] w-full',
  onMarkerClick,
  selectedMarkerId,
}: MultiMarkerMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div
        className={className}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <p>Cargando mapa...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        {markers.map((marker, index) => {
          const isSelected = selectedMarkerId === marker.id;
          const icon = createLucideIcon(
            <MapPin color='currentColor' size={marker.iconSize ? marker.iconSize - 4 : 20} />,
            marker.iconColor || defaultIconColor,
            marker.iconSize || defaultIconSize,
            isSelected
          );

          return (
            <Marker
              key={`marker-${index}`}
              position={marker.position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  if (onMarkerClick && marker.id) {
                    onMarkerClick(marker.id);
                  }
                },
              }}
            >
              {marker.popupText && (
                <Popup className='font-sans text-sm'>
                  <div className='p-2'>
                    <p className='font-medium'>{marker.popupText}</p>
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MultiMarkerMap;
