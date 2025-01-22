import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Link,
} from "@react-email/components";

interface ResetPasswordProps {
  name: string;
  resetLink: string;
}

const ResetPasswordEmail: React.FC<ResetPasswordProps> = ({
  name,
  resetLink,
}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          padding: "20px",
          backgroundColor: "#f4f4f4",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Heading
            style={{
              color: "#333",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            Reset Your Password
          </Heading>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            Hi {name},
          </Text>
          <Text style={{ fontSize: "16px", lineHeight: "1.5", color: "#333" }}>
            We received a request to reset your password. Click the link below
            to proceed:
          </Text>
          <Link
            href={resetLink}
            style={{
              display: "block",
              margin: "20px 0",
              padding: "10px 20px",
              backgroundColor: "#007BFF",
              color: "#ffffff",
              textDecoration: "none",
              textAlign: "center",
              borderRadius: "5px",
            }}
          >
            Reset Password
          </Link>
          <Text style={{ 
            fontSize: "14px", 
            lineHeight: "1.5", 
            color: "#777" }}>
            If you did not request this, please ignore this email or contact
            support if you have concerns.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;
