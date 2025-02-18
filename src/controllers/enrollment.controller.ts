import { Request, Response, NextFunction } from "express";

import { StatusCodes } from "http-status-codes";
import { CustomError } from "../exceptions/customError.error";
import { EnrollmentServiceImpl } from "../service/implementation/enrollment.service.impl";
import { InitiateEnrollmentDTO } from "../dto/initiateEnrollmentPay.dto";

export class EnrollmentController {
  private enrollmentService = new EnrollmentServiceImpl();

  public initiateEnrollment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = req.body as InitiateEnrollmentDTO;
      const { enrollment, paymentLink } =
        await this.enrollmentService.initiateEnrollment(data);
      res.status(StatusCodes.OK).json({
        message: "Enrollment initiated successfully",
        enrollment,
        paymentLink,
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEnrollmentPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract reference from query parameters
      const reference = req.query.reference as string;

      if (!reference) {
        throw new CustomError(
          StatusCodes.BAD_REQUEST,
          "Missing required parameter: reference"
        );
      }

      const updatedEnrollment =
        await this.enrollmentService.verifyPayment(reference);

      res.status(StatusCodes.OK).json({
        message: "Payment verified successfully",
        enrollment: updatedEnrollment,
      });
    } catch (error) {
      next(error);
    }
  };
}