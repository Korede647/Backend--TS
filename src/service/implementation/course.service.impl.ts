import { Course } from "@prisma/client";
import { CreateCourseDTO } from "../../dto/createCourse.dto";
import { UserService } from "../course.service";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import redisClient from "../../redisClient";


export class CourseServiceImpl implements UserService{
    async createCourse(data: CreateCourseDTO): Promise<Course> {
        const isCourseExist = await db.course.findFirst({
            where: {
                title: data.title,
            }
        });
        
        if(isCourseExist){
            throw new CustomError(409, "Course already added")
        }
        const course = await db.course.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                duration: data.duration
            },
        })
        return course;
    }

    async getCourseById(id: number): Promise<Course | null> {
        const cacheKey = `course:${id}`

        const cachedCourse = await redisClient.get(cacheKey) 
        if(cachedCourse){
            return JSON.parse(cachedCourse)
        }   
        const course = await db.course.findUnique({
            where : {
                id,
            }
        })
        if(!course){
            throw new CustomError (404, `Course with id: ${id} is not found`)
        }
        if(course){
            await redisClient.setex(cacheKey, 3600, JSON.stringify(course))
        }
        return course;
    }

    async getAllCourses(): Promise<Course[]> {
        const cacheKeys = `courses: all`
        return await db.course.findMany()
    }

    async updateCourse(id: number, data: Partial<CreateCourseDTO>): Promise<Course> {
        const isCourseAvailable = await db.course.findFirst({
            where: {
                id,
            },
        })
        if(!isCourseAvailable){
            throw new CustomError (404, `Course with id: ${id} is not found`)
        }
        const course = await db.course.update({
            where: { id },
            data,
        })
        return course;
    }

    async deleteCourse(id: number): Promise<void> {
        await db.course.delete({
            where: { id },
        })
    }
}