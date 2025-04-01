"use strict";
// import express from 'express';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import axios from 'axios';
// import dotenv from 'dotenv';
// import cookieParser from "cookie-parser";
// import { router } from './routes';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// dotenv.config();
// const app = express();
// // Configuração do CORS para permitir cookies e definir origem específica
// const corsOptions = {
//   origin: 'https://expert-space-goldfish-x5rv5j4jwg4rfpqw7-3000.app.github.dev', // Substitua pelo seu domínio frontend
//   credentials: true,  // Permite o envio de cookies com as requisições
// };
// app.use(cors(corsOptions));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(router);
// const email = process.env.EMAIL_SLEEP;
// const password = process.env.EMAIL_PASSWORD;
// // setInterval(() => {
// //   axios.post('https://backend-rclimaticas-2.onrender.com/login', {
// //     email,
// //     password,
// //   })
// //   .then(response => {
// //     console.log('Resposta do servidor:', response.data);
// //   })
// //   .catch(error => {
// //     console.error('Erro ao enviar o request:', error.message);
// //   });
// // }, 180000); 
// const PORT = process.env.PORT || 3333;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const corsOptions = {
    origin: process.env.API_URL,
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(routes_1.router);
const email = process.env.EMAIL_SLEEP;
const password = process.env.EMAIL_PASSWORD;
// setInterval(() => {
//   axios.post('https://backend-rclimaticas-2.onrender.com/login', {
//     email,
//     password,
//   })
//   .then(response => {
//     console.log('Resposta do servidor:', response.data);
//   })
//   .catch(error => {
//     console.error('Erro ao enviar o request:', error.message);
//   });
// }, 180000);
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
