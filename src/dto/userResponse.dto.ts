import { Role } from "@prisma/client"

export class UserResponseDTO {
    
    firstName!: string;
    lastName!: string;
    email!: string;
    role!: Role;

}