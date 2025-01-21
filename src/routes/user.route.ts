import express from "express"
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";
import isAdmin from "../middlewares/isAdmin";

const userController = new UserController();
const userRouter = express.Router();

userRouter.post("/", userController.createUser);
userRouter.get("/auth/profile", authenticateUser, userController.profile)
userRouter.get("/", authenticateUser, isAdmin, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);

userRouter.patch("/:id", authenticateUser, userController.updateUser)
userRouter.delete("/:id", authenticateUser, userController.deleteUser)

export default userRouter;

