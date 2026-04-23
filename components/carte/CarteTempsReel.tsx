"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CollectriceIcon } from "@/lib/leaflet-icons";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface CollectriceLive {
  id: string;
  nom: string;
  prenom: string;
  latitude: number;
  longitude: number;
  derniereTransaction?: number;
}

// Petit composant pour recentrer la carte
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function CarteTempsReel() {
  const [collectrices, setCollectrices] = useState<CollectriceLive[]>([]);
  const [loading, setLoading] = useState(true);

  // Position par défaut (Lomé, Togo par exemple, ou centré sur les données)
  const [center, setCenter] = useState<[number, number]>([6.1377, 1.2123]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("/api/positions/actives");
        if (res.ok) {
          const data = await res.json();
          setCollectrices(data);
          
          // Si on a des données, on centre sur la première collectrice
          if (data.length > 0) {
            setCenter([data[0].latitude, data[0].longitude]);
          }
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des positions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
    const interval = setInterval(fetchPositions, 30000); // Polling toutes les 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="animate-pulse">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />

        {collectrices.map((c) => (
          <Marker 
            key={c.id} 
            position={[c.latitude, c.longitude]} 
            icon={CollectriceIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[150px]">
                <p className="font-bold text-slate-900 text-lg mb-1">{c.prenom} {c.nom}</p>
                <div className="flex items-center text-xs text-slate-500 mb-3">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                  En ligne maintenant
                </div>
                {c.derniereTransaction && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Dernière collecte</p>
                    <p className="font-bold text-emerald-600">{formatCurrency(c.derniereTransaction)}</p>
                  </div>
                )}
                <button className="w-full mt-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">
                  Voir itinéraire
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
