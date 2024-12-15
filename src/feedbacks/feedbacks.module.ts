import { Module } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { DatabaseModule } from '../database/database.module';
import { feedbackProviders } from './feedback.providers';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/config';

@Module({
  imports: [DatabaseModule, JwtModule.register({
    global: true,
    secret: config.secret,
    signOptions: { expiresIn: '60s' },
  })],
  controllers: [FeedbacksController],
  providers: [...feedbackProviders, FeedbacksService],
})
export class FeedbacksModule { }
