"use client";

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { RatingStars } from '@bedside/ui';

interface Review {
  id: string;
  overall: number;
  text?: string;
  verification_level: string;
}

interface FacilityDetail {
  id: string;
  name: string;
  address?: string;
  measures?: Record<string, number | string | null>;
  rating_average?: number;
  reviews?: Review[];
}

async function fetchFacility(id: string) {
  const res = await axios.get<FacilityDetail>(`/api/v1/facilities/${id}`);
  return res.data;
}

export default function FacilityPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: facility, isLoading } = useQuery({
    queryKey: ['facility', id],
    queryFn: () => fetchFacility(id),
    enabled: !!id,
  });

  if (isLoading || !facility) {
    return <p className="p-8 text-gray-500">Loading…</p>;
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{facility.name}</h1>
        {facility.address && <p className="text-sm text-gray-500">{facility.address}</p>}
        {facility.rating_average != null && (
          <div className="flex items-center space-x-2">
            <RatingStars value={facility.rating_average} />
            <span className="text-sm text-gray-600">{facility.rating_average.toFixed(1)} / 5</span>
          </div>
        )}
      </div>

      {/* Measures */}
      {facility.measures && Object.keys(facility.measures).length > 0 && (
        <section>
          <h2 className="text-xl font-medium mb-2">Objective Measures</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(facility.measures).map(([key, value]) => (
              <li key={key} className="bg-white p-4 rounded-md shadow-sm">
                <p className="font-medium capitalize">{key.replace(/_/g, ' ')}</p>
                <p className="text-sm text-gray-700">{String(value)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="text-xl font-medium mb-2">Recent Reviews</h2>
        {facility.reviews && facility.reviews.length > 0 ? (
          <ul className="space-y-4">
            {facility.reviews.map((review) => (
              <li key={review.id} className="bg-white p-4 rounded-md shadow">
                <div className="flex items-center justify-between">
                  <RatingStars value={review.overall} />
                  <span className="text-xs text-gray-500 capitalize">
                    {review.verification_level.replace('_', ' ')}
                  </span>
                </div>
                {review.text && <p className="mt-2 text-gray-700">{review.text}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        )}
      </section>
    </main>
  );
}
