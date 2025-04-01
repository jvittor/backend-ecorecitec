"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OndeFoiCreateController = void 0;
const prisma_1 = require("../../utils/prisma");
class OndeFoiCreateController {
    async store(req, res) {
        try {
            const { pin, surveyId, locality } = req.body;
            // Depuração: Exibe os dados recebidos
            console.log("🟢 Dados recebidos:", req.body);
            // Validação: Garante que 'pin' não está undefined
            if (!pin) {
                console.log("❌ Erro: O campo 'pin' é obrigatório.");
                return res.status(400).json({ error: "O campo 'pin' é obrigatório." });
            }
            // Converte surveyId para número (se necessário)
            const surveyIdNumber = Number(surveyId);
            if (isNaN(surveyIdNumber)) {
                console.log("❌ Erro: 'surveyId' deve ser um número.");
                return res.status(400).json({ error: "O campo 'surveyId' deve ser um número." });
            }
            const existingEntry = await prisma_1.prisma.ondeFoi.findUnique({
                where: { pin },
            });
            if (existingEntry) {
                console.log("🔄 Atualizando entrada existente para PIN:", pin);
                const updatedEntry = await prisma_1.prisma.ondeFoi.update({
                    where: { pin },
                    data: {
                        surveyId: surveyIdNumber,
                        locality,
                        points: { increment: 10 },
                    },
                });
                console.log("✅ Entrada atualizada:", updatedEntry);
                return res.status(200).json({
                    message: "PIN atualizado, pontos e locality adicionados.",
                    updatedEntry,
                });
            }
            // Cria um novo registro
            console.log("➕ Criando nova entrada...");
            const newEntry = await prisma_1.prisma.ondeFoi.create({
                data: {
                    pin,
                    surveyId: surveyIdNumber,
                    points: 10,
                    locality,
                    date: new Date(),
                },
            });
            console.log("✅ Nova entrada criada:", newEntry);
            return res.status(201).json(newEntry);
        }
        catch (error) {
            console.error("🚨 Erro ao processar a requisição:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    }
}
exports.OndeFoiCreateController = OndeFoiCreateController;
