import nodemailer from "nodemailer";
interface EmailOptions {
  emailId: string;
  emailType: "VERIFY" | "RESET" | "WELCOME";
  userId: string;
}
export const sendEmail = async ({
  emailId,
  emailType,
  userId,
}: EmailOptions): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST!,
      port: Number(process.env.MAIL_PORT!) || 587,
      auth: {
        user: process.env.MAIL_USER!,
        pass: process.env.MAIL_PASS!,
      },
    });
    let subject = "";
    let html = "";
    if (emailType === "VERIFY") {
      subject = "Verify your Email";
      html = `
        <p>Please click the link below to verify your email:</p>
        <a href="http://localhost:3000/verify-email?userId=${userId}">Verify Email</a>
      `;
    } else if (emailType === "RESET") {
      subject = "Reset your password";
      html = `<p>Click here to reset your password</p>`;
    } else {
      subject = "Welcome to our app!";
      html = `<p>Welcome onboard, ${emailId}! 🎉</p>`;
    }
    const options = {
      from: "no-reply@yourapp.com",
      to: emailId,
      subject,
      html,
    };
    await transporter.sendMail(options);
    console.log(`email send to ${emailId}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Failed to send email.");
  }
};
