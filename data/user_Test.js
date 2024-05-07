//import axios, md5
import axios from "axios";
import * as validation from "../helpers.js"
import { users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"
import bcrypt from 'bcryptjs';
import sendEmail from "../util/emailNotif.js";
// import nodemailer from 'nodemailer';

const exportedMethods ={
async create(creationInfo){
  // creationInfo = validation.checkTypeMaster(creationInfo);
  
  if(creationInfo.password !== creationInfo.confirmPassword)throw new Error("Passwords don't match.");
  const emaildata={ email: creationInfo.personalEmail, username: creationInfo.username, password: creationInfo.password }
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

  creationInfo.securityQuestion = "";
  creationInfo.securityAnswer  = "";
        
  creationInfo.email = validation.isValidEmail(creationInfo.email);
  creationInfo.personalEmail = validation.isValidEmail(creationInfo.personalEmail);
  creationInfo = {
    employeeId: creationInfo.employeeId, firstName : creationInfo.firstName,lastName:creationInfo.lastName,username: creationInfo.username,password: creationInfo.password,gender: creationInfo.gender,maritalStatus:creationInfo.maritalStatus,department:creationInfo.department,role:creationInfo.role,notes:creationInfo.notes,status:creationInfo.status,vet:creationInfo.vet,disability:creationInfo.disability,race:creationInfo.race,countryOfOrigin:creationInfo.countryOfOrigin,startDate:creationInfo.startDate,endDate:creationInfo.endDate,dob:creationInfo.dob,currentPosition:creationInfo.currentPosition,isManager:creationInfo.isManager,currentSalary:creationInfo.currentSalary,contactInfo:{phone:creationInfo.phone,email:creationInfo.email,personalEmail:creationInfo.personalEmail,primaryAddress:creationInfo.primaryAddress,secondaryAddress:creationInfo.secondaryAddress},managerId:creationInfo.managerId,leaveBank:creationInfo.leaveBank,securityQuestion:creationInfo.securityQuestion,securityAnswer:creationInfo.securityAnswer
  }
  
  const userCollection = await users();

  let checkUsername = await userCollection.findOne({username: creationInfo.username})
  if(checkUsername)throw new Error('Username already exists. Try Another Username.');
  let checkEmployeeId = await userCollection.findOne({employeeId: creationInfo.employeeId})
  if(checkEmployeeId)throw new Error('EmployeeId already exists with the given EmployeeId.');
  let createdUser = await userCollection.insertOne(creationInfo);

  if(!createdUser || typeof(createdUser) === 'null') throw new Error('Could not add User.');

// Send email
  console.log('Sending email to ' + creationInfo.contactInfo.personalEmail);
  await sendEmail(emaildata.email, 'Account Created', 'Your account has been created successfully. Please visit the company website to login.\n Here is your username: ' + emaildata.username + '\n and password: ' + emaildata.password + '.');

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
async changePass(userId,newPass){
  if(!userId || !newPass)throw new Error('UserId and New Password Both Needed.')
  userId = validation.isValidEmployeeId(userId);
  newPass = validation.checkPassConstraints(newPass,8);
  let userCollection = await users();
  let checkUserId = await userCollection.findOne({employeeId: userId});
  if(!checkUserId)throw new Error(`No user with ${userId} exists.`)
  let checkPass = await bcrypt.compare(newPass,checkUserId.password)
  if(checkPass === true)throw new Error('New Password cannot be same as the old one.');
  let brcyptNewPass = await validation.bcryptPass(newPass)

  let checkNewPass = await userCollection.updateOne({employeeId: userId},{$set:{password:brcyptNewPass}}); 

  if(!checkNewPass.acknowledged)throw new Error('Could not change PassWord. CONTACT ADMIN.');

  return checkNewPass.acknowledged
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

async deactivateUser(userId){
 if(!userId)throw new Error('Employee Id Needed.');

 userId= validation.isValidEmployeeId(userId);

 let userCollection = await users();
 let deactivatedUser = await userCollection.updateOne({employeeId: userId},{$set:{status:'Inactive'}});

 if(!deactivatedUser)throw new Error('Could not deactivate User.');

 return deactivatedUser

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

async updatePatchNotes(updationInfo) {
  if (!updationInfo.employeeId) throw new Error('Missing employee id.');

  updationInfo = validation.checkIfExistsAndValidate(updationInfo);
  
  const noteToAdd = updationInfo.notes;
  if (!noteToAdd) throw new Error('Missing note content.');

  let userCollection = await users();

  let patchedInfo = await userCollection.findOneAndUpdate(
      { employeeId: updationInfo.employeeId },
      { $push: { notes: noteToAdd } },
      { returnDocument: 'after' }
  );
  if (!patchedInfo) throw new Error(`Cannot update user with id: ${updationInfo.employeeId}`);
  return patchedInfo;
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

async  getNotesByEmployeeId(employeeId) {
  const userCollection = await users()
  const employeeData = await userCollection.findOne(
      { employeeId: employeeId },
      { projection: { notes: 1, _id: 0 } } 
  );
  if (!employeeData) {
    throw new Error(`no user found with employee id: ${employeeId}`)
  }
  if(employeeData.notes.length===0){
    return []
  }
  return employeeData.notes ; 
},
async getUserIdFromUOE(userId){
  if(!userId)throw new Error('username or Personal Email Needed.');

  let userCollection = await users();
  let checkUserId = await userCollection.findOne({username: userId});

  let checkPersonalEmail = await userCollection.findOne({'contactInfo.personalEmail': userId});

  if(!checkUserId && !checkPersonalEmail)return false
  let mailEmployeeId='';
  if(checkUserId){
    mailEmployeeId = checkUserId.employeeId;
  }else{
    mailEmployeeId = checkPersonalEmail.employeeId;
  }
  return mailEmployeeId
},
async changeForgotPass(userId,secAns){
  if(!userId)throw new Error('EmployeeId needed.');

  let userCollection = await users();
  let data = await userCollection.findOne({employeeId: userId});

  let check = await bcrypt.compare(secAns,data.securityAnswer);

  if(check === false)throw new Error('Incorrect Answer.');

  let randomPass = validation.generatePassword()
  let sendPass = randomPass;
  randomPass = await validation.bcryptPass(randomPass);

  let resetPass = await userCollection.updateOne({employeeId: userId},{$set:{password:randomPass,forgotPass:true}});

  if(!resetPass.acknowledged)throw new Error('Could not Rest the Password.');

  let status = await sendEmail(data.contactInfo.personalEmail,"HR:Centrtal-PassWord Reset",`PassWord reset has been triggerd.
Hello ${data.firstName} ${data.lastName},
Your password has been reset. You will find the temporary Passowrd Below.
Temporary Password:   ${sendPass}
You wont be able to access other features if you dont change your password upon login.
Regards,
HR:Central Team.`);
    
},

  async getOnboardingHR() {
    let userCollection = await users();
    let onboardingUsers = await userCollection.find({ status: "Onboarding" }, { projection: { password: 0 } });

    if (!onboardingUsers) return false

    return onboardingUsers.toArray();
  },
  async getOnboardingHRES() {
    let userCollection = await users();
    let onboardingUsers = await userCollection.find({ status: "Onboarding(Employee-Side)" }, { projection: { password: 0 } });

    if (!onboardingUsers) return false

    return onboardingUsers.toArray();
  },

  async getOffboardingHR() {
    let userCollection = await users();
    let onboardingUsers = await userCollection.find({ status: "Offboarding" }, { projection: { password: 0 } });

    if (!onboardingUsers) return false

    return onboardingUsers.toArray();
  },
  async getUserByIdWithPass(userId) {

    if (!userId) throw 'id required';
    userId = validation.checkStrCS(userId, 'User Id', 5, 20, true, false);

    const userCollection = await users();
    let userList = await userCollection.findOne({ employeeId: userId });

    if (!userList || userList === null) throw 'Error : User Not Found.';
    return userList;

  },
  async updateUserStatus(updationInfo) {

    const userCollection = await users();
    let updatedInfo = await userCollection.findOneAndReplace(
      { employeeId: updationInfo.employeeId },
      updationInfo,
      { returnDocument: 'after' }
    );

    if (!updatedInfo || updatedInfo === 'null') throw new Error(`Could not find user with id: ${updationInfo.employeeId}`);
    return updatedInfo;

  }


}
export default exportedMethods;