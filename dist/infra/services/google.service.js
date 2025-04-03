"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleService = void 0;
const axios_1 = __importDefault(require("axios"));
class GoogleService {
    async getUserInfo(tokenGoogle) {
        const response = await axios_1.default.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenGoogle}`);
        const { email, name, picture } = response.data;
        if (!email) {
            throw new Error('Não foi possível obter o e-mail do usuário.');
        }
        return { email, name, picture };
    }
}
exports.GoogleService = GoogleService;
