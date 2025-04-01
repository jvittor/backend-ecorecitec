"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OndeFoiListController = void 0;
const prisma_1 = require("../../utils/prisma");
class OndeFoiListController {
    async index(req, res) {
        try {
            console.log("📥 Recebendo solicitação para listar entradas do OndeFoi");
            const entries = await prisma_1.prisma.ondeFoi.findMany({
                orderBy: { date: "desc" },
            });
            console.log("✅ Entradas encontradas:", entries.length);
            return res.status(200).json(entries);
        }
        catch (error) {
            console.error("🚨 Erro ao buscar as entradas do OndeFoi:", error);
            return res.status(500).json({ error: "Erro interno do servidor." });
        }
    }
}
exports.OndeFoiListController = OndeFoiListController;
