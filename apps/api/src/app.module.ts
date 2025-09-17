import { Module } from '@nestjs/common';
import { FacilitiesController } from './controllers/facilities.controller';
import { CliniciansController } from './controllers/clinicians.controller';
import { ReviewsController } from './controllers/reviews.controller';
import { FacilitiesService } from './services/facilities.service';
import { CliniciansService } from './services/clinicians.service';
import { ReviewsService } from './services/reviews.service';

@Module({
  controllers: [FacilitiesController, CliniciansController, ReviewsController],
  providers: [FacilitiesService, CliniciansService, ReviewsService],
})
export class AppModule {}
