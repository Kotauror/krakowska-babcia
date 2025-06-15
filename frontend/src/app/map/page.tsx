"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  InfoWindow,
  LoadScript,
  Marker,
} from "@react-google-maps/api";
import { getPosts } from "@/lib/api";
import type { Post } from "@/types/post";

function MapComponent() {
  const [selectedMarker, setSelectedMarker] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const center = {
    lat: 49.609,
    lng: 19.9672,
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="pt-12 space-y-8 bg-orange-gray min-h-screen pb-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const filterCard = (name: string, image: string) => {
    return (
      <div className="border-1 border-gray-900 rounded-lg p-4 items-center justify-center text-center flex flex-col w-20 h-25">
        <img src={image} alt="marker" />
        <h3> {name}</h3>
      </div>
    );
  };

  return (
    <div className="pt-12 space-y-8 bg-orange-gray min-h-screen pb-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Mapa Miejsc</h1>
      </div>
      <div className="flex justify-center items-center">
        <div className="flex gap-8 items-center justify-center">
          {filterCard("Natura", "./natura-marker.png")}
          {filterCard("Kultura", "./kultura-marker.png")}
          {filterCard("Sport", "./sport-marker.png")}
          {filterCard("Zabawa", "./zabawa-marker.png")}
        </div>
      </div>
      <div className="flex justify-center">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
        >
          <GoogleMap
            mapContainerStyle={{ width: "1200px", height: "700px" }}
            center={center}
            zoom={9}
          >
            {posts.map((post) => {
              console.log(post.latitude);
              return (
                <Marker
                  key={post.id}
                  position={{ lat: post.latitude, lng: post.longitude }}
                  // icon={{
                  //   url: `./${post.type}-marker.png`,
                  // }}
                  onClick={() => setSelectedMarker(post)}
                />
              );
            })}

            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.latitude,
                  lng: selectedMarker.longitude,
                }}
                onCloseClick={() => setSelectedMarker(null)}
                options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
              >
                <div>
                  <h3 className="font-bold">{selectedMarker.title}</h3>
                  <p>{selectedMarker.destination}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}

export default MapComponent;
