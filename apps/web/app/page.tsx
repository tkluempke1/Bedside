"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SearchBar } from '@bedside/ui';

interface Facility {
  id: string;
  name: string;
  address?: string;
}

async function fetchFacilities(query: string) {
  const res = await axios.get<Facility[]>(`/api/v1/facilities`, { params: { query } });
  return res.data;
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const { data: facilities } = useQuery({
    queryKey: ['facilities', query],
    queryFn: () => fetchFacilities(query),
    enabled: query.length > 0,
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Find Hospitals and Clinicians</h1>
      <SearchBar value={query} onChange={setQuery} placeholder="Search facilities or clinicians" />
      <div className="mt-6 space-y-2">
        {facilities && facilities.length > 0 ? (
          facilities.map((fac) => (
            <div
              key={fac.id}
              className="border rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <a href={`/facility/${fac.id}`} className="text-blue-600 font-medium">
                {fac.name}
              </a>
              {fac.address && <p className="text-sm text-gray-500">{fac.address}</p>}
            </div>
          ))
        ) : query.length > 0 ? (
          <p className="text-sm text-gray-500">No results found.</p>
        ) : (
          <p className="text-sm text-gray-500">Start typing to search for facilities.</p>
        )}
      </div>
    </main>
  );
}
