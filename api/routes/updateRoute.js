import express from 'express';
import { updateUser } from '../controller/updateContoller.js';
import { verifyToken } from '../utils/verifyUser.js';

const updateRoute = express.Router();
updateRoute.post('/update/:id', verifyToken, updateUser);

export default updateRoute;
