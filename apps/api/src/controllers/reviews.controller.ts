import { Controller, Post, Body } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  async create(@Body() body: any) {
    return await this.reviewsService.createReview(body);
  }
}
