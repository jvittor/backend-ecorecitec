"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
const nodemailer = __importStar(require("nodemailer"));
const crypto_1 = __importDefault(require("crypto"));
class NewsletterCreateController {
    constructor() {
        this.generateSecurePassword = () => {
            const password = crypto_1.default.randomBytes(16).toString("base64");
            return password.replace(/[^a-zA-Z0-9]/g, "");
        };
        this.store = async (req, res) => {
            const { name, email } = req.body;
            try {
                let user = await prisma_1.prisma.user.findUnique({
                    where: { email },
                });
                let password;
                if (!user) {
                    password = this.generateSecurePassword();
                    user = await prisma_1.prisma.user.create({
                        data: {
                            name,
                            email,
                            password,
                            username: `user_${Date.now()}`,
                        },
                    });
                    console.log(`Usuário ${name} (${email}) cadastrado com sucesso.`);
                }
                else {
                    password = user.password;
                    console.log(`Usuário ${name} (${email}) já existente. Usando senha existente.`);
                }
                const newNewsletter = await prisma_1.prisma.newsletter.create({
                    data: {
                        name,
                        email,
                        date: new Date(),
                    },
                });
                const transporter = nodemailer.createTransport({
                    host: "mail.privateemail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: "vitor@ligacolaborativa.site",
                        pass: process.env.PASSWORD_EMAIL,
                    },
                });
                const mailOptions = {
                    from: "vitor@ligacolaborativa.site",
                    to: `${email}`,
                    subject: "Parabéns, agora você é Vip da Liga!",
                    html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>E-mail com Fundo Branco Centralizado</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #d3d3d3;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; padding: 20px;">
                                <tr>
                                    <td align="center" style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;">
                                        <img src="https://rclimaticas-fileupload.s3.sa-east-1.amazonaws.com/logoLC-DRqUmzjb.png" width="100" alt="Logo" style="display: block;"/>
                                        <h2 style="color: #4A90E2; font-size: 28px;">Olá ${name}! Parabéns!</h2>
                                        <p style="font-size: 25px; line-height: 1.6; text-align: center;">
                                            Seu cadastro foi realizado com sucesso.<br><br>
                                            Na natureza tudo é evolução. A evolução vem das experiências e a Liga Colaborativa está evoluindo!</strong><br><br>
                                            Aprendemos com os povos, suas culturas e a interação do ser humano com a natureza e os desafios nos territórios. 
                                            E desse aprendizado, estamos dando mais um passo para uma 
                                            <strong>Nova Versão da Plataforma Colaborativa </strong>, com solução de bugs, novas funcionalidades e experiência do usuário. <br><br>
                                            Tudo isso para tornar esse espaço realmente útil para a sociedade no desafio de valorizar os povos, suas culturas e regenerar a natureza.

                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="background-color: #000000; padding: 20px; color: #ffffff;">
                                        <p style="font-size: 25px; line-height: 1.6; text-align: center;">Agora que você faz parte do VIP da liga, colete sua NFT através do link abaixo e aguarde por mais novidades da liga!</p>
                                        <a href="#" style="display: block; margin-bottom: 20px;">
                                            <img src="https://res.cloudinary.com/dw4jmcntj/image/upload/v1738267140/y2smwgdioixgt1hcqgdn.png" width="300" alt="NFT" style="display: block;"/>
                                        </a>
                                        <a href="https://gotas.social/gota/1738428072331x776979103168856000" style="display: inline-block; padding: 12px 24px; background-color: orange; color: black; text-decoration: none; font-size: 25px; font-weight: bold; text-align: center; font-family: Arial, sans-serif;">RESGATE SEU NFT</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 40px 20px; font-family: Arial, sans-serif; color: #333333;">
                                        <p style="font-size: 25px; line-height: 1.6; text-align: center;">
                                            Atenciosamente, <br/> Equipe da Liga.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding: 20px; font-family: Arial, sans-serif; color: #777777; font-size: 16px;">
                                        <p>&copy; 2025 Liga Colaborativa dos Povos. Todos os direitos reservados.</p>
                                        <p>
                                            <a href="https://www.instagram.com/aliga.on/" style="margin: 0 10px;">
                                                <img src="https://img.icons8.com/?size=100&id=g7SBGFwja0xa&format=png&color=000000" width="30" alt="Ícone 1" style="display: inline-block;"/>
                                            </a>
                                            <a href="https://www.youtube.com/@ligacolaborativa" style="margin: 0 10px;">
                                                <img src="https://img.icons8.com/?size=100&id=37325&format=png&color=000000" width="30" alt="Ícone 3" style="display: inline-block;"/>
                                            </a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
        `,
                };
                await transporter.sendMail(mailOptions);
                console.log(`E-mail enviado para ${email} com sucesso.`);
                res.status(201).json(newNewsletter);
            }
            catch (error) {
                console.error("Erro ao processar a requisição:", error);
                res.status(500).json({ error: "Erro ao processar a requisição." });
            }
        };
    }
}
exports.NewsletterCreateController = NewsletterCreateController;
