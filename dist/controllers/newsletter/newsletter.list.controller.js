"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterListController = void 0;
const prisma_1 = require("../../utils/prisma");
class NewsletterListController {
    constructor() {
        this.getEmails = async (req, res) => {
            try {
                const emails = await prisma_1.prisma.newsletter.findMany({
                    select: {
                        email: true,
                    },
                });
                if (emails.length === 0) {
                    return res.status(404).json({ message: "Nenhum e-mail encontrado." });
                }
                return res.status(200).json(emails);
            }
            catch (error) {
                console.error("Erro ao buscar os e-mails:", error);
                return res.status(500).json({ error: "Erro ao processar a requisição." });
            }
        };
    }
}
exports.NewsletterListController = NewsletterListController;
