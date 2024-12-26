export interface VerifyEmailTemplate {
  verificationLink: string;
  subject: string;
  body: string;
  buttonText: string;
}

export interface ForgotPasswordTemplate {
  subject: string;
  greeting: string;
  instruction: string;
  ignore: string;
  code: string;
}

export interface ResetPasswordTemplate {
  subject: string;
  greeting: string;
  message: string;
}
