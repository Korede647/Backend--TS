import { Course } from '@prisma/client';
import { CreateCourseDTO } from '../dto/createCourse.dto';
export interface UserService {
    createCourse(data: CreateCourseDTO): Promise<Course>;
    getCourseById(id: number): Promise<Course | null>;
    getAllCourses(): Promise<Course[]>;
    updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course>;
    deleteCourse(id: number): Promise<void>;
}
