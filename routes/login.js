import {Router} from "express";
const router = Router();
import usertest from '../data/user_Test.js';
import * as validation from "../helpers.js";
import login from '../data/login.js';


router.route('/')
.get(async (req,res) =>{
    try{
        return res.render('homepage',{title:'Login',hidden: "hidden" });
    }catch(e){
        return res.json({error:e.message});
    }
})
.post(async (req,res) =>{
  
    try{
        let credentialsCheck =  await login.getUsernameAndValidate(req.body.username,req.body.password);
         req.session.user = credentialsCheck
        
            switch(req.session.user.role){
                case 'admin': return res.redirect('/hrc/admin');
                    
                case 'hr': return res.redirect('/hrc/hr');
                    
                case 'employee': return res.redirect('/hrc/employee');
                default: return res.status(403).json('Forbidden');
                    
            }
        
    }catch(e){
        return res.status(400).render('homepage',{title:'login',message:e.message,hidden: "",username:req.body.username});
    }


})




export default router