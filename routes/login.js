import {Router} from "express";
const router = Router();
import usertest from '../data/user_Test.js';
import * as validation from "../helpers.js";
import login from '../data/login.js';


router.route('/')
.get(async (req,res) =>{
    try{
        return res.render('homepage',{Title:'HR-Central'});
    }catch(e){
        return res.json({error:e.message});
    }
})
.post(async (req,res) =>{
    try{
        req.body = req.body
    }catch(e){
        res.json({error:e.message});
    }

    try{
        let credentialsCheck =  await login.getUsernameAndValidate(req.body.username,req.body.password);
        if(!credentialsCheck) return res.json('Invalid username');
        if(credentialsCheck.credentialsCheckStatus === 'true'){
            switch(credentialsCheck.role){
                case 'Admin': return res.render('profile',{firstName : credentialsCheck.firstName,role: credentialsCheck.role});
                    
                case 'HR': return res.render('profile',{firstName : credentialsCheck.firstName,role: credentialsCheck.role});
                    
                case 'Employee': return res.render('profile',{firstName : credentialsCheck.firstName,role: credentialsCheck.role});
                    
            }
            
        }
        return res.json('Invalid Password');
    }catch(e){
        return res.json({error:e.message});
    }


})




export default router