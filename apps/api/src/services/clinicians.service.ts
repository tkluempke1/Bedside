import { Injectable } from '@nestjs/common';
import { Clinician, clinicians, reviews, Review } from '../data/sample-data';

@Injectable()
export class CliniciansService {
  /**
   * Return a list of clinicians filtered by name or NPI.  When a query is
   * provided it matches against first or last name or the NPI.  When npi is
   * provided exactly, it returns a single clinician if found.
   */
  getClinicians(options: { name?: string; npi?: string } = {}): Clinician[] {
    const { name, npi } = options;
    let result = clinicians;
    if (npi) {
      result = clinicians.filter((c) => c.npi === npi);
    } else if (name) {
      const q = name.toLowerCase();
      result = clinicians.filter((c) => {
        const fullName = `${c.first_name ?? ''} ${c.last_name ?? ''}`.trim().toLowerCase();
        return fullName.includes(q);
      });
    }
    return result;
  }

  getClinicianByNpi(npi: string): Clinician | undefined {
    return clinicians.find((c) => c.npi === npi);
  }

  getReviewsForClinician(npi: string): Review[] {
    return reviews.filter((r) => r.target_type === 'clinician' && r.target_id === npi);
  }

  addReview(review: Review) {
    reviews.push(review);
    const clinician = this.getClinicianByNpi(review.target_id);
    if (clinician) {
      const cReviews = this.getReviewsForClinician(clinician.npi);
      const avg =
        cReviews.reduce((sum, r) => sum + r.overall, 0) / (cReviews.length || 1);
      clinician.rating_average = parseFloat(avg.toFixed(2));
    }
  }
}
