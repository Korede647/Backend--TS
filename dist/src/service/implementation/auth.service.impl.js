"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceImpl = void 0;
const password_util_1 = require("../../utils/password.util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../config/db");
const customError_error_1 = require("../../exceptions/customError.error");
const http_status_codes_1 = require("http-status-codes");
const otp_util_1 = require("../../utils/otp.util");
const Email_1 = require("../../templates/Email");
class AuthServiceImpl {
    requestPasswordReset(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User with this email does not exist");
            }
            const resetToken = this.generateAccessToken(user.id, user.firstName || "", user.role);
            yield db_1.db.user.update({
                where: {
                    email: data.email,
                },
                data: {
                    resetPasswordToken: resetToken,
                    resetPasswordTokenExpiry: new Date(Date.now() + 15 * 60 * 1000)
                }
            });
            const resetLink = `${process.env.CLIENT_URL}?token=${resetToken}`;
            yield (0, Email_1.sendOtpEmail)({
                to: user.email,
                subject: "Reset Password",
                otp: resetLink
            });
        });
    }
    resetPassword(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let token;
            try {
                token = jsonwebtoken_1.default.verify(data.token, process.env.JWT_SECRET || "");
            }
            catch (error) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid or expired token.");
            }
            const user = yield db_1.db.user.findUnique({
                where: {
                    id: token.id,
                }
            });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found.");
            }
            if (user.resetPasswordTokenExpiry && user.resetPasswordTokenExpiry < new Date()) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Token has Expired");
            }
            const hashNewPassword = yield (0, password_util_1.hashPassword)(data.newPassword);
            yield db_1.db.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashNewPassword,
                    resetPasswordToken: null,
                    resetPasswordTokenExpiry: null
                },
            });
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findUnique({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new customError_error_1.CustomError(401, "Invalid password or email");
            }
            const isPasswordValid = yield (0, password_util_1.comparePassword)(data.password, user.password || "");
            if (!isPasswordValid) {
                throw new customError_error_1.CustomError(401, "Invalid password or email");
            }
            //
            const fullName = user.firstName + " " + user.lastName;
            const accessToken = this.generateAccessToken(user.id, fullName, user.role);
            const refreshToken = this.generateRefreshToken(user.id, fullName, user.role);
            return { accessToken, refreshToken };
        });
    }
    verifyEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (!user) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "Email not found");
            }
            if (user.emailVerified) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email already verified");
            }
            if (!user.otp || !user.otpExpiry) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is not available for this user");
            }
            const isOtPValid = yield (0, password_util_1.comparePassword)(data.otp, user.otp);
            if (!isOtPValid) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid OTP");
            }
            const isExpiredOtp = user.otpExpiry < new Date();
            if (isExpiredOtp) {
                throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.BAD_REQUEST, "OTP is expired");
            }
            const userReg = yield db_1.db.user.update({
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
            yield (0, Email_1.welcomeEmail)({
                to: userReg.email,
                subject: "Welcome to Futurerify",
                name: userReg.firstName + " " + userReg.lastName,
            });
            return userReg;
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, otp_util_1.generateOtp)();
            const isUserExist = yield db_1.db.user.findFirst({
                where: {
                    email: data.email,
                },
            });
            if (isUserExist) {
                throw new customError_error_1.CustomError(409, "oops email already taken");
            }
            const hashedOtp = yield (0, password_util_1.hashPassword)(otp);
            const maRetries = 3;
            for (let attempt = 1; attempt <= maRetries; attempt++) {
                try {
                    return yield db_1.db.$transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                        const user = yield transaction.user.create({
                            data: {
                                email: data.email,
                                password: yield (0, password_util_1.hashPassword)(data.password),
                                firstName: data.firstName,
                                lastName: data.lastName,
                                role: data.role,
                                otp: hashedOtp,
                                otpExpiry: this.generateOtpExpiration(),
                            },
                        });
                        yield (0, Email_1.sendOtpEmail)({
                            to: data.email,
                            subject: "Verify your email",
                            otp,
                        });
                        return user;
                    }));
                }
                catch (error) {
                    console.warn(`Retry ${attempt} due to transaction failure`, error);
                    if (attempt === maRetries) {
                        throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Failed to create user after multiple retry");
                    }
                }
            }
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, "Unexpected error during user creation");
        });
    }
    generateAccessToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name, role }, process.env.JWT_SECRET || "", {
            expiresIn: process.env.JWT_ACCESS_EXPIRES,
        });
    }
    generateRefreshToken(userId, name, role) {
        return jsonwebtoken_1.default.sign({ id: userId, name, role }, process.env.JWT_SECRET || "", {
            expiresIn: process.env.JWT_REFRESH_EXPIRES
        });
    }
    generateOtpExpiration() {
        return new Date(Date.now() + 10 * 60 * 1000);
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
