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
        return res.render('./data_functions/forgotpass',{title:'Forgot Password.',error:'hidden'});
    })
    .post(async (req,res)=>{
        try{
            let userData = req.body;
        user_Test.changeForgotPass(userData.usernameOrEmail);
        }catch(e){
            return res.json(e.message);
        }

    })

    export default router