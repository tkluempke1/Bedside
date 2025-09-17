import { Injectable } from '@nestjs/common';
import { Facility, facilities, reviews, Review } from '../data/sample-data';

@Injectable()
export class FacilitiesService {
  /**
   * Return a list of facilities filtered by the query string.  If no query
   * is provided, all facilities are returned.  Filtering is case
   * insensitive and matches substrings within the facility name.
   */
  getFacilities(query?: string): Facility[] {
    if (!query) {
      return facilities;
    }
    const q = query.toLowerCase();
    return facilities.filter((f) => f.name.toLowerCase().includes(q));
  }

  /**
   * Look up a facility by its ID.  Returns undefined if not found.
   */
  getFacilityById(id: string): Facility | undefined {
    return facilities.find((f) => f.id === id);
  }

  /**
   * Retrieve reviews for a facility.  This filters the global reviews
   * array to those targeted at the given facility.
   */
  getReviewsForFacility(id: string): Review[] {
    return reviews.filter((r) => r.target_type === 'facility' && r.target_id === id);
  }

  /**
   * Attach a review to a facility.  This method assumes that ID validation
   * and review schema validation have already been performed.
   */
  addReview(review: Review) {
    reviews.push(review);
    // recompute average rating for the facility
    const facility = this.getFacilityById(review.target_id);
    if (facility) {
      const facReviews = this.getReviewsForFacility(facility.id);
      const avg =
        facReviews.reduce((sum, r) => sum + r.overall, 0) / (facReviews.length || 1);
      facility.rating_average = parseFloat(avg.toFixed(2));
    }
  }
}
