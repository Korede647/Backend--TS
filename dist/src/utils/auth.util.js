"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateAccessToken = (userId, name) => {
    return jsonwebtoken_1.default.sign({ id: userId, name }, process.env.JWT_SECRET || "", {
        expiresIn: process.env.JWT_ACCESS_EXPIRES,
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId, name) => {
    return jsonwebtoken_1.default.sign({ id: userId, name }, process.env.JWT_SECRET || "", {
        expiresIn: process.env.JWT_REFRESH_EXPIRES
    });
};
exports.generateRefreshToken = generateRefreshToken;
