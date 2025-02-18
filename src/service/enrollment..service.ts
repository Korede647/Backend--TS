import { Enrollment, PaymentStatus } from "@prisma/client";
import { InitiateEnrollmentDTO } from "../dto/initiateEnrollmentPay.dto";

export interface EnrollmentService {
  initiateEnrollment(data: InitiateEnrollmentDTO): Promise<{ enrollment: Enrollment; paymentLink: string }>;
  verifyPayment(reference: string): Promise<Enrollment>;
}