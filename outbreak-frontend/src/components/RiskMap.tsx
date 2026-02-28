"use client";
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';

export default function RiskMap() {
  const [markers, setMarkers] = useState([]);

  // Nairobi focus for the initial view
  const center: [number, number] = [-1.286389, 36.817223]; 

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/map-markers');
        const data = await response.json();
        setMarkers(data);
      } catch (error) {
        console.error("❌ Map Fetch Error:", error);
      }
    };
    fetchMarkers();
  }, []);

  return (
    <div className="h-[500px] w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={6} 
        style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {markers.map((marker: any, idx: number) => (
          <CircleMarker 
            key={idx}
            center={[marker.lat, marker.lng]}
            pathOptions={{ 
              color: marker.risk === 'High' ? '#ef4444' : marker.risk === 'Medium' ? '#f59e0b' : '#10b981',
              fillColor: marker.risk === 'High' ? '#ef4444' : marker.risk === 'Medium' ? '#f59e0b' : '#10b981',
              fillOpacity: 0.6 
            }}
            radius={15}
          >
            <Popup>
              <div className="p-1 font-sans">
                <h4 className="font-bold text-slate-800">{marker.name}</h4>
                <p className="text-sm">AI Risk Level: 
                  <span className={`ml-1 font-bold ${
                    marker.risk === 'High' ? 'text-red-600' : 
                    marker.risk === 'Medium' ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {marker.risk}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 mt-1 italic">Source: LSTM Inference Engine</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}