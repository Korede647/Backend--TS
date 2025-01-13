import express from "express"
import { AuthController } from "../controllers/auth.controller";


const authController = new AuthController();
const authRoutes = express.Router()

authRoutes.post("/", validationMiddleware().login)

export default authRoutes