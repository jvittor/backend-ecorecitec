import { Router } from 'express';
import { UserController } from './infra/user.controller';

const userController = new UserController();
const router = Router();

router.post('/login', (req, res) => userController.login(req, res));
router.post('/login/google', (req, res) => userController.googleLogin(req, res));

router.post('/register', (req, res) => userController.register(req, res));
router.get('/user', (req, res) => userController.getUser(req, res));
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });
  
  router.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  }); 

export default router;
