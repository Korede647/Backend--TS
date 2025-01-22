import { User } from '@prisma/client'
import { CreateUserDTO } from '../dto/createUser.dto'

export interface UserService {
    createUser(data: CreateUserDTO): Promise<User>;
    getUserById(id: number): Promise<User | null>;
    getAllUsers(): Promise<User[]>;
    updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User>;
    deleteUser(id: number): Promise<void>;
    profile(id: number): Promise<Omit<User, "password">>
    updateProfilePic(id: number, data: { profilePic: string }): Promise<Object | any>;
}