import { Response, Request, NextFunction } from "express";
import { CustomRequest } from "../middlewares/auth.middleware";
export declare class UserController {
    private userService;
    constructor();
    createUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void | any>;
    getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    profile: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void | any>;
}
