import nodemailer from "nodemailer";
import "dotenv/config";

const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

const nodemailerOptions = {
  host: "smtp.ukr.net",
  port: "465",
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerOptions);

const sendEmail = async (data) => {
  try {
    const email = { ...data, from: UKR_NET_FROM };
    await transport.sendMail(email);
    console.log("Email send success");
  } catch (error) {
    console.log(error.message);
  }
};

export default sendEmail;
