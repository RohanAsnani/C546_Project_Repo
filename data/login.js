import usertest from './user_Test.js';
import * as validation from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"
import bcrypt from 'bcryptjs';


const exportedMethods ={

async getUsernameAndValidate(username,pass){

    if(!username || !pass)throw new Error('username and password needed.');

    username =  validation.checkStr(username,'username',5,20,true);
    

    const userCollection = await users();
    let credentialsCheck = await userCollection.findOne({username : username});

    if(credentialsCheck === null)throw new Error('Username Or Password is Incorrect.')

    let checkPass = await bcrypt.compare(pass,credentialsCheck.password);
   
    if(checkPass === false)throw new Error('Incorrect Password.');
    delete credentialsCheck.password
    return credentialsCheck
}


}

export default exportedMethods