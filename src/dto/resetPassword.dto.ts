import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDTO {
    id! : number;

    @IsString()
    @IsNotEmpty()
    newPassword!: string;

    @IsString()
    token!: string;
    
  }

  export class RequestResetPasswordDTO {
    @IsString()
    @IsEmail()
    email!: string;
    
    // @IsNotEmpty()
    // @IsString()
    // @Length(6, 6)
    // otp!: string;
  }