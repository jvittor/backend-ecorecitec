"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./infra/user.controller");
const userController = new user_controller_1.UserController();
const router = (0, express_1.Router)();
router.post('/login', (req, res) => userController.login(req, res));
router.post('/register', (req, res) => userController.register(req, res));
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = router;
