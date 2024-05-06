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
        req.session.destroy()
        return res.render('DeactivatedUser');
    })


export default router