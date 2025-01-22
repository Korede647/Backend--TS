"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const passport_1 = __importDefault(require("passport"));
const auth_util_1 = require("../utils/auth.util");
const authController = new auth_controller_1.AuthController();
const authRoutes = express_1.default.Router();
authRoutes.post("/", authController.login);
authRoutes.post("/", 
// validateMiddleware(LoginDTO)
authController.login);
authRoutes.post("/sign-up", 
//   validationMiddleware(CreateUserDTO),
authController.createUser);
authRoutes.post("/verify-email", 
//   validationMiddleware(VerifyEmailDTO),
authController.verifyEmail);
authRoutes.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
authRoutes.get("/google/callback", passport_1.default.authenticate("google", { session: false }), (req, res) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    const user = req.user;
    const token = (0, auth_util_1.generateAccessToken)(user.id, user.name);
    const refreshToken = (0, auth_util_1.generateRefreshToken)(user.id, user.name);
    res.redirect("https://www.google.com/");
});
authRoutes.post("/request-reset-password", authController.requestPasswordReset);
authRoutes.post("/reset-password", authController.resetPassword);
exports.default = authRoutes;
