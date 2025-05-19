"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';
import { Skeleton } from '@/components/ui/skeleton';

interface MapViewProps {
  address?: string;
}

// Default coordinates (e.g., center of a major city or country)
const DEFAULT_CENTER = { lat: -14.2350, lng: -51.9253 }; // Brazil
const DEFAULT_ZOOM = 4;

export function MapView({ address }: MapViewProps) {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [markerPosition, setMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This ensures window is defined, for accessing env variables that might be set client-side
    // (though NEXT_PUBLIC_ is available at build time)
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.warn("Google Maps API Key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) is not set. Map functionality will be limited.");
      setError("Chave da API do Google Maps não configurada.");
    }
  }, []);

  useEffect(() => {
    if (address && apiKey) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          const newCenter = { lat: location.lat(), lng: location.lng() };
          setCenter(newCenter);
          setMarkerPosition(newCenter);
          setZoom(15);
          setError(null);
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
          setError(`Não foi possível localizar o endereço: ${address}. Status: ${status}`);
          setCenter(DEFAULT_CENTER);
          setZoom(DEFAULT_ZOOM);
          setMarkerPosition(null);
        }
      });
    } else if (!address) {
      setCenter(DEFAULT_CENTER);
      setZoom(DEFAULT_ZOOM);
      setMarkerPosition(null);
      setError(null); // Clear error if no address is provided
    }
  }, [address, apiKey]);

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-md p-4">
        <p className="text-destructive text-center">
          {error || "A chave da API do Google Maps é necessária para exibir o mapa."}
        </p>
      </div>
    );
  }
  
  // Ensure google object is available before rendering Map component
  if (typeof window === 'undefined' || !window.google || !window.google.maps) {
     return <Skeleton className="w-full h-full rounded-md" />;
  }

  return (
    <div className="w-full h-full rounded-md overflow-hidden border">
      <APIProvider apiKey={apiKey}>
        <Map
          center={center}
          zoom={zoom}
          mapId="central-193-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="w-full h-full"
        >
          {markerPosition && <Marker position={markerPosition} />}
        </Map>
      </APIProvider>
      {error && <p className="text-destructive text-xs p-2">{error}</p>}
    </div>
  );
}
