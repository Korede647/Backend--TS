"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const components_1 = require("@react-email/components");
const OtpEmail = ({ otp }) => {
    return (<components_1.Html>
      <components_1.Head />
      <components_1.Body style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            backgroundColor: "#f9f9f9",
        }}>
        <components_1.Container style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}>
          <components_1.Heading style={{ color: "#333", textAlign: "center", marginBottom: "20px" }}>
            Email Verification
          </components_1.Heading>
          <components_1.Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Thank you for signing up! Please use the OTP below to verify your
            email address:
          </components_1.Text>
          <components_1.Text style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            margin: "20px 0",
            color: "#007BFF",
        }}>
            {otp}
          </components_1.Text>
          <components_1.Text style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#777",
            textAlign: "center",
        }}>
            This OTP is valid for 10 minutes. If you did not request this,
            please ignore this email.
          </components_1.Text>
        </components_1.Container>
      </components_1.Body>
    </components_1.Html>);
};
exports.default = OtpEmail;
