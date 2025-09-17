import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { CliniciansService } from '../services/clinicians.service';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Get()
  getClinicians(@Query('name') name?: string, @Query('npi') npi?: string) {
    return this.cliniciansService.getClinicians({ name, npi });
  }

  @Get(':npi')
  getClinician(@Param('npi') npi: string) {
    const clinician = this.cliniciansService.getClinicianByNpi(npi);
    if (!clinician) {
      throw new NotFoundException();
    }
    const reviews = this.cliniciansService.getReviewsForClinician(npi);
    return { ...clinician, reviews };
  }
}
