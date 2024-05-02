import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';


router
    .route('/')
    .get(async (req, res) => {

        try {
            return res.render('./users/employee', { title: 'Employee', firstName: req.session.user.firstName, role: req.session.user.role, employeeId: req.session.user.employeeId });
        } catch (e) {
            return res.json('Not yet Set Up');
        }
    });


export default router 