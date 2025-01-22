
import { LoginDTO } from "../../dto/login.dto";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { AuthService } from "../auth.service";
import Jwt  from "jsonwebtoken"
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { StatusCodes } from "http-status-codes";
import { VerifyEmailDTO } from "../../dto/passwordSet.dto";
import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { generateOtp } from "../../utils/otp.util";
import { welcomeEmail, sendOtpEmail } from "../../templates/Email";
import { ResetPasswordDTO, RequestResetPasswordDTO } from "../../dto/resetPassword.dto";


export class AuthServiceImpl implements AuthService{
   async requestPasswordReset(
    data: RequestResetPasswordDTO
  ): Promise<void>{
       const user = await db.user.findUnique({
        where: {
          email: data.email,
        },
       })
       if(!user){
        throw new CustomError(StatusCodes.NOT_FOUND, "User with this email does not exist")
       }

       const resetToken = this.generateAccessToken(user.id, user.firstName || "", user.role)

       await db.user.update({
        where: {
          email: data.email,
        },
        data: {
          resetPasswordToken: resetToken,
          resetPasswordTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
        }
       })

       const resetLink = `${process.env.CLIENT_URL}?token=${resetToken}`

       await sendOtpEmail({
        to: user.email,
        subject: "Reset Password",
        otp: resetLink
       })
   }

   async resetPassword(
    data: ResetPasswordDTO
  ): Promise<void> {
       let token: any
       
       try{
        token = Jwt.verify(data.token, process.env.JWT_SECRET || "")
       }catch(error){
        throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid or expired token.")
       }

       const user = await db.user.findUnique({
        where: {
           id: token.id,
        }
       })
       if(!user){
        throw new CustomError(StatusCodes.NOT_FOUND, "User not found.")
       }

       if(user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date()){
        throw new CustomError(StatusCodes.BAD_REQUEST, "Token has Expired")
       }

       const hashNewPassword = await hashPassword(data.newPassword);
       await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            password: hashNewPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null
          },
       })
   }

    async login(
        data: LoginDTO
      ): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await db.user.findUnique({
          where: {
            email: data.email,
          },
        });
        if (!user) {
          throw new CustomError(401, "Invalid password or email");
        }
    
        const isPasswordValid = await comparePassword(data.password, user.password || "");
        if (!isPasswordValid) {
          throw new CustomError(401, "Invalid password or email");
        }
    
        //
        const fullName = user.firstName + " " + user.lastName;
        const accessToken = this.generateAccessToken(user.id, fullName, user.role);
    
        const refreshToken = this.generateRefreshToken(
          user.id,
          fullName,
          user.role
        );
    
        return { accessToken, refreshToken };
      }

    async verifyEmail(data: VerifyEmailDTO): Promise<User> {
        const user = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (!user) {
          throw new CustomError(StatusCodes.NOT_FOUND, "Email not found");
        }
        if (user.emailVerified) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Email already verified");
        }
        if (!user.otp || !user.otpExpiry) {
          throw new CustomError(
            StatusCodes.BAD_REQUEST,
            "OTP is not available for this user"
          );
        }

    
        const isOtPValid = await comparePassword(data.otp, user.otp);
        if (!isOtPValid) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "Invalid OTP");
        }
    
        const isExpiredOtp = user.otpExpiry < new Date();
    
        if (isExpiredOtp) {
          throw new CustomError(StatusCodes.BAD_REQUEST, "OTP is expired");
        }
    
        const userReg = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: true,
            otp: null,
            otpExpiry: null,
          },
        });
        //
    
        await welcomeEmail({
          to: userReg.email,
          subject: "Welcome to Futurerify",
          name: userReg.firstName + " " + userReg.lastName,
        });
    
        return userReg;
      }
    
    
      async createUser(data: CreateUserDTO): Promise<User> {
        const otp = generateOtp();
        const isUserExist = await db.user.findFirst({
          where: {
            email: data.email,
          },
        });
    
        if (isUserExist) {
          throw new CustomError(409, "oops email already taken");
        }
    
        const hashedOtp = await hashPassword(otp);
        const maRetries = 3;
        for (let attempt = 1; attempt <= maRetries; attempt++) {
          try {
            return await db.$transaction(async (transaction) => {
              const user = await transaction.user.create({
                data: {
                  email: data.email,
                  password: await hashPassword(data.password),
                  firstName: data.firstName,
                  lastName: data.lastName,
                  role: data.role,
                  otp: hashedOtp,
                  otpExpiry: this.generateOtpExpiration(),
                },
              });
    
              await sendOtpEmail({
                to: data.email,
                subject: "Verify your email",
                otp,
              });
              return user;
            });
          } catch (error) {
            console.warn(`Retry ${attempt} due to transaction failure`, error);
            if (attempt === maRetries) {
              throw new CustomError(
                StatusCodes.INTERNAL_SERVER_ERROR,
                "Failed to create user after multiple retry"
              );
            }
          }
        }
        throw new CustomError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Unexpected error during user creation"
        );
    
       
      }

      async updateProfilePic(
        id: number,
        data: { profilePic: string }
      ): Promise<Object | any> {
        const user = await db.user.findFirst({
          where: { id },
        });
    
        if (!user) {
          throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
        }
        const updatedUser = await db.user.update({
          where: {
            id,
          },
          data: { profilePicture: data.profilePic },
        });
    
        //return updateuser without sensitive fileds like password
        return {
          id: updatedUser.id,
          name: updatedUser.firstName,
          email: updatedUser.email,
          profilePicture: updatedUser.profilePicture,
        };
      }


       generateAccessToken(userId: number, name: string, role:string): string {
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_ACCESS_EXPIRES, 
            });
        }

        generateRefreshToken(userId: number, name: string, role: string): string{
            return Jwt.sign({id: userId, name, role}, process.env.JWT_SECRET || "", {
                expiresIn: process.env.JWT_REFRESH_EXPIRES
            })
        }

        generateOtpExpiration(){
            return new Date(Date.now() + 10 * 60 * 1000)
        }
    }

