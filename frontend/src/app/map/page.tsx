"use client";

import React, { useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

function MapComponent() {
  const [markerLocation, setMarkerLocation] = useState({
    lat: 50.9647,
    lng: 20.945,
  });

  return (
    <div className="pt-12 space-y-8 bg-orange-gray h-full w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Mapa Miejsc</h1>
      </div>
      <div className="flex justify-center">
        <h3> Legenda</h3>
      </div>
      <div className="flex justify-center p-20">
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <Map
            style={{ width: "60vw", height: "60vh" }}
            defaultCenter={{ lat: 50.0647, lng: 19.945 }}
            defaultZoom={8}
            gestureHandling={"cooperative"}
            disableDefaultUI={true}
          />
          <Marker position={markerLocation} />
        </APIProvider>
      </div>
    </div>
  );
}

export default MapComponent;
