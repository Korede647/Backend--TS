interface SendEmailOptions {
    to: string;
    subject: string;
    otp: string;
}
interface WelcomeEmailOptions {
    to: string;
    subject: string;
    name: string;
}
interface ResetPasswordOptions {
    to: string;
    subject: string;
    name: string;
    resetLink: string;
}
export declare function sendOtpEmail({ to, subject, otp }: SendEmailOptions): Promise<void>;
export declare function welcomeEmail({ to, subject, name }: WelcomeEmailOptions): Promise<void>;
export declare function sendResetPasswordEmail({ to, subject, name, resetLink }: ResetPasswordOptions): Promise<void>;
export {};
