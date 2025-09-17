// Sample in‑memory data used by the API service.  In a production
// deployment this would be replaced by a database (e.g. PostgreSQL via
// Prisma).  The data here is intentionally small and simple.

export interface Facility {
  id: string;
  name: string;
  address?: string;
  measures?: Record<string, number | string | null>;
  rating_average?: number;
}

export interface Clinician {
  npi: string;
  first_name?: string;
  last_name?: string;
  specialties?: string[];
  affiliations?: string[];
  measures?: Record<string, number | string | null>;
  rating_average?: number;
}

export interface Review {
  id: string;
  target_type: 'facility' | 'clinician';
  target_id: string;
  overall: number;
  text?: string;
  verification_level: 'none' | 'verified_account' | 'verified_visit';
}

export const facilities: Facility[] = [
  {
    id: 'fac_001',
    name: 'General Hospital',
    address: '123 Main St, Anytown, USA',
    rating_average: 4.2,
    measures: {
      hcahps_summary_star: 4,
      readmission_rate: 12.5,
    },
  },
  {
    id: 'fac_002',
    name: 'City Clinic',
    address: '456 Oak Ave, Somecity, USA',
    rating_average: 3.8,
    measures: {
      hcahps_summary_star: 3,
    },
  },
];

export const clinicians: Clinician[] = [
  {
    npi: '1234567890',
    first_name: 'Alice',
    last_name: 'Smith',
    specialties: ['Cardiology'],
    affiliations: ['fac_001'],
    rating_average: 4.5,
    measures: {
      qpp_mips_score: 98.5,
    },
  },
  {
    npi: '9876543210',
    first_name: 'Bob',
    last_name: 'Jones',
    specialties: ['Pediatrics'],
    affiliations: ['fac_002'],
    rating_average: 4.1,
  },
];

export const reviews: Review[] = [];
