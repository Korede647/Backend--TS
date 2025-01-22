import { Role } from "@prisma/client";
export declare class CreateUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
}
