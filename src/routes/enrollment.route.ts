import express from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";

const enrollmentRouter = express.Router();
const enrollmentController = new EnrollmentController();
enrollmentRouter.post("/initiate",
    // validationMiddleware(InitiateEnrollmentDTO),
 enrollmentController.initiateEnrollment);
enrollmentRouter.get("/verify", enrollmentController.verifyEnrollmentPayment);

export default enrollmentRouter;