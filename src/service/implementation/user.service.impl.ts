import { User } from "@prisma/client";
import { CreateUserDTO } from "../../dto/createUser.dto";
import { UserService } from "../user.service";
import { CustomError } from "../../exceptions/customError.error";
import { db } from "../../config/db";
import { comparePassword, hashPassword } from "../../utils/password.util";
import { StatusCodes } from "http-status-codes";
import { ChangePasswordDTO } from "../../dto/resetPassword.dto";

export class UserServiceImpl implements UserService {
  async createUser(data: CreateUserDTO): Promise<User> {
    const isUserExist = await db.user.findFirst({
      where: {
        email: data.email,
      },
    });

    if (isUserExist) {
      throw new CustomError(409, "Oops email already taken");
    }

    const user = await db.user.create({
      data: {
        email: data.email,
        password: await hashPassword(data.password),
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });
    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await db.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new CustomError(404, `User with ${id} does not exist`);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.user.findMany();
  }

  async updateUser(id: number, data: Partial<CreateUserDTO>): Promise<User> {
    const isUserExist = await db.user.findFirst({
      where: {
        id, //id: id
      },
    });
    if (!isUserExist) {
      throw new CustomError(404, `User with ${id} does not exist`);
    }
    const user = await db.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async deleteUser(id: number): Promise<void> {
    const user = await db.user.findFirst({
      where: { id },
    });
    if (!user) {
      throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
    }
    await db.user.delete({
      where: { id },
    });
  }

  async profile(id: number): Promise<Omit<User, "password">> {
    const user = await db.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        `user with id ${id} not found`
      );
    }
    return user;
  }

  async setPassword(id: number, data: ChangePasswordDTO): Promise<void> {
    await db.$transaction(async (transaction) => {
      const user = await transaction.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
      }

      const isPasswordValid = await comparePassword(
        data.oldPassword,
        user.password || ""
      );

      if (!isPasswordValid) {
        throw new CustomError(400, "Current password is incorrect");
      }

      const previousPasswords = await transaction.passwordHistory.findMany({
        where: {
          userId: id,
        },
        select: {
          passwordHash: true,
        },
      });
      for (const history of previousPasswords) {
        const isPreviouslyUsed = await comparePassword(
          data.newPassword,
          history.passwordHash
        );

        if (isPreviouslyUsed) {
          throw new CustomError(
            400,
            "The New Password has been used before. Please choose a different password"
          );
        }
      }

      if (user.password) {
        await transaction.passwordHistory.create({
          data: {
            userId: id,
            passwordHash: user.password,
          },
        });
      }

      const hashedPassword = await hashPassword(data.newPassword);

      await transaction.user.update({
        where: { id },
        data: {
          password: hashedPassword,
        },
      });

      const passwordHistoryCount = await transaction.passwordHistory.count({
        where: {
          userId: id
        }
      })

      if(passwordHistoryCount > 5){
        const oldestPassword = await transaction.passwordHistory.findFirst({
           where: {
            userId: id
           },
           orderBy: {
            createdAt: 'asc'
           },
        })
        if(oldestPassword){
           await transaction.passwordHistory.delete({
            where: {
              id: oldestPassword.id
            },
           })
        }
      }
      
      // await passwordChangeEmail ({
      //   to: user.email,
      //   subject: "Password change"
        
      // })
      
    });
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

    //return updateuser without sensitive fields like password
    return {
      id: updatedUser.id,
      name: updatedUser.firstName,
      email: updatedUser.email,
      profilePicture: updatedUser.profilePicture,
    };
  }
}
