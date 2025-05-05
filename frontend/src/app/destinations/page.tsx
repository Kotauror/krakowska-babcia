"use client";

import Link from "next/link";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { getDestinations } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import type { Destination } from "@/types/api";

function DestinationCard({ destination }: { destination: Destination }) {
  const mainImage = destination.posts[0]?.images[0];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {mainImage && (
        <div className="aspect-w-16 aspect-h-9 bg-gray-200">
          <img
            src={mainImage.file_path}
            alt={mainImage.alt_text}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-gray-600 mb-2">
          <MapPinIcon className="h-5 w-5 mr-2" />
          <span>
            {destination.city}, {destination.country}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {destination.name}
        </h3>
        <p className="text-gray-600 mb-4">
          {destination.description.substring(0, 150)}...
        </p>
        <Link
          href={`/destinations/${destination.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default function Destinations() {
  const { data: destinations, loading, error } = useApi(getDestinations);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Destinations</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore the places I've visited and discover their unique stories,
          culture, and experiences.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading destinations...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">
            Error loading destinations. Please try again later.
          </p>
        </div>
      ) : destinations && destinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            No destinations available yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
