"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMiddleware = AdminMiddleware;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function AdminMiddleware(req, res, next) {
    if (req.userRole !== "admin") {
        return res.status(403).json({ error: "Acesso negado: apenas administradores podem realizar esta ação" });
    }
    next();
}
