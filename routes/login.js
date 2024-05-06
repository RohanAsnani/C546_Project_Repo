import {Router} from "express";
const router = Router();
import usertest from '../data/user_Test.js';
import * as validation from "../helpers.js";
import login from '../data/login.js';
import xss from 'xss';


router.route('/')
.get(async (req,res) =>{
    try{
        return res.render('homepage',{title:'Login',hidden: "hidden",isLoggedIn: false,forgotPass:"hidden"});
    }catch(e){
        return res.json({error:e.message});
    }
})
.post(async (req,res) =>{
  
    try{
        req.body.username = xss(req.body.username)
        req.body.password = xss(req.body.password)
        let credentialsCheck =  await login.getUsernameAndValidate(req.body.username,req.body.password);
         req.session.user = credentialsCheck
        
            switch(req.session.user.role){
                case 'Admin': return res.redirect('/hrc/admin');
                    
                case 'HR': return res.redirect('/hrc/hr');
                    
                case 'Employee': return res.redirect('/hrc/employee');
                default: return res.status(403).json('Forbidden');
                    
            }
        
    }catch(e){
        return res.status(400).render('homepage',{title:'login',message:e.message,hidden: "",username:req.body.username,forgotPass:''});
    }


})




export default router