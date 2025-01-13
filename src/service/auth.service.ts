import { User } from "@prisma/client";
import { CreateUserDTO } from "../dto/createUser.dto";
import { LoginDTO } from "../dto/login.dto";

export interface AuthService {
    login(data: LoginDTO): Promise<{accessToken: string; refreshToken: string}>;
    // createUser(data: CreateUserDTO): Promise<User>
}