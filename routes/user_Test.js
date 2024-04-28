//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import usertest from '../data/user_Test.js';
import * as validation from '../helpers.js';

router
  .route('/')
  .get(async (req, res) => {
    try {
      const userdata = await usertest.getAll();
      return res.json(userdata);
    } catch (e) {
      return res.status(500).json({error: e});
    }
  })
  .put(async (req,res)=>{
    try{
      req.body = validation.checkTypeMaster(req.body);
    }catch(e){
      res.status(400).json({error:e.message});
    }
  
    try{
      const updatedPost = await usertest.updatePut(req.body);
  
      return res.json(updatedPost);
    }catch(e){
      return res.status(404).json({error:e.message});
    } 
  })
  .post(async (req,res)=>{
    try{
      req.body = validation.checkTypeMaster(req.body);
    }catch(e){
      return res.status(400).json({erro:e.message});
    }

    try{
      let createdUser = await usertest.create(req.body);
      return res.json(createdUser);
    }catch(e){
      return res.status(404).json({error:e.message});
    }
  })
  .patch(async(req,res)=>{

    try{
      req.body = validation.checkIfExistsAndValidate(req.body);
    }catch(e){
      return res.status(400).json({error:e.message});
    }

    try{
      let patchedInfo = await usertest.updatePatch(req.body);

      return res.json(patchedInfo);
    }catch(e){
      return res.status(404).json({error:e.message});
    }

  })

  router.route('/:id').get(async (req,res) =>{

  try{
    req.params.id = validation.checkStr(req.params.id);
  }catch(e){
   return res.status(400).json({error:e});
  }
  try{
    let userList = await usertest.getUserById(req.params.id);
    return res.json(userList);
  }catch(e){
    return res.status(404).json({error:e});
  }
})
.delete(async (req,res) =>{
  try{
    req.params.id= validation.stringExistandType(req.params.id);
    await usertest.getUserById(req.params.id);
  }catch(e){
    return res.status(400).json({error:e})
  }

  try{
    const deletedInfo = await usertest.deleteUser(req.params.id);
    return res.json({employeeId:deletedInfo.id,deletedUser:(deletedInfo.firstName) +' '+  (deletedInfo.lastName),deleted: true});
  }catch(e){
    return res.status(500).json({error:e});
  }
})



//export router
export default router;