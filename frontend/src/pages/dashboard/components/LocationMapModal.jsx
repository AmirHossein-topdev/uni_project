// frontend\src\pages\dashboard\components\LocationMapModal.jsx
"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// dynamic برای کامپوننت‌های بزرگ (MapContainer, TileLayer, Marker) OK:
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => ({ default: mod.MapContainer })),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => ({ default: mod.TileLayer })),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => ({ default: mod.Marker })),
  { ssr: false }
);

// <-- اینجا: useMapEvents را مستقیم import کنید (نه dynamic)
import { useMapEvents } from "react-leaflet";

// LocationMarker حالا از hook به درستی استفاده می‌کند
const LocationMarker = ({ position, setPosition }) => {
  // useMapEvents باید مستقیماً فراخوانی شود
  const map = useMapEvents({
    click: (e) => {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position} /> : null;
};

export default function LocationMapModal({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  onConfirm,
}) {
  const defaultCenter = { lat: 35.6892, lng: 51.389 };

  const [tempPosition, setTempPosition] = useState(null);

  useEffect(() => {
    if (isOpen) {
      if (initialLat && initialLng) {
        setTempPosition({
          lat: parseFloat(initialLat),
          lng: parseFloat(initialLng),
        });
      } else {
        setTempPosition(defaultCenter);
      }
    } else {
      // ریست کردن زمانی که مودال بسته می‌شود
      setTempPosition(null);
    }
  }, [isOpen, initialLat, initialLng]);

  const handleConfirm = () => {
    if (tempPosition) onConfirm(tempPosition);
    onClose();
  };

  if (!isOpen) return null;

  const mapCenter = tempPosition || defaultCenter;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[80vh]">
        {/* header, map container, footer مشابه قبل */}
        <div className="flex-1 relative overflow-auto">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={tempPosition}
              setPosition={setTempPosition}
            />
          </MapContainer>
          {/* نمایش مختصات و بقیه UI */}
        </div>
        {/* footer */}
      </div>
    </div>
  );
}
