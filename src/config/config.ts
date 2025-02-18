import dotenv from "dotenv";
dotenv.config();

export enum AppEnvironment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

type Config = {
  paystack: {
    secretKey: string;
    publicKey: string;
    callbackUrl: string;
  };
  app: {
    port: string | number;
  };
  jwt: {
    secret: string;
    expires: string;
    refresh_expires: string;
  };
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
  };
};

const configuration: Config = {
  paystack: {
    secretKey: process.env.PAY_STACK_SECRET || "",
    publicKey: process.env.PAY_STACK_PUBLIC || "",
    callbackUrl: process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3010/api/v1/enrollments/verify", // Update this as needed
  },
  app: {
    port: process.env.PORT || 3000,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expires: process.env.JWT_EXPIRES || "1h",
    refresh_expires: process.env.JWT_REFRESH_EXPIRES || "30 days",
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    password: process.env.REDIS_PASSWORD,
  },
};

export default configuration;