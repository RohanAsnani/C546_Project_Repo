import {Router} from 'express';
const router = Router();
import * as validatoin from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';


router
    .route('/')
    .get(async(req,res)=>{

        try{
            return res.render('./users/admin',{title: 'Admin'});
        }catch(e){
            return res.json('Not yet Set Up');
        }
    })

router
    .route('/addEmp')
    .get(async(req,res)=>{
       return res.render('./data_functions/createUser',{title:'Create User'});
    })
    .post(async(req,res)=>{
        try{
            //validation
            let creationData = req.body;
            creationData = validatoin.checkTypeMaster(creationData);
            
        }catch(e){
           return  res.status(400).json(e.message);//rerender page and tell user what is wrong also set status to 400
        }

        try{
            let creationData = req.body;
            let createdUser = await userTest.create(creationData);
          return   res.json(createdUser);
        }catch(e){
           return  res.json(e.message);
        }
    })
    
    export default router 