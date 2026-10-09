import { Resend } from "resend";
import "dotenv/config";

export const resend = new Resend(process.env.RESEND_API_KEY);

export const sender = {
  email: process.env.EMAIL_FROM as string,
  name: process.env.EMAIL_FROM_NAME as string,
};
