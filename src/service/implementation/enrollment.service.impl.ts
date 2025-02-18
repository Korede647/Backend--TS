import { Enrollment, PaymentStatus } from "@prisma/client";
import { db } from "../../config/db";
import { CustomError } from "../../exceptions/customError.error";
import { InitiateEnrollmentDTO } from "../../dto/initiateEnrollmentPay.dto";
import { EnrollmentService } from "../enrollment..service";
import { PaymentServiceImpl } from "../payStackPayment.service";

export class EnrollmentServiceImpl implements EnrollmentService {
  private paymentService = new PaymentServiceImpl();

  async initiateEnrollment(
    data: InitiateEnrollmentDTO
  ): Promise<{ enrollment: Enrollment; paymentLink: string }> {
    //Validate the course exists
    const course = await db.course.findUnique({
      where: { id: data.courseId },
    });
    if (!course) {
      throw new CustomError(404, "Course not found");
    }

    // Validate the user exists and email is verified
    const user = await db.user.findUnique({ where: { id: data.userId } });
    if (!user) {
      throw new CustomError(404, "User not found");
    }
    if (!user.emailVerified) {
      throw new CustomError(400, "User email is not verified");
    }

    // Initialize payment using Paystack
    const paymentResponse = await this.paymentService.initializePayment(
      user.email,
      course.price,
      {
        enrollmentId: "",
        courseTitle: course.title,
      }
    );

    // Create enrollment record with PENDING status and save the Paystack reference
    const enrollment = await db.enrollment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        instructorId: data.instructorId,
        paymentStatus: PaymentStatus.PENDING,
        paystackReference: paymentResponse.reference, // Save the transaction reference
      },
    });

    return { enrollment, paymentLink: paymentResponse.authorization_url };
  }

  async verifyPayment(reference: string): Promise<Enrollment> {
    // Find the enrollment by the stored paystackReference
    const enrollment = await db.enrollment.findUnique({
      where: { paystackReference: reference },
    });

    if (!enrollment) {
      throw new CustomError(
        404,
        "Enrollment not found for the given reference"
      );
    }

    // Update the paymentStatus to PAID
    const updatedEnrollment = await db.enrollment.update({
      where: { id: enrollment.id },
      data: { paymentStatus: PaymentStatus.PAID },
    });

    return updatedEnrollment;
  }
}