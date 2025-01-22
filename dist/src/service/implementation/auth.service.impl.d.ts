import { LoginDTO } from "../../dto/login.dto";
import { AuthService } from "../auth.service";
import { VerifyEmailDTO } from "../../dto/passwordSet.dto";
import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { ResetPasswordDTO, RequestResetPasswordDTO } from "../../dto/resetPassword.dto";
export declare class AuthServiceImpl implements AuthService {
    requestPasswordReset(data: RequestResetPasswordDTO): Promise<void>;
    resetPassword(data: ResetPasswordDTO): Promise<void>;
    login(data: LoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    verifyEmail(data: VerifyEmailDTO): Promise<User>;
    createUser(data: CreateUserDTO): Promise<User>;
    generateAccessToken(userId: number, name: string, role: string): string;
    generateRefreshToken(userId: number, name: string, role: string): string;
    generateOtpExpiration(): Date;
}
