import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';
import boardData from '../data/board.js';


router
    .route('/')
    .get(async (req, res) => {

        try {
            return res.render('./users/admin', { title: 'Admin', firstName: req.session.user.firstName, role: req.session.user.role,isLoggedIn:true});
        } catch (e) {
            return res.json('Not yet Set Up');
        }
    })

router
    .route('/addEmp')
    .get(async (req, res) => {
        return res.render('./data_functions/createUser', { title: 'Create User', hidden: 'hidden',isLoggedIn:true});
    })
    .post(async (req, res) => {
        try {
            //validation
            let creationData = req.body;
            creationData = validation.checkMasterUser(creationData);

        } catch (e) {
            return res.status(400).render('./data_functions/createUser', { title: 'Create User', hidden: '', message: e.message ,...req.body,isLoggedIn:true});
        }

        try {
            let creationData = req.body;
            let createdUser = await userTest.create(creationData);
            // add boarding task of salary and benifits
            let task = await boardData.createSalaryBenifits(createdUser.employeeId);
            if (!task) console.log('Could not add Salary and Benifits Task');
            delete createdUser.password;
            return res.render('./data_functions/newAdded',{title:"Created User",...createdUser,hrView:false,hrButtons:'hidden',isLoggedIn:true})
            

        } catch (e) {
            return res.status(400).render('./data_functions/createUser', { title: 'Create User', hidden: '', message: e.message ,...req.body ,isLoggedIn:true});
        }
    })

export default router 