'use client';

import React, { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center?: [number, number] | null; // Центр карты, передается как массив [широта, долгота]
}

// иконки на карте из папки public
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/map/marker-icon-2x.png',
  iconUrl: '/images/map/marker-icon.png',
  shadowUrl: '/images/map/marker-shadow.png',
});

// Стили для карты
const Map: React.FC<MapProps> = ({ center = [51, 0] }) => {
  const containerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '10px',
    zIndex: 0,
  };

  // Компонент для изменения центра карты
  const ChangeCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.setView(center, map.getZoom());
      }
    }, [center, map]);
    return null;
  };

  return (
    <MapContainer
      center={center || [51, -0.09]} // Центр карты по умолчанию, если не передан
      zoom={center ? 4 : 2} // Зум карты, зависит от наличия центра
      scrollWheelZoom={false} // Отключение зума колесиком мыши
      style={containerStyle} // Применение стилей к контейнеру
    >
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // URL для тайлов карты
      />
      {/* Маркер на карте, если передан центр */}
      {center && <Marker position={center} />}
      {/* Компонент для изменения центра карты */}
      <ChangeCenter />
    </MapContainer>
  );
};

export default Map;
