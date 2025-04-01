"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmails = sendEmails;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function sendEmails(users) {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const emailPromises = users.map(user => {
        return transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Você foi impactado por uma nova ação",
            text: "Um impacto relacionado aos seus interesses foi registrado. Confira os detalhes na nossa plataforma.",
        });
    });
    await Promise.all(emailPromises);
}
