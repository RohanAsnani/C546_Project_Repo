//import axios, md5
import axios from "axios";
import * as validation from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"

const exportedMethods ={
async create(creationInfo){
  creationInfo = validation.checkTypeMaster(creationInfo);
  
  const userCollection = await users();
  let createdUser = await userCollection.insertOne(creationInfo);

  if(!createdUser || typeof(createdUser) === 'null') throw new Error('Could not add User.');

  return this.getByObjectId(createdUser.insertedId)

},

  async getAll(){
    const userCollection = await users()
    let userList = await userCollection.find({}).toArray()
    if(!userList){
      return []
    }
    return userList
  },

async getByObjectId(objectId){
  objectId = validation.validObject(objectId);

  let userCollection = await users();
  let userData = await  userCollection.findOne({
    _id: new ObjectId(objectId)
    //projections
  });

  if(!userData) throw new Error(`Could not find employee with ${objectId}`);

  return userData
},

async getUserById(userId){

  if(!userId) throw 'id required';
  userId = validation.stringExistandType(userId,'User Id');

  const userCollection = await users();
  let userList = await userCollection.findOne({employeeId: userId},{firstName : 1, lastName: 1/*more projections*/ });

  if(!userList || userList === null ) throw 'Error : User Not Found.'; 
  return userList;

},
async deleteUser(userId){
  if(!userId || userId === null)throw 'user Id required';

  userId = validation.stringExistandType(userId);
  const checkIfExists = await this.getUserById(userId);
  const userCollection = await users();
 

  if(!checkIfExists)throw 'User does not exist with that user Id';


  const deletionInfo = await userCollection.findOneAndDelete({
    employeeId: userId
  });
  
  if(!deletionInfo)throw `Could not delete product with user id ${userId}`;

  return deletionInfo

},
async updatePut(updationInfo){
  updationInfo = validation.checkTypeMaster(updationInfo);
  
  const userCollection = await users();
  let updatedInfo = await userCollection.findOneAndReplace(
    {employeeId: updationInfo.employeeId},
    updationInfo,
    {returnDocument: 'after'}
  );
  
  if(!updatedInfo|| updatedInfo === 'null')throw new Error (`Could not find user with id: ${updationInfo.employeeId}`);
  return updatedInfo

},

async updatePatch(updationInfo){

  if(!updationInfo.employeeId)throw new Error('Missing employee id.');
  updationInfo = validation.checkIfExistsAndValidate(updationInfo);
  let userCollection = await users();
  let patchedInfo = await userCollection.findOneAndUpdate({employeeId: updationInfo.employeeId},
  {$set:updationInfo},
  {returnDocument: 'after'}
  );

  if(!patchedInfo)throw new Error(`Cannot update user with id: ${employeeId}`);

  return patchedInfo

}




}
export default exportedMethods;