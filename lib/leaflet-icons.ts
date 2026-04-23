import L from "leaflet";

// Correction du bug des icônes Leaflet avec Next.js
export const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const CollectriceIcon = L.divIcon({
  className: "custom-div-icon",
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-10 h-10 bg-emerald-500/20 rounded-full animate-ping"></div>
      <div class="relative w-8 h-8 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});
