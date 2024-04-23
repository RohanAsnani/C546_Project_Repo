import usertest from './user_Test.js';
import * as validation from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"


const exportedMethods ={

async getUsernameAndValidate(username,pass){

    if(!username || !pass)throw new Error('username and password needed.');

    username = validation.stringExistandType(username);
    pass = validation.stringExistandType(pass);

    const userCollection = await users();
    let credentialsCheck = await userCollection.findOne({username : username});

    if(credentialsCheck === null)return credentialsCheck

    if(credentialsCheck.password === pass){
        credentialsCheck.credentialsCheckStatus = 'true';
    }else credentialsCheck.credentialsCheckStatus = 'false';

    return credentialsCheck
}


}

export default exportedMethods