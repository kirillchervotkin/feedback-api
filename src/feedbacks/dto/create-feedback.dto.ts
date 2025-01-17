import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {

    @IsNotEmpty()
    text: string

    filename: string

    file_path: string
}

