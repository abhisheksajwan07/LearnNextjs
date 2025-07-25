import { User } from "@/models/userModel";
import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
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
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("mail", userId);
    console.log("email type", emailType);
    console.log(typeof emailType);
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }
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
        <a href="http://localhost:3000/verifyEmail?token=${hashedToken}">Verify Email</a>
        <br> <p>link:"http://localhost:3000/verifyEmail?token=${hashedToken}</p>
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
