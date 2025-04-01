import { Router } from 'express';
import express from 'express';
import { UserRegisterController } from './controllers/user/user-register.controller';
import { UserLoginController } from './controllers/user/user-login.controller';
import { UserLogoutController } from './controllers/user/user-logout.controller';
import { AuthMiddleware } from './middlewares/auth';

import { ProfileUpdateController } from './controllers/user/profile/profile.update.controller';
import { ProfileGetController } from './controllers/user/profile/profile.get.controller';
import { ProfileDeleteController } from './controllers/user/profile/profile.delete.controller';

import { GoogleLoginController } from './controllers/user/user-google.controller';

import { MetaMaskLoginController } from './controllers/user/user-metamask.controller';

// User controllers
const registerController = new UserRegisterController();
const loginController = new UserLoginController();
const logoutController = new UserLogoutController();

// Profile controllers
const profileUpdateController = new ProfileUpdateController();
const profileGetController = new ProfileGetController();
const profileDeleteController = new ProfileDeleteController();

// Google Login Auth
const googleLoginController = new GoogleLoginController();

// Meta Mask Login Auth
const metaMaskLoginController = new MetaMaskLoginController();

export const router = Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// User routes
router.post("/register", registerController.store);
router.post("/login", loginController.authenticate);
router.post("/logout", logoutController.logout);

// Profile routes
router.put("/user/update", AuthMiddleware, profileUpdateController.update);
router.get("/users/profile", profileGetController.show);
router.get("/users", profileGetController.index);
router.delete("/profile/:id", AuthMiddleware, profileDeleteController.delete);

// Google Auth Login
router.post("/auth/google", googleLoginController.authenticate);

// Meta Mask Auth
router.post("/auth/metamask", metaMaskLoginController.authenticate);

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

router.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
}); 


