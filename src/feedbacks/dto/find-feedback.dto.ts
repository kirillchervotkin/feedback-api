import { IsNotEmpty, IsDate, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class FindFeedbackDto {

    @ValidateIf((obj)=> typeof obj.to !== 'undefined')
    @IsNotEmpty()
    @Type(() => Date) 
    @IsDate()
    from: Date;

    @ValidateIf((obj)=> typeof obj.from !== 'undefined')
    @IsNotEmpty()
    @Type(() => Date) 
    @IsDate()
    to: Date;

}

