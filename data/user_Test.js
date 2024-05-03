//import axios, md5
import axios from "axios";
import * as validation from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"
import bcrypt from 'bcryptjs';

const exportedMethods ={
async create(creationInfo){
  // creationInfo = validation.checkTypeMaster(creationInfo);
  
  if(creationInfo.password !== creationInfo.confirmPassword)throw new Error("Passwords don't match.");
  
  creationInfo.password = await validation.bcryptPass(creationInfo.password);

  creationInfo.currentPosition = '';
  
  creationInfo.username = validation.checkStr(creationInfo.username,'Username',2,20,true);
  
  creationInfo.firstName = validation.checkStrCS(creationInfo.firstName,'First Name',2,20,true,false);
  
  creationInfo.lastName = validation.checkStrCS(creationInfo.lastName,'Last Name',2,20,true,false);
  
  creationInfo.employeeId = validation.isValidEmployeeId(creationInfo.employeeId);
  
  creationInfo.department = validation.checkState(creationInfo.department,'Department',['IT','Finance','Human Resources','Adminstration','Research And Development','Customer Service']);
  
  creationInfo.role = validation.checkState(creationInfo.role,'role',['Admin','HR','Employee']);
  
  creationInfo.startDate = creationInfo.startDate.trim();
  
  creationInfo.startDate = validation.dateFormat(creationInfo.startDate);
  
  let year = creationInfo.startDate[0];
  let month = creationInfo.startDate[1];
  let date = creationInfo.startDate[2];
  
  validation.isValidDate(month, date, year);
  creationInfo.startDate = String(creationInfo.startDate[0]) + '-' + String(creationInfo.startDate[1]) + '-' + String(creationInfo.startDate[2]);
        
  creationInfo.email = validation.isValidEmail(creationInfo.email);
  
  creationInfo = {
    employeeId: creationInfo.employeeId, firstName : creationInfo.firstName,lastName:creationInfo.lastName,username: creationInfo.username,password: creationInfo.password,gender: creationInfo.gender,maritalStatus:creationInfo.maritalStatus,department:creationInfo.department,role:creationInfo.role,notes:creationInfo.notes,status:creationInfo.status,vet:creationInfo.vet,disability:creationInfo.disability,race:creationInfo.race,countryOfOrigin:creationInfo.countryOfOrigin,startDate:creationInfo.startDate,endDate:creationInfo.endDate,dob:creationInfo.dob,currentPosition:creationInfo.currentPosition,isManager:creationInfo.isManager,currentSalary:creationInfo.currentSalary,contactInfo:{phone:creationInfo.phone,email:creationInfo.email,personalEmail:creationInfo.personalEmail,primaryAddress:creationInfo.primaryAddress,secondaryAddress:creationInfo.secondaryAddress},managerId:creationInfo.managerId,leaveBank:creationInfo.leaveBank
  }
  
  const userCollection = await users();

  let checkUsername = await userCollection.findOne({username: creationInfo.username})
  if(checkUsername)throw new Error('Username already exists. Try Another Username.');
  let checkEmployeeId = await userCollection.findOne({employeeId: creationInfo.employeeId})
  if(checkEmployeeId)throw new Error('EmployeeId already exists with the given EmployeeId.');
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
  userId = validation.checkStrCS(userId,'User Id',5,20,true,false);

  const userCollection = await users();
  let userList = await userCollection.findOne({employeeId: userId},{projection:{password:0}});

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

},

  async getOnboardingHR() {
    let userCollection = await users();
    let onboardingUsers = await userCollection.find({ status: "Onboarding" }, { projection: { password: 0 } });

    if (!onboardingUsers) return false

    return onboardingUsers.toArray();
  },

  async getOffboardingHR() {
    let userCollection = await users();
    let onboardingUsers = await userCollection.find({ status: "Offboarding" }, { projection: { password: 0 } });

    if (!onboardingUsers) return false

    return onboardingUsers.toArray();
  }


}
export default exportedMethods;