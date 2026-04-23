"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function BackgroundTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    // Ne tracker que si c'est une collectrice connectée
    if (!session?.user || (session.user as any).role !== "COLLECTRICE") return;

    let lastSent = 0;
    const INTERVAL_MS = 30000; // Envoyer toutes les 30 secondes

    const sendPosition = async (pos: GeolocationPosition) => {
      const now = Date.now();
      if (now - lastSent < INTERVAL_MS) return;

      try {
        await fetch("/api/positions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            precision: pos.coords.accuracy,
            vitesse: pos.coords.speed,
          }),
        });
        lastSent = now;
      } catch (err) {
        console.error("Erreur lors de l'envoi de la position:", err);
      }
    };

    const watchId = navigator.geolocation.watchPosition(
      sendPosition,
      (err) => console.error("Erreur GPS:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [session]);

  return null; // Composant invisible
}
