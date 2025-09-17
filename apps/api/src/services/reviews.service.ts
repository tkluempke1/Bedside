import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { FacilitiesService } from './facilities.service';
import { CliniciansService } from './clinicians.service';
import { Review } from '../data/sample-data';
import { reviewSchema, ReviewInput } from '@bedside/schemas/review';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly facilitiesService: FacilitiesService,
    private readonly cliniciansService: CliniciansService,
  ) {}

  /**
   * Create a new review.  Validates the incoming payload using Zod and
   * dispatches to the appropriate service (facility or clinician).  Returns
   * the created review record including its generated ID and status.
   */
  async createReview(input: ReviewInput): Promise<{ id: string; status: string }> {
    // Validate using shared Zod schema
    const parsed = reviewSchema.safeParse(input);
    if (!parsed.success) {
      throw new BadRequestException({ message: 'validation_failed', issues: parsed.error.issues });
    }
    const data = parsed.data;
    // Check that the target exists
    if (data.target_type === 'facility') {
      const facility = this.facilitiesService.getFacilityById(data.target_id);
      if (!facility) {
        throw new NotFoundException({ message: 'entity_not_found' });
      }
    } else {
      const clinician = this.cliniciansService.getClinicianByNpi(data.target_id);
      if (!clinician) {
        throw new NotFoundException({ message: 'entity_not_found' });
      }
    }
    // Construct review entity
    const review: Review = {
      id: `rev_${this.generateId()}`,
      target_type: data.target_type,
      target_id: data.target_id,
      overall: data.overall,
      text: data.text,
      verification_level: 'none',
    };
    // Save to appropriate collection
    if (review.target_type === 'facility') {
      this.facilitiesService.addReview(review);
    } else {
      this.cliniciansService.addReview(review);
    }
    return { id: review.id, status: 'published' };
  }

  /**
   * Generate a pseudo‑random identifier for a review.  This is not a
   * cryptographically secure ULID, but it suffices for demonstration.
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 12);
  }
}
