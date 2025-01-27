import { IsString, IsEmail, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDTO {
    id! : number;

    @IsString()
    @IsNotEmpty()
    newPassword!: String;
    
  }

  // export class RequestResetPasswordDTO {
  //   @IsString()
  //   @IsEmail()
  //   email!: string;
    
  // }

  export class ChangePasswordDTO{
      @IsNotEmpty()
      @IsString()
      oldPassword!: string

      @IsNotEmpty()
      @IsString()
      @Length(5, 35)
      newPassword!: string
  }