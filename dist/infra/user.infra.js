"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
const user_entities_1 = require("../domain/entities/user.entities");
const prisma_1 = require("../utils/prisma");
class PrismaUserRepository {
    async findById(id) {
        var _a;
        const user = await prisma_1.prisma.user.findUnique({ where: { id } });
        if (!user)
            return null;
        return new user_entities_1.User(user.id, user.email, user.username, user.password, (_a = user.imageBase64) !== null && _a !== void 0 ? _a : undefined);
    }
    async findByEmail(email) {
        var _a;
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        return new user_entities_1.User(user.id, user.email, user.username, user.password, (_a = user.imageBase64) !== null && _a !== void 0 ? _a : undefined);
    }
    async save(user) {
        var _a;
        const createdUser = await prisma_1.prisma.user.create({
            data: {
                email: user.email,
                username: user.username,
                password: user.password,
                imageBase64: user.imageBase64,
            },
        });
        return new user_entities_1.User(createdUser.id, createdUser.email, createdUser.username, createdUser.password, (_a = createdUser.imageBase64) !== null && _a !== void 0 ? _a : undefined);
    }
    async deleteById(id) {
        await prisma_1.prisma.user.delete({ where: { id } });
    }
    async update(id, data) {
        var _a;
        const updatedUser = await prisma_1.prisma.user.update({
            where: { id },
            data: {
                email: data.email,
                username: data.username,
                password: data.password,
                imageBase64: data.imageBase64,
            },
        });
        return new user_entities_1.User(updatedUser.id, updatedUser.email, updatedUser.username, updatedUser.password, (_a = updatedUser.imageBase64) !== null && _a !== void 0 ? _a : undefined);
    }
    async findAll() {
        const users = await prisma_1.prisma.user.findMany();
        return users.map((user) => {
            var _a;
            return new user_entities_1.User(user.id, user.email, user.username, user.password, (_a = user.imageBase64) !== null && _a !== void 0 ? _a : undefined);
        });
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
