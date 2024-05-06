import { Router } from 'express';
const router = Router();
import boardData from '../data/board.js';
import * as validation from '../helpers.js';
import user_Test from '../data/user_Test.js';
import xss from 'xss';
import { ObjectId } from "mongodb";
import sendEmail from "../util/emailNotif.js";


router 
    .route('/')
    .get(async (req,res)=>{
        let data = req.session.user.countryOfOrigin
        return res.render('onboarding',{title:"Complete Your Onboarding Tasks.",countryOfOrigin:data,isLoggedIn:true});
    })

export default router;