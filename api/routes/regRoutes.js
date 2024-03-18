import express from 'express';
import { register } from '../controller/regController.js';

const regRouter = express.Router();

regRouter.post('/register', register);

export default regRouter;
