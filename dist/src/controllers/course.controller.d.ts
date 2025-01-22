import { NextFunction, Request, Response } from "express";
export declare class CourseController {
    private courseService;
    constructor();
    createCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllCourses: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCourseById: (req: Request, res: Response, next: NextFunction) => Promise<void | any>;
    updateCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCourse: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
