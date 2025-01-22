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
const db_1 = require("../config/db");
const customError_error_1 = require("../exceptions/customError.error");
const http_status_codes_1 = require("http-status-codes");
const client_1 = require("@prisma/client");
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.db.user.findUnique({
            where: {
                id: Number(req.userAuth),
            }
        });
        if (!user) {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found");
        }
        if (user.role === client_1.Role.ADMIN) {
            next();
        }
        else {
            throw new customError_error_1.CustomError(http_status_codes_1.StatusCodes.FORBIDDEN, "Access denied");
        }
    }
    catch (error) {
        next(error);
    }
});
exports.default = isAdmin;
