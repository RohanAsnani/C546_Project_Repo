import { Router } from 'express';
const router = Router();
import boardData from '../data/board.js';
import * as validation from '../helpers.js';
import user_Test from '../data/user_Test.js';
import xss from 'xss';
import * as analytics from '../Analytics/Analytics_Functions.js';
import { ObjectId } from "mongodb";
import sendEmail from "../util/emailNotif.js";

router  
    .route('/')
    .get(async (req,res)=>{
        return res.render('./data_functions/forgotpass',{title:'Forgot Password.',error:'hidden',secQues:'hidden'});
    })
    .post(async (req,res)=>{
    
        try{
            let userData = req.body;
            let idStat = await user_Test.getUserIdFromUOE(userData.usernameOrEmail);
            if(idStat === false) {
                return res.render('./data_functions/forgotpass',{title:'Forgot Password',secQues:'hidden',message:'No user found with that personal Email or username.',notVisible:'hidden'});
            }
            let data = await user_Test.getUserById(idStat);
            return res.render('./data_functions/forgotpass', { title: 'Forgot Password.', error: 'hidden', secQues: '', mailID: 'hidden', notVisible: 'hidden', ...data });
        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }

    })

    router
        .route('/reset')
        .post(async (req,res)=>{

            try{
                req.body.employeeId = validation.isValidEmployeeId(req.body.employeeId);
                req.body.secAnswer= validation.checkStr(req.body.secAnswer,"Security Answer",2,15,false);
            }catch(e){
                res.render('./data_functions/forgotpass',{title:'Forgot Password.',emessage:e.message})
            }

            try{
                let data = req.body
                data.secAnswer = data.secAnswer.toLowerCase()
            await user_Test.changeForgotPass(data.employeeId, data.secAnswer)
        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });

            }
            
        })

    export default router