import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { LoginDTO } from "../../dto/login.dto";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { AuthService } from "../auth.service";
import Jwt  from "jsonwebtoken"
import env from 'dotenv'
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";


export class AuthServiceImpl implements AuthService{
    // requestPasswordReset(data: RequestResetPasswordDTO): Promise<void>

    async login(
        data: LoginDTO
    ): Promise<{accessToken: string; refreshToken: string}> {
        const user = await db.user.findUnique({
            where: {
                email: data.email,
        }
    });
        if(!user){
            throw new Error("User not found");
        }
        const isPasswordValid = await comparePassword(data.password, user.password)

        if(!isPasswordValid){
            throw new CustomError(401, "Invalid password or email");
        }

        const fullName = user.firstName + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.id, fullName, user.role);

        const refreshToken = this.generateRefreshToken(
            user.id,
            fullName,
            user.role
        )
        return { accessToken, refreshToken };
    }

    // async createUser(data: CreateUserDTO): Promise<User> {
    //     const hashedPassword = hashPassword(data.password);
    //     return 
    // }

        generateAccessToken(userId: number, name: string, role:string): string {
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_REFRESH_EXPIRES, 
            });
        }

        generateRefreshToken(userId: number, name: string, role: string): string{
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_REFRESH_EXPIRES
            })
        }
    }

