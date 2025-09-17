import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { FacilitiesService } from '../services/facilities.service';

@Controller('facilities')
export class FacilitiesController {
  constructor(private readonly facilitiesService: FacilitiesService) {}

  @Get()
  getFacilities(@Query('query') query?: string) {
    return this.facilitiesService.getFacilities(query);
  }

  @Get(':id')
  getFacility(@Param('id') id: string) {
    const facility = this.facilitiesService.getFacilityById(id);
    if (!facility) {
      throw new NotFoundException();
    }
    const reviews = this.facilitiesService.getReviewsForFacility(id);
    return { ...facility, reviews };
  }
}
