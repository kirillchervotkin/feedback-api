import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {

    @IsNotEmpty()
    text: string

    filename: string

    pathOfFile: string
}

