import { Inject, Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { Between, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { FindFeedbackDto } from './dto/find-feedback.dto';

@Injectable()
export class FeedbacksService {
  constructor(
    @Inject('FEEDBACK_REPOSITORY')
    private feedbackRepository: Repository<Feedback>,
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto) {
    await this.feedbackRepository.save(createFeedbackDto)
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find();
  }
  async findAllBetween(from: Date, to: Date): Promise<Feedback[]> {
    return this.feedbackRepository.findBy({
      date: Between(from, to)
    });
  }

  findOne(id: number) {
    return this.feedbackRepository.findOneBy({
      id: id
    })
  }

  async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> | undefined {
    const feedback: Feedback = await this.feedbackRepository.preload(Object.assign(updateFeedbackDto, { id: id }));
    this.feedbackRepository.update(id, updateFeedbackDto);
    return feedback;
  }

  remove(id: number) {
    this.feedbackRepository.delete(id);
  }
}
