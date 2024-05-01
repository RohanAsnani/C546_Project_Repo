import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';


router
    .route('/')
    .get(async (req, res) => {

        try {
            return res.render('./users/admin', { title: 'Admin', firstName: req.session.user.firstName, role: req.session.user.role });
        } catch (e) {
            return res.json('Not yet Set Up');
        }
    })

router
    .route('/addEmp')
    .get(async (req, res) => {
        return res.render('./data_functions/createUser', { title: 'Create User', hidden: 'hidden', firstName: req.session.user.firstName, role: req.session.user.role });
    })
    .post(async (req, res) => {
        try {
            //validation
            let creationData = req.body;
            creationData = validation.checkMasterUser(creationData);

        } catch (e) {
            return res.status(400).render('./data_functions/createUser', { title: 'Create User', hidden: '', message: e.message });
        }

        try {
            let creationData = req.body;
            let createdUser = await userTest.create(creationData);
            return res.json(createdUser);
        } catch (e) {
            return res.json(e.message);
        }
    })

export default router 