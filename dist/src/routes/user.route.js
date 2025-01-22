"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const userController = new user_controller_1.UserController();
const userRouter = express_1.default.Router();
userRouter.post("/", userController.createUser);
userRouter.get("/auth/profile", auth_middleware_1.authenticateUser, userController.profile);
userRouter.get("/", auth_middleware_1.authenticateUser, isAdmin_1.default, userController.getAllUsers);
userRouter.get("/:id", auth_middleware_1.authenticateUser, userController.getUserById);
userRouter.patch("/:id", auth_middleware_1.authenticateUser, userController.updateUser);
userRouter.delete("/:id", auth_middleware_1.authenticateUser, userController.deleteUser);
exports.default = userRouter;
