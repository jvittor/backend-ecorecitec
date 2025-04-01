"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialUpdateController = void 0;
const prisma_1 = require("../../utils/prisma");
class MaterialUpdateController {
    async update(req, res) {
        const materialId = parseInt(req.params.id);
        const { name, email, publicationType, subjectType, fileUrl, FileUpload } = req.body;
        try {
            const updatedMaterial = await prisma_1.prisma.material.update({
                where: { id: materialId },
                data: {
                    name,
                    email,
                    publicationType,
                    subjectType,
                    fileUrl,
                    FileUpload
                },
            });
            res.json(updatedMaterial);
        }
        catch (error) {
            res.status(500).json({ error: "Erro ao atualizar o material." });
        }
    }
}
exports.MaterialUpdateController = MaterialUpdateController;
