import axios from "axios";
import configuration from "../config/config";
import { CustomError } from "../exceptions/customError.error";

// Define the structure of the response returned by Paystack's initialize payment endpoint.
export interface PaymentInitializationResponse {
  authorization_url: string;
  reference: string;
}


export interface PaymentService {
 
  initializePayment(email: string, amount: number, metadata?: object): Promise<PaymentInitializationResponse>;
}

// Implementation of PaymentService using Paystack's API.
export class PaymentServiceImpl implements PaymentService {
  async initializePayment(
    email: string,
    amount: number,
    metadata: object = {}
  ): Promise<PaymentInitializationResponse> {
    try {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100, // Convert amount to kobo (if currency is NGN)
          callback_url: configuration.paystack.callbackUrl, 
          metadata,
        },
        {
          headers: {
            Authorization: `Bearer ${configuration.paystack.secretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Check if the API responded with a successful status
      if (!response.data.status) {
        throw new CustomError(400, response.data.message || "Failed to initialize payment");
      }

      // Return the payment initialization data
      return response.data.data as PaymentInitializationResponse;
    } catch (error: any) {
      console.error("Error in PaymentService.initializePayment:", error.response?.data || error.message);
      throw new CustomError(400, "Failed to initialize payment");
    }
  }
}