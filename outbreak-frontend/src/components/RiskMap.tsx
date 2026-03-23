"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import needed for Next.js to avoid "window is not defined" SSR errors with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const GeoJSON = dynamic(() => import("react-leaflet").then((mod) => mod.GeoJSON), { ssr: false });

interface RiskData {
    county_name: string;
    risk_score: number;
    disease_type: string;
}

export default function RiskMap() {
    const [geoData, setGeoData] = useState<any>(null);
    const [riskData, setRiskData] = useState<Record<string, RiskData>>({});

    useEffect(() => {
        // Load the GeoJSON file
        fetch("/kenya_counties.json")
            .then(res => res.json())
            .then(data => setGeoData(data));

        // Load the live LSTM risk data
        const token = localStorage.getItem("jwt_token");
        fetch("http://localhost:8001/api/v1/counties", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then((data: any[]) => {
            const riskMap: Record<string, RiskData> = {};
            data.forEach(d => {
                riskMap[d.county_name] = d;
            });
            setRiskData(riskMap);
        });
    }, []);

    // Function to determine Polygon Color based on Risk Score
    const getColor = (countyName: string) => {
        const data = riskData[countyName];
        if (!data) return "#ECEFF1"; // Default Gray
        
        if (data.risk_score >= 70.0) return "#EF4444"; // Red (High Risk)
        if (data.risk_score >= 40.0) return "#F59E0B"; // Amber (Moderate)
        return "#10B981"; // Green (Low Risk)
    };

    // Styling function applied to each GeoJSON feature
    const style = (feature: any) => {
        return {
            fillColor: getColor(feature.properties.name),
            weight: 2,
            opacity: 1,
            color: "white",
            fillOpacity: 0.7
        };
    };

    // Popups for interacting with the map
    const onEachFeature = (feature: any, layer: any) => {
        const name = feature.properties.name;
        const data = riskData[name];
        
        if (data) {
            const popupContent = `
                <div style="font-family: sans-serif;">
                    <strong style="font-size: 16px;">${name} County</strong><br/>
                    <span style="color: ${data.risk_score >= 70 ? 'red' : 'black'}; font-weight: bold;">
                        Risk Level: ${data.risk_score.toFixed(1)}%
                    </span><br/>
                    ${data.disease_type !== "None" ? `<span style="color: red;">Warning: ${data.disease_type}</span>` : ''}
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    };

    if (!geoData || Object.keys(riskData).length === 0) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Live Intelligence Map...</div>;

    return (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden mt-6" style={{ height: "500px", width: "100%" }}>
            <MapContainer 
                center={[-1.286389, 36.817223]} // Center of Kenya Map logic
                zoom={6} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON 
                    data={geoData} 
                    style={style}
                    onEachFeature={onEachFeature}
                />
            </MapContainer>
        </div>
    );
}