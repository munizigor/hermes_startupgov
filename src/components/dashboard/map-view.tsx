
"use client";

import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, useMapsLibrary } from '@vis.gl/react-google-maps';
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

  // Use the hook to load the geocoding library
  const geocodingLibrary = useMapsLibrary('geocoding');

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (key) {
      setApiKey(key);
    } else {
      console.warn("Google Maps API Key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) is not set. Map functionality will be limited.");
      setError("Chave da API do Google Maps não configurada.");
    }
  }, []);

  useEffect(() => {
    // Proceed only if address, apiKey, and the geocoding library are available
    if (address && apiKey && geocodingLibrary) {
      const geocoder = new geocodingLibrary.Geocoder();
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
          // Do not reset to default center/zoom here if geocoding fails for a specific address,
          // map can remain on previous valid location or show an error.
          // If you want to reset, uncomment these lines:
          // setCenter(DEFAULT_CENTER);
          // setZoom(DEFAULT_ZOOM);
          // setMarkerPosition(null);
        }
      });
    } else if (!address && apiKey) { // If address is cleared, reset map
      setCenter(DEFAULT_CENTER);
      setZoom(DEFAULT_ZOOM);
      setMarkerPosition(null);
      setError(null); // Clear error if no address is provided
    }
  }, [address, apiKey, geocodingLibrary]); // Add geocodingLibrary to dependencies

  if (!apiKey) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-md p-4">
        <p className="text-destructive text-center">
          {error || "A chave da API do Google Maps é necessária para exibir o mapa."}
        </p>
      </div>
    );
  }
  
  // The APIProvider and its children (Map, Marker, hooks like useMapsLibrary)
  // will handle their own loading states internally.
  // A general Skeleton can be shown if geocodingLibrary is not yet available,
  // or simply let the map component handle its initial state.
  // For now, we let the useEffect for geocoding wait.

  return (
    <div className="w-full h-full rounded-md overflow-hidden border flex flex-col">
      <APIProvider apiKey={apiKey} solutionChannel="GMP_visgl_rgm_reacthook_v1">
        <Map
          center={center}
          zoom={zoom}
          mapId="central-193-map"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="flex-grow" // Make map take available space
        >
          {markerPosition && <Marker position={markerPosition} />}
        </Map>
      </APIProvider>
      {error && <p className="text-destructive text-xs p-2 text-center">{error}</p>}
    </div>
  );
}
