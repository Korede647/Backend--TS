"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const components_1 = require("@react-email/components");
const ResetPasswordEmail = ({ name, resetLink, }) => {
    return (<components_1.Html>
      <components_1.Head />
      <components_1.Body style={{
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            backgroundColor: "#f4f4f4",
        }}>
        <components_1.Container style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}>
          <components_1.Heading style={{
            color: "#333",
            textAlign: "center",
            marginBottom: "20px",
        }}>
            Reset Your Password
          </components_1.Heading>
          <components_1.Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Hi {name},
          </components_1.Text>
          <components_1.Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            We received a request to reset your password. Click the link below
            to proceed:
          </components_1.Text>
          <components_1.Link href={resetLink} style={{
            display: "block",
            margin: "20px 0",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#ffffff",
            textDecoration: "none",
            textAlign: "center",
            borderRadius: "5px",
        }}>
            Reset Password
          </components_1.Link>
          <components_1.Text style={{
            fontSize: "14px",
            lineHeight: "1.5",
            color: "#777"
        }}>
            If you did not request this, please ignore this email or contact
            support if you have concerns.
          </components_1.Text>
        </components_1.Container>
      </components_1.Body>
    </components_1.Html>);
};
exports.default = ResetPasswordEmail;
