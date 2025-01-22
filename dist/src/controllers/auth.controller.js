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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_impl_1 = require("../service/implementation/auth.service.impl");
const http_status_codes_1 = require("http-status-codes");
class AuthController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const { accessToken, refreshToken } = yield this.authService.login(data);
                res.status(201).json({ accessToken, refreshToken });
            }
            catch (error) {
                next(error);
            }
        });
        this.createUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield this.authService.createUser(data);
                res.status(201).json({
                    error: false,
                    message: `Otp has been sent successfully to your email @ ${user.email}`,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const user = yield this.authService.verifyEmail(data);
                res.status(http_status_codes_1.StatusCodes.CREATED).json({
                    error: false,
                    message: "You have successfully registered",
                    data: user,
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.requestPasswordReset = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                yield this.authService.requestPasswordReset(data);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Reset link sent to your email"
                });
            }
            catch (error) {
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({
                    message: "Internal Server Error"
                });
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                yield this.authService.resetPassword(data);
                res.status(http_status_codes_1.StatusCodes.OK).json({
                    message: "Password reset successful"
                });
            }
            catch (error) {
                console.error(error);
                res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: "Internal Server Error"
                });
            }
        });
        this.authService = new auth_service_impl_1.AuthServiceImpl();
    }
}
exports.AuthController = AuthController;
