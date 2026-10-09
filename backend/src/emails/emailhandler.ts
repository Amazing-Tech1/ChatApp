import { resend, sender } from "../lib/resend.js";
import { createWelcomeEmailTemplate } from "./onboardingTemplate.js";

export async function sendWelcomeEmail(
  name: string,
  email: string,
  clientURL: string,
): Promise<void> {
  const { data, error } = await resend.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: email,
    subject: "Welcome to Chatapp!",
    html: createWelcomeEmailTemplate(name, clientURL),
  });

  if (error) {
    console.error("Error sending welcome email:", error);
    throw new Error(`Failed to send welcome email: ${error.message}`);
  }

  console.log("Welcome email sent successfully:", data);
}
