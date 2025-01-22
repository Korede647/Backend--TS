import { Course } from "@prisma/client";
import { CreateCourseDTO } from "../../dto/createCourse.dto";
import { UserService } from "../course.service";
export declare class CourseServiceImpl implements UserService {
    createCourse(data: CreateCourseDTO): Promise<Course>;
    getCourseById(id: number): Promise<Course | null>;
    getAllCourses(): Promise<Course[]>;
    updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course>;
    deleteCourse(id: number): Promise<void>;
}
