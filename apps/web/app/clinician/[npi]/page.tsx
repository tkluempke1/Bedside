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

interface ClinicianDetail {
  npi: string;
  first_name?: string;
  last_name?: string;
  specialties?: string[];
  affiliations?: string[];
  measures?: Record<string, number | string | null>;
  rating_average?: number;
  reviews?: Review[];
}

async function fetchClinician(npi: string) {
  const res = await axios.get<ClinicianDetail>(`/api/v1/clinicians/${npi}`);
  return res.data;
}

export default function ClinicianPage({ params }: { params: { npi: string } }) {
  const { npi } = params;
  const { data: clinician, isLoading } = useQuery({
    queryKey: ['clinician', npi],
    queryFn: () => fetchClinician(npi),
    enabled: !!npi,
  });

  if (isLoading || !clinician) {
    return <p className="p-8 text-gray-500">Loading…</p>;
  }

  const fullName = [clinician.first_name, clinician.last_name].filter(Boolean).join(' ');

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
          <h1 className="text-3xl font-semibold">{fullName || 'Clinician'}</h1>
          {clinician.specialties && clinician.specialties.length > 0 && (
            <p className="text-sm text-gray-500">{clinician.specialties.join(', ')}</p>
          )}
          {clinician.rating_average != null && (
            <div className="flex items-center space-x-2">
              <RatingStars value={clinician.rating_average} />
              <span className="text-sm text-gray-600">
                {clinician.rating_average.toFixed(1)} / 5
              </span>
            </div>
          )}
      </div>

      {/* Measures */}
      {clinician.measures && Object.keys(clinician.measures).length > 0 && (
        <section>
          <h2 className="text-xl font-medium mb-2">Performance Measures</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(clinician.measures).map(([key, value]) => (
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
        {clinician.reviews && clinician.reviews.length > 0 ? (
          <ul className="space-y-4">
            {clinician.reviews.map((review) => (
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
