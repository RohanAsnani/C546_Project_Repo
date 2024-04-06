//import express and express router as shown in lecture code and worked in previous labs.  Import your data functions from /data/movies.js that you will call in your routes below
import {Router} from 'express';
const router = Router();
import * as usertest from '../data/user_Test.js';
import * as helper from '../helpers.js';

router
  .route('/')
  .get(async (req, res) => {
    //code here for GET
    try {
      const userdata = await usertest.getAll();
      return res.json(userdata);
    } catch (e) {
      return res.status(500).json({error: e.message});
    }
  })

//export router
export default router;