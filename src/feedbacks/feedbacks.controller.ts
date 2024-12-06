import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, NotFoundException, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { AuthGuard } from '../auth/auth';
import { FindFeedbackDto } from './dto/find-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Controller('feedbacks')
export class FeedbacksController {
  constructor(
    private readonly feedbacksService: FeedbacksService,
  ) { }

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    this.feedbacksService.create(createFeedbackDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Query() findFeedbackDto: FindFeedbackDto) {
    if (Object.keys(findFeedbackDto).length) {
      return this.feedbacksService.findAllBetween(findFeedbackDto.from, findFeedbackDto.to);
    } else {
      return this.feedbacksService.findAll();
    }
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const feedback: Feedback = await this.feedbacksService.findOne(+id);
    if (feedback) {
      return this.feedbacksService.findOne(id);
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateFeedbackDto: UpdateFeedbackDto) {
    let feedback = await this.feedbacksService.update(id, updateFeedbackDto);
    if (feedback) {
      return feedback;
    } else {
      throw new NotFoundException();
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.feedbacksService.remove(+id);
  }
}
