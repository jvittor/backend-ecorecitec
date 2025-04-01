"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const express_2 = __importDefault(require("express"));
const user_register_controller_1 = require("./controllers/user/user-register.controller");
const user_login_controller_1 = require("./controllers/user/user-login.controller");
const user_logout_controller_1 = require("./controllers/user/user-logout.controller");
const auth_1 = require("./middlewares/auth");
const admin_auth_1 = require("./middlewares/admin.auth");
const multer_1 = __importDefault(require("multer"));
const prisma_1 = require("./utils/prisma");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const material_create_controller_1 = require("./controllers/material/material.create.controller");
const material_get_controller_1 = require("./controllers/material/material.get.controller");
const material_update_controler_1 = require("./controllers/material/material.update.controler");
const material_delete_controller_1 = require("./controllers/material/material.delete.controller");
const profile_update_controller_1 = require("./controllers/user/profile/profile.update.controller");
const profile_get_controller_1 = require("./controllers/user/profile/profile.get.controller");
const profile_delete_controller_1 = require("./controllers/user/profile/profile.delete.controller");
const impacts_create_controller_1 = require("./controllers/impactos/impacts.create.controller");
const impacts_list_controller_1 = require("./controllers/impactos/impacts.list.controller");
const impacts_list_global_controller_1 = require("./controllers/impactos/impacts.list.global.controller");
const impacts_update_controller_1 = require("./controllers/impactos/impacts.update.controller");
const newsletter_create_controller_1 = require("./controllers/newsletter/newsletter.create.controller");
const newsletter_list_controller_1 = require("./controllers/newsletter/newsletter.list.controller");
const newsletter_delete_controller_1 = require("./controllers/newsletter/newsletter.delete.controller");
const news_scrape_controller_1 = require("./controllers/webscraping/news-scrape.controller");
const sofia_chat_controller_1 = require("./controllers/sofiachat/sofia-chat.controller");
const user_google_login_controller_1 = require("./controllers/user/user-google-login.controller");
const user_metamask_controller_1 = require("./controllers/user/user-metamask.controller");
const ondefoi_create_controller_1 = require("./controllers/ondefoi/ondefoi.create.controller");
const ondefoi_list_controller_1 = require("./controllers/ondefoi/ondefoi.list.controller");
// Multer configuration
const upload = (0, multer_1.default)();
// User controllers
const registerController = new user_register_controller_1.UserRegisterController();
const loginController = new user_login_controller_1.UserLoginController();
const logoutController = new user_logout_controller_1.UserLogoutController();
// Material controllers
const materialController = new material_create_controller_1.MaterialCreateController();
const materialGetController = new material_get_controller_1.MaterialGetController();
const materialUpdateController = new material_update_controler_1.MaterialUpdateController();
const materialDeleteController = new material_delete_controller_1.MaterialDeleteController();
// Profile controllers
const profileUpdateController = new profile_update_controller_1.ProfileUpdateController();
const profileGetController = new profile_get_controller_1.ProfileGetController();
const profileDeleteController = new profile_delete_controller_1.ProfileDeleteController();
// Impacts controllers
const impactsCreateController = new impacts_create_controller_1.ImpactsCreateController();
const impactsListController = new impacts_list_controller_1.ImpactsListController();
const impactsListGlobalController = new impacts_list_global_controller_1.ImpactsListGlobalController();
const impactsUpdateController = new impacts_update_controller_1.ImpactsUpdateController();
// Newsletter controllers
const newsletterCreateController = new newsletter_create_controller_1.NewsletterCreateController();
const newsletterListController = new newsletter_list_controller_1.NewsletterListController();
const newsletterDeleteController = new newsletter_delete_controller_1.NewsletterDeleteController();
// SofiaChat controllers
const sofiaChatController = new sofia_chat_controller_1.SofiaChatController();
// Webscraping controlles
const newsScrapeController = new news_scrape_controller_1.NewsScrapeController();
// Google Login Auth
const googleLoginController = new user_google_login_controller_1.GoogleLoginController();
// Meta Mask Login Auth
const metaMaskLoginController = new user_metamask_controller_1.MetaMaskLoginController();
// Onde Foi controllers
const ondefoiCreateController = new ondefoi_create_controller_1.OndeFoiCreateController();
const ondefoiListController = new ondefoi_list_controller_1.OndeFoiListController();
exports.router = (0, express_1.Router)();
exports.router.use(express_2.default.json());
exports.router.use(express_2.default.urlencoded({ extended: true }));
exports.router.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// User routes
exports.router.post("/register", registerController.store);
exports.router.post("/login", loginController.authenticate);
exports.router.post("/logout", logoutController.logout);
exports.router.post('/upload/:materialId', upload.single('fileUpload'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo enviado');
    }
    const { originalname, buffer } = req.file;
    const { materialId } = req.params;
    try {
        const material = await prisma_1.prisma.material.findUnique({
            where: { id: parseInt(materialId, 10) },
        });
        if (!material) {
            return res.status(404).send('Material não encontrado');
        }
        const uploadPath = path_1.default.join(__dirname, 'uploads', originalname);
        fs_1.default.writeFileSync(uploadPath, buffer);
        const file = await prisma_1.prisma.fileUpload.create({
            data: {
                path: uploadPath,
                date: new Date(),
                materialId: parseInt(materialId, 10),
            },
        });
        res.status(201).json(file);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar o arquivo');
    }
});
exports.router.post("/materials", materialController.store);
exports.router.get("/materials/material", materialGetController.list);
exports.router.put("/materials/:materialId", auth_1.AuthMiddleware, materialUpdateController.update);
exports.router.delete("/materials/:materialId", auth_1.AuthMiddleware, materialDeleteController.delete);
exports.router.get("/materials", materialGetController.list);
// Profile routes
exports.router.put("/user/update", auth_1.AuthMiddleware, profileUpdateController.update);
exports.router.get("/users/profile", profileGetController.show);
exports.router.get("/users", profileGetController.index);
exports.router.delete("/profile/:id", auth_1.AuthMiddleware, profileDeleteController.delete);
// Impacts routes
exports.router.post("/impacts", auth_1.AuthMiddleware, impactsCreateController.store);
exports.router.get("/impacts/user", auth_1.AuthMiddleware, impactsListController.index);
exports.router.get("/impacts", auth_1.AuthMiddleware, admin_auth_1.AdminMiddleware, impactsListGlobalController.index);
exports.router.put("/impacts/:id", auth_1.AuthMiddleware, admin_auth_1.AdminMiddleware, impactsUpdateController.update);
// Newsletter routes
exports.router.post("/newsletter", newsletterCreateController.store);
exports.router.get("/newsletter/emails", newsletterListController.getEmails);
exports.router.delete("/newsletter/delete", newsletterDeleteController.deleteAllEmails);
// News scraping route
exports.router.get("/scrape-news", newsScrapeController.scrape);
// SofiaChat routes
exports.router.post("/sofia-chat", sofiaChatController.sofia);
// Google Auth Login
exports.router.post("/auth/google", googleLoginController.authenticate);
// Meta Mask Auth
exports.router.post("/auth/metamask", metaMaskLoginController.authenticate);
// Onde Foi routes
exports.router.post("/ondefoi", ondefoiCreateController.store);
exports.router.get("/ondefoi/list", ondefoiListController.index);
exports.router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});
exports.router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
