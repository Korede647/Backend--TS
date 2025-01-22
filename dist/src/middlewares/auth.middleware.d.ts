import { NextFunction, Response, Request } from "express";
export interface CustomRequest extends Request {
    userAuth?: string;
}
export declare const authenticateUser: (req: CustomRequest, res: Response, next: NextFunction) => void;
