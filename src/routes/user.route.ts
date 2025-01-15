import express from "express"
import { UserController } from "../controllers/user.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const userController = new UserController();
const userRouter = express.Router();

// userRouter.post("/", validateMiddleware(), userController.createUser);
userRouter.get("/auth/profile", authenticateUser, userController.profile)
userRouter.get("/", authenticateUser, userController.getAllUsers);
userRouter.get("/:id", authenticateUser, userController.getUserById);

userRouter.patch("/:id", authenticateUser, userController.updateUser)
userRouter.delete("/:id", authenticateUser, userController.deleteUser)

export default userRouter;

