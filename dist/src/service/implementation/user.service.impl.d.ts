import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { UserService } from "../user-service";
export declare class UserServiceImpl implements UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    profile(id: number): Promise<Omit<User, "password">>;
}
