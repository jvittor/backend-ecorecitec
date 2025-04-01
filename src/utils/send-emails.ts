import nodemailer from "nodemailer";

export async function sendEmails(users: { email: string }[]) {
    const transporter = nodemailer.createTransport({
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
