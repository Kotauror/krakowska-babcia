"use client";

import React, { useState, useEffect } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import { getPosts } from "@/lib/api";
import type { Post } from "@/types/post";

function MapComponent() {
  const [selectedMarker, setSelectedMarker] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const center = { lat: 49.8335, lng: 19.9396 };

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

  const ALLOWED_TAGS = [
    "w góry",
    "nad wodę",
    "regionalna kultura",
    "w niepogodę",
    "budżetowo",
    "z nocowankiem",
    "dzieciaczkowy raj",
  ];

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <div className="bg-gray-100">
        <div className="flex flex-wrap justify-center pt-4">
          {/* <div style={{ height: "20vh", width: "100%" }}> */}

          {ALLOWED_TAGS.map((tag) => (
            <button
              key={tag}
              className="border-1 border-gray-500 md:mx-2 md:my-1 md:px-4 px-2 py-1 rounded hover:bg-light-brick-orange hover:cursor-pointer"
              onClick={() =>
                router.push(`/destinations?tag=${encodeURIComponent(tag)}`)
              }
            >
              {tag}
            </button>
          ))}

          {/* </div> */}
        </div>
        <div style={{ height: "100vh", width: "100%" }} className="mt-4">
          <Map
            defaultZoom={9}
            defaultCenter={center}
            onCameraChanged={(ev) =>
              console.log(
                "camera changed:",
                ev.detail.center,
                "zoom:",
                ev.detail.zoom
              )
            }
            mapId={"298d9f1b27024ac234909302"}
            // styles={mapStyles}
          />
          {posts.map((post) => (
            <AdvancedMarker
              key={post.id}
              position={{ lat: post.latitude, lng: post.longitude }}
            >
              {" "}
              <div
                style={{
                  width: "32px", // Specify the unit for width
                  height: "32px", // Specify the unit for height
                  backgroundColor: "red",
                  borderRadius: "50%", // Optional, to make the marker round
                  background:
                    "radial-gradient(circle, rgba(255, 0, 0, 1) 0%, rgba(255, 0, 0, 0) 90%)", // Dark red at center, fades to transparent
                }}
              ></div>
            </AdvancedMarker>
          ))}
        </div>
      </div>
    </APIProvider>
  );
}

export default MapComponent;
