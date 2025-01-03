
import { IsNotEmpty, Length } from "class-validator";

export class CreateCourseDTO {
    @IsNotEmpty()
    @Length(2, 60)
    title!: string;

    @IsNotEmpty()
    description!: string;

    @IsNotEmpty()
    price!: number;

    @IsNotEmpty()
    @Length(6, 20)
    duration!: number;

}