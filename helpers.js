import { ObjectId } from "mongodb";
import bcrypt from 'bcryptjs';
import userData from './data/user_Test.js';

const checkStr = (str, param, minLen, maxLen, containNum) => {
    if (!(typeof (str) === 'string')) throw new Error(`${param} needs to be string type.`)
    if (!str) throw new Error(`${param} needed.`);
    str = str.trim()
    str = str.toLowerCase();
    if (str.length === 0) throw new Error(`${param} cannot be empty or just spaces.`);
    if (containNum === false) {
        if (/\d/.test(str)) throw new Error(`${param} cannot have any numbers in it.`);
    }
    if (!(!minLen && !maxLen))
        if (!(minLen <= str.length && str.length <= maxLen)) throw new Error(`${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`);
    return str
}
const checkStrCS =(str,param,minLen,maxLen,containNum,containSpecialChar)=>{
    if(!(typeof(str) === 'string'))throw new Error(`${param} needs to be string type.`)
    if(!str) throw new Error(`${param} needed.`);
    str  = str.trim()
    if(str.length === 0) throw new Error(`${param} cannot be empty or just spaces.`);
    if(containNum === false){
    if(/\d/.test(str))throw new Error(`${param} cannot have any numbers in it.`);
    }
    if(containSpecialChar === false){
        if(/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(str))throw new Error(`${param} cannot have special characters in it.`);
    }
    if(!(!minLen && !maxLen))
    if(!(minLen<= str.length && str.length <= maxLen)) throw new Error(`${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`);
    return str
}
const dateFormat = (dateReleased, param) => {
   if(dateReleased === null || typeof(dateReleased)=== 'undefined')throw new Error(`${param}is Undefined or Null.`);
   if(typeof(dateReleased) !== 'string')throw new Error(`${param} Needs to be string type.`);
  if(!dateReleased)throw new Error(`${param} cannot be just empty spaces.`);
    if (dateReleased.length !== 10) {
        throw new Error(`parameter ${(param)} is not in proper date format`)
    }
    let date = dateReleased.split('-').map(x => x)
    if (date.length !== 3) {
        throw new Error(`parameter ${(param)} is not in proper date format`)
    }
    return date
}

const isValidDate = (month, date, year, param,beFutureDate) => {
    let Today = new Date()
    if (month.length !== 2 || date.length !== 2 || year.length !== 4) {
        throw new Error(`parameter ${(param)} is not in proper date format`)
    }
    if (isNaN(month) || isNaN(date) || isNaN(year)) {
        throw new Error(`parameter ${(param)} is not in proper date format`)
    }
    if (Number(year) < 0) {
        throw new Error(`parameter ${(param)} has an invalid ${year}`)
    }
    if (Number(month) < 1 || Number(month) > 12) {
        throw new Error(`parameter ${(param)} has an invalid month ${month}`)
    }
    if (Number(date) < 1 || Number(date) > 31) {
        throw new Error(`parameter ${(param)} has an invalid day ${date}`)
    }

    if (Number(month) == 2) {
        if (Number(date) > 28) {
            throw new Error(`parameter ${(param)} has an invalid day value ${date} for February`)
        }
    } else {
        if (['04', '06', '09', '11'].includes(month)) {
            if (Number(date) > 30) {
                throw new Error(`parameter ${(param)} has an invalid day value ${date} for the month ${month}`)
            }
        }
    }

   if(beFutureDate === false){ 
    if (Number(year) > Today.getFullYear()) {
        throw new Error(`parameter ${(param)} cannot have a future year value ${year}`)
    }
    if (Number(year) === Today.getFullYear() && (Today.getMonth() + 1) < Number(month)) {
        throw new Error(`parameter ${(param)} cannot have a future month value ${month} for current year`)
    }
    if (Number(year) === Today.getFullYear() && (Today.getMonth() + 1) === Number(month) && Today.getDate() < Number(date)) {
        throw new Error(`parameter ${(param)} cannot have a future day value ${date} for current year and month`)
    }}
}

const numberExistandType = (num, param, int = true, dec = 2) => {
    if (typeof (num) === 'string') throw new Error(`parameter ${param} cannot be string.`)
    if (num === null) {
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if (num === undefined) {
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if (int) {
        if (!Number.isInteger(num)) {
            throw new Error(`parameter ${(param)} has value ${num} which is not of the type Integer`)
        }
    }
    else {
        if (typeof (num) !== 'number' && !isNaN(num)) {
            throw new Error(`parameter ${(param)} has value ${num} which is a ${typeof (num)} and not of the type number`)
        }
        if (((num.toString()).split('.')[1] || '').length > dec) {
            throw new Error(`parameter ${(param)} of value ${num} should not exceed ${dec} decimal places`)
        }
    }
    if (num < 0) {
        throw new Error(`parameter ${(param)} is a number less than 0`)
    }
    return num
}

const arrayExistandType = (arr, param) => {
    if (arr === null) {
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if (arr === undefined) {
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if (!Array.isArray(arr)) {
        throw new Error(`parameter ${(param)} should be an array type input`)
    }
    if (arr.length == 0) {
        throw new Error(`parameter ${(param)} cannot be empty`)
    }
}

const validObject = (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error(`The parameter id is not a valid ObjectId`)
    }
    return id
}

const isValidWebsite = (manufacturerWebsite) => {
    if (manufacturerWebsite.slice(0, 11) !== 'http://www.') {
        throw new Error(`${manufacturerWebsite} is not a valid website URL because it doesnt start with 'http://www.'`)
    }
    if (manufacturerWebsite.slice(-4) !== '.com') {
        throw new Error(`${manufacturerWebsite} is not a valid website URL because it doesnt end with '.com'`)
    }
    let temp = manufacturerWebsite.slice(11, -4)
    if (temp.length < 5) {
        throw new Error(`${manufacturerWebsite} is not a valid website URL because it doesnt have atleast 5 characters between 'http://www.' and '.com'`)
    }
    const special = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', '<', '>', ',', '/', '?', '~', '`']
    let chars = special.filter(x => temp.indexOf(x) !== -1)
    if (chars.length !== 0) {
        throw new Error(`The manufacturerWebsite parameter cannot conatin special character(s) like ${(chars.join())} between 'http://www.' and '.com'`)
    }
    const allow = ['-', '_', '.']
    let allo = temp.split('').filter(x => allow.indexOf(x) !== -1)
    if (allo.length === temp.length) {
        throw new Error(`The manufacturerWebsite parameter cannot just be a string of "-" or "-" or "_" characters: ${(temp)}, between 'http://www.' and '.com'`)
    }
}

const booleanExistsandType = (boo, param) => {
    if (boo === null) {
        throw new Error(`${(param)} parameter cannot be null`)
    }
    if (boo === undefined) {
        throw new Error(`${(param)} parameter cannot be undefined`)
    }
    if (typeof (boo) !== 'boolean') {
        throw new Error(`${(param)} parameter has value ${boo} which is a ${typeof (boo)} and not of the type boolean`)
    }
}

const numberRange = (num, param, low, high) => {
    if (num < low) {
        throw new Error(`${(param)} parameter with value ${num}, cannot be less than ${low}`)
    }
    if (num > high) {
        throw new Error(`${(param)} parameter with value ${num}, cannot be greater than ${high}`)
    }
}

const isValidEmail = (email) => {
    email = checkStr(email, 'email', 5, 35, true);
    if (!(email.includes('@'))) throw new Error('Email id should contain @ in it.');
    let firstIndex = email.indexOf('@');
    let lastIndex = email.lastIndexOf('@');
    if (firstIndex !== lastIndex) throw new Error("Email Id cannot contain more than one '@'.")

    if (!(email.endsWith('.com'))) throw new Error("Email Id should end with '.com'");
    return email
}

const isValidEmployeeId = (employeeId) => {
    const regex = /^HRC[A-Z]{2}[0-9]{4}$/;
    if (!(regex.test(employeeId))) throw new Error('Employee Id must be in format of HRC followed by 2 Uppercase Characters and ending with 4 digits. Eg: HRCNS0001 , HRCST0002');
    return employeeId
}
const isDateBeforeToday=(dateString)=> {
    // Parse the input date string
    const inputDate = new Date(dateString);
  
    // Get today's date
    const today = new Date();
  
    // Check if the input date is before today
    if (inputDate < today) {
      return true; // The input date is before today
    } else {
      return false; // The input date is not before today
    }
  }

const checkPassConstraints = (str, minLen) => {
    str = str.trim(); //should we trim this??
    if (!(minLen <= str.length)) throw new Error('password should be atleast 8 characters long.');
    if (!(/[A-Z]/.test(str))) throw new Error('password should contain atleast 1 Uppercase Character.');
    if (!(/\d/.test(str))) throw new Error('password should contain atleast 1 number in it.');
    if (!(/[^a-zA-Z0-9_]/.test(str))) throw new Error('password should contain atleast 1 special Character.');
    if (str.includes(' ')) throw new Error('password cannot contain spaces in between.')
    return str

}
const isValidPhoneNumber = (phoneNumber) => {
    if (typeof (phoneNumber) !== 'string') throw new Error('Date is not in proper data type.');
    let regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if (!(regex.test(phoneNumber))) throw new Error('Phone Number must be in format 012-345-6789');
    return phoneNumber
}
const checkMasterUser =(creationInfo)=>{
    if(creationInfo.password !== creationInfo.confirmPassword)throw new Error("Passwords don't match.");
    
    creationInfo.username = checkStr(creationInfo.username,'Username',5,20,true);
    
    creationInfo.firstName = checkStrCS(creationInfo.firstName,'First Name',2,20,true,false);
    
    creationInfo.lastName = checkStrCS(creationInfo.lastName,'Last Name',2,20,true,false);
    creationInfo.isManager = Boolean(creationInfo.isManager);
    if (creationInfo.isManager === false) {
        creationInfo.isManager = false;
    } else {
        creationInfo.isManager = true;
    }

    creationInfo.employeeId = isValidEmployeeId(creationInfo.employeeId);
    
    creationInfo.department = checkState(creationInfo.department,'Department',['IT','Finance','Human Resources','Adminstration','Research And Development','Customer Service']);
    
    creationInfo.role = checkState(creationInfo.role,'role',['Admin','HR','Employee']);
    
    creationInfo.startDate = creationInfo.startDate.trim();
    
    creationInfo.startDate = dateFormat(creationInfo.startDate,'Start Date');
    
    let year = creationInfo.startDate[0];
    let month = creationInfo.startDate[1];
    let date = creationInfo.startDate[2];

    isValidDate(month, date, year,'Start Date',true);
    creationInfo.startDate = String(creationInfo.startDate[0]) + '-' + String(creationInfo.startDate[1]) + '-' + String(creationInfo.startDate[2]);

    creationInfo.email = isValidEmail(creationInfo.email);
    creationInfo.personalEmail = isValidEmail(creationInfo.personalEmail);
    creationInfo.gender = "";
    creationInfo.maritalStatus = "";
    creationInfo.endDate = "";
    creationInfo.status = "Onboarding";
    creationInfo.vet = "";
    creationInfo.disability = "";
    creationInfo.race = "";
    creationInfo.countryOfOrigin = "";
    creationInfo.dob = "";
    creationInfo.phone = "";
    creationInfo.primaryAddress = "";
    creationInfo.secondaryAddress = "";
    creationInfo.currentPosition = "";
    creationInfo.currentSalary = 0;
    creationInfo.notes = [];
    creationInfo.managerId = "";
    creationInfo.leaveBank = {sickLeaves:5,vacation:5};

    let createUser = {
        employeeId: creationInfo.employeeId, firstName : creationInfo.firstName,lastName:creationInfo.lastName,username: creationInfo.username,password: creationInfo.password,gender: creationInfo.gender,maritalStatus:creationInfo.maritalStatus,department:creationInfo.department,role:creationInfo.role,isManager:creationInfo.isManager,notes:creationInfo.notes,status:creationInfo.status,vet:creationInfo.vet,disability:creationInfo.disability,race:creationInfo.race,countryOfOrigin:creationInfo.countryOfOrigin,startDate:creationInfo.startDate,endDate:creationInfo.endDate,dob:creationInfo.dob,currentPosition:creationInfo.currentPosition,currentSalary:creationInfo.currentSalary,contactInfo:{phone:creationInfo.phone,email:creationInfo.email,
        personalEmail:creationInfo.personalEmail,primaryAddress:creationInfo.primaryAddress,secondaryAddress:creationInfo.secondaryAddress},managerId:creationInfo.managerId,leaveBank:creationInfo.leaveBank
      }
      return createUser
}
const checkTypeUserHR =(patchInfo)=>{
    patchInfo.firstName = checkStrCS(patchInfo.firstName,'First Name',2,20,false,false)
    patchInfo.lastName = checkStrCS(patchInfo.lastName,'First Name',2,20,false,false)
    patchInfo.employeeId = isValidEmployeeId(patchInfo.employeeId);

    patchInfo.department = checkState(patchInfo.department,'Department',['IT','Finance','Human Resources','Adminstration','Research And Development','Customer Service']);
    
    patchInfo.role = checkState(patchInfo.role,'role',['Admin','HR','Employee']);
    
    patchInfo.startDate = patchInfo.startDate.trim();

    patchInfo.startDate = dateFormat(patchInfo.startDate);

    let year = patchInfo.startDate[0];
    let month = patchInfo.startDate[1];
    let date = patchInfo.startDate[2];

    isValidDate(month, date, year,'Date of Birth',true);
    patchInfo.startDate = String(patchInfo.startDate[0]) + '-' + String(patchInfo.startDate[1]) + '-' + String(patchInfo.startDate[2]);

    patchInfo.email = isValidEmail(patchInfo.email);
    if(patchInfo.isManager){
    patchInfo.isManager = checkState(patchInfo.isManager.toString(), 'isManager', ['true', 'false']);
    patchInfo.isManager = Boolean(patchInfo.isManager);
    }else{
        patchInfo.isManager = false;
    }

    patchInfo.managerId = isValidEmployeeId(patchInfo.managerId);
    
    patchInfo.gender = "";
    patchInfo.maritalStatus = "";
    patchInfo.endDate = "";
    patchInfo.status = "Onboarding(Employee-Side)";
    patchInfo.vet = "";
    patchInfo.disability = "";
    patchInfo.race = "";
    patchInfo.countryOfOrigin = "";
    patchInfo.dob = "";
    patchInfo.phone = "";
    patchInfo.primaryAddress = "";
    patchInfo.secondaryAddress = "";
    patchInfo.currentPosition = checkStrCS(patchInfo.currentPosition,'Current Position',5,20,true,false);
    patchInfo.currentSalary= Number(patchInfo.currentSalary);
    patchInfo.currentSalary = numberExistandType(patchInfo.currentSalary,`Salary`, false, 2);
    patchInfo.currentSalary = numberRange(patchInfo.currentSalary, 'Salary', 15.13, 200);
    patchInfo.notes = [];
    patchInfo.leaveBank = { sickLeaves: 5, vacation: 5 };

    let updateUser = {
        employeeId: patchInfo.employeeId, firstName : patchInfo.firstName,lastName:patchInfo.lastName,gender: patchInfo.gender,maritalStatus:patchInfo.maritalStatus,department:patchInfo.department,role:patchInfo.role,isManager:patchInfo.isManager,notes:patchInfo.notes,status:patchInfo.status,vet:patchInfo.vet,disability:patchInfo.disability,race:patchInfo.race,countryOfOrigin:patchInfo.countryOfOrigin,startDate:patchInfo.startDate,endDate:patchInfo.endDate,dob:patchInfo.dob,currentPosition:patchInfo.currentPosition,currentSalary:patchInfo.currentSalary,contactInfo:{phone:patchInfo.phone,email:patchInfo.email,primaryAddress:patchInfo.primaryAddress,secondaryAddress:patchInfo.secondaryAddress},managerId:patchInfo.managerId,leaveBank:patchInfo.leaveBank
      }

      return updateUser

}
const checkTypeUserEmployee =(patchInfo)=>{
    patchInfo.firstName = checkStrCS(patchInfo.firstName,'First Name',2,20,false,false)
    patchInfo.lastName = checkStrCS(patchInfo.lastName,'First Name',2,20,false,false)
    
    if(!patchInfo.dob) throw new Error('Date of Birth Needed.');
    patchInfo.dob =     dateFormat(patchInfo.dob,'Date of Birth');

    let year = patchInfo.dob[0];
    let month = patchInfo.dob[1];
    let date = patchInfo.dob[2];
    
    isValidDate(month, date, year,'Date Of Birth',false);
    patchInfo.dob = String(patchInfo.dob[0]) + '-' + String(patchInfo.dob[1]) + '-' + String(patchInfo.dob[2]);
          
    patchInfo.personalEmail = isValidEmail(patchInfo.personalEmail);
    
    
    patchInfo.gender = checkState(patchInfo.gender,'Gender',['Male','Female','Other']);
    patchInfo.maritalStatus = checkState(patchInfo.maritalStatus,'Marital Status',['Single','Married','Divorced','Seperated','Widowed']);
   
    patchInfo.status = "Active";
    patchInfo.vet = checkStrCS(patchInfo.vet,'Veteran',2,15,false);
    patchInfo.disability = checkStrCS(patchInfo.disability,'Disability',2,15,false,false);
    patchInfo.race = checkStrCS(patchInfo.race,'Race',2,10,false,false);
    patchInfo.countryOfOrigin = checkStrCS(patchInfo.countryOfOrigin,'Country Of Origin',2,25,false,false);

    patchInfo.phone = isValidPhoneNumber(patchInfo.phone);
    patchInfo.primaryAddress = checkStrCS(patchInfo.primaryAddress,'Primary Address',5,30,true,true);
    patchInfo.secondaryAddress = checkStrCS(patchInfo.secondaryAddress,'Secondary Address',5,30,true,true);

    let updateUser = {
         employeeId: patchInfo.employeeId,firstName : patchInfo.firstName,lastName:patchInfo.lastName,gender: patchInfo.gender,maritalStatus:patchInfo.maritalStatus,status:patchInfo.status,vet:patchInfo.vet,disability:patchInfo.disability,race:patchInfo.race,countryOfOrigin:patchInfo.countryOfOrigin,dob:patchInfo.dob,contactInfo:{phone:patchInfo.phone,personalEmail:patchInfo.personalEmail,primaryAddress:patchInfo.primaryAddress,secondaryAddress:patchInfo.secondaryAddress}
      }

    return updateUser

}


const updateValuesOfTwoObjects = (obj1, obj2)=> {
    for (let key in obj1) {
      // Check if the key exists in both objects and if the value in obj2 is an object
      // check if object is not array
      if (obj2.hasOwnProperty(key) && typeof obj2[key] === 'object' && typeof obj1[key] === 'object') {
        // Recursively update nested objects
        updateValuesOfTwoObjects(obj1[key], obj2[key]);
      } else if (obj2.hasOwnProperty(key)) {
        // Update the value in obj1 with the value from obj2
        obj1[key] = obj2[key];
      }
    }

    return obj1
}
const checkTypeMaster = (updationInfo) => {
    let strArr = [updationInfo.firstName, updationInfo.lastName, updationInfo.disability, updationInfo.race, updationInfo.countryOfOrigin, updationInfo.currentPosition];

    updationInfo.username = checkStr(updationInfo.username, 'username', 5, 20, true);

    updationInfo.email = isValidEmail(updationInfo.email);
    updationInfo.employeeId = isValidEmployeeId(updationInfo.employeeId);
    if (!(updationInfo.password === updationInfo.confirmPassword)) throw new Error('password and Confirm passwords do not match.');
    updationInfo.password = checkPassConstraints(updationInfo.password, 8);

    updationInfo.gender = checkState(updationInfo.gender, 'Gender', ['Male', 'Female', 'Other']);

    updationInfo.department = checkState(updationInfo.department, 'Department', ['it', 'finance', 'human resources', 'adminstration', 'research and development', 'customer service']);

    updationInfo.role = checkState(updationInfo.role, 'role', ['admin', 'hr', 'employee']);

    updationInfo.maritalStatus = checkState(updationInfo.maritalStatus, 'Marital Status', ['single', 'married', 'divorced', 'seperated', 'widowed']);

    let dateArr = [updationInfo.startDate, updationInfo.dob];

    updationInfo.endDate = "";

    let numArr = [updationInfo.currentSalary];

    strArr = strArr.map((check) => {
        check = checkStr(check, `${check}`, 2, 20, false);
        return check
    });

    updationInfo.phone = isValidPhoneNumber(updationInfo.phone)

    dateArr = dateArr.map((check) => {
        check = check.trim();
        check = dateFormat(check);
        let year = check[0];
        let month = check[1];
        let date = check[2];

        isValidDate(month, date, year);
        check = String(check[0]) + '-' + String(check[1]) + '-' + String(check[2]);
        return check
    });

    if (updationInfo.dob > updationInfo.startDate) throw new Error('Start Date cannot be before Date of birth.');


    if (!(updationInfo.promoDate === "")) {
        check = dateFormat(updationInfo.promoDate);
        let year = check[0];
        let month = check[1];
        let date = check[2];

        isValidDate(month, date, year);
        updationInfo.promoDate = String(check[0]) + '-' + String(check[1]) + '-' + String(check[2]);
        if (updationInfo.promoDate < updationInfo.startDate) throw new Error('Promotion Date cannot be before Start Date.');
    }

    numArr = numArr.map((check) => {
        check = parseInt(check);
        check = numberExistandType(check, `${check}`);
        return check
    });

    updationInfo.primaryAddress = checkStr(updationInfo.primaryAddress, 'Primary Address', 5, 200, true);
    updationInfo.secondaryAddress = checkStr(updationInfo.secondaryAddress, 'Primary Address', 5, 200, true);

    const updateuser = {
        employeeId: updationInfo.employeeId, firstName: strArr[0], lastName: strArr[1], username: updationInfo.username, password: updationInfo.password, gender: updationInfo.gender, maritalStatus: updationInfo.maritalStatus, department: updationInfo.department, role: updationInfo.role, disability: strArr[2], race: strArr[3], countryOfOrigin: strArr[4], startDate: dateArr[0], endDate: updationInfo.endDate, dob: dateArr[1], currentPosition: strArr[5], currentSalary: numArr[0], promoDate: updationInfo.promoDate, subordinates: updationInfo.subordinates, managerId: updationInfo.managerId, email: updationInfo.email, phone: updationInfo.phone, primaryAddress: updationInfo.primaryAddress, secondaryAddress: updationInfo.secondaryAddress
    }
    return updateuser
}

const checkState = (val, param, arr) => {
    if (!(typeof (val) === 'string')) throw new Error(`${param} needs to be string type.`)
    val = val.trim();
    if (!(arr.includes(val))) throw new Error(`${param} should be ${[...arr]} nothing else.`);
    return val

}
async function bcryptPass(str) {
    const saltRounds = 12;
    str = await bcrypt.hash(str, saltRounds)
    let buffer = 1;
    return str
}


const checkIfExistsAndValidate = (info) => {


    if (info.firstName) {
        info.firstName = stringExistandType(info.firstName);
    }
    if (info.lastName) {
        info.lastName = stringExistandType(info.lastName);
    }
    if (info.username) {
        info.username = stringExistandType(info.username);
    }
    if (info.password) {
        info.password = stringExistandType(info.password);
    }
    if (info.gender) {
        info.gender = stringExistandType(info.gender);
    }
    if (info.maritalStatus) {
        info.maritalStatus = stringExistandType(info.maritalStatus);
    } if (info.department) {
        info.department = stringExistandType(info.department);
    }
    if (info.role) {
        info.role = stringExistandType(info.role);
    }
    if (info.status) {
        info.status = stringExistandType(info.status);
    }
    if (info.disable) {
        info.disable = stringExistandType(info.disable);
    }
    if (info.race) {
        info.race = stringExistandType(info.race);
    }
    if (info.countryOfOrigin) {
        info.countryOfOrigin = stringExistandType(info.countryOfOrigin);
    }
    if (info.currentPosition) {
        info.currentPosition = stringExistandType(info.currentPosition);
    }
    if (info.currentSalary) {
        info.currentSalary = numberExistandType(info.currentSalary);
    }
    if (info.startDate) {
        dateFormat(info.startDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month, date, year);
    } if (info.endDate) {
        dateFormat(info.endDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month, date, year);
    } if (info.promoDate) {
        dateFormat(info.promoDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month, date, year);
    }
    return info
}

let checkUndefinedOrNull = (obj, variable) => {
    if (obj === undefined || obj === null) throw `All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`;
};

const validateBoardingData = (existingBoardData, userId, taskName, taskDesc, dueDate, taskType, isUpdate) => {
    checkUndefinedOrNull(userId, 'userId');
    checkUndefinedOrNull(taskName, 'taskName');
    checkUndefinedOrNull(taskDesc, 'taskDesc');
    checkUndefinedOrNull(dueDate, 'dueDate');
    checkUndefinedOrNull(taskType, 'taskType');

    userId = checkStrCS(userId, 'Employee Id', 0, 100, true,false);


    taskName = checkStrCS(taskName, 'Task Name', 0, 100, true);
    taskDesc = checkStrCS(taskDesc, 'Task Description', 0, 100, true);

    // let dateArr = dateFormat(dueDate.trim(), 'dueDate');
    // let month = dateArr[0];
    // let date = dateArr[1];
    // let year = dateArr[2];
    // isValidDate(month, date, year, 'dueDate');
    dueDate = dueDate.trim();

    taskType = checkStrCS(taskType, 'Task Type', 0, 100, true);
    let task = {
        _id: new ObjectId(),
        taskName: taskName,
        taskDesc: taskDesc,
        dueDate: dueDate,
        completedOn: null
    }
    let taskArr = [];
    taskArr.push(task);
    let boardTask;
    if (isUpdate) {
        if (taskType.toLowerCase() === 'onboard') {
            if (!existingBoardData.on || existingBoardData.on === null) {
                existingBoardData.on = taskArr;
            }
            else {//onboard tasks already present - append to the array
                let onTaskArr = existingBoardData.on;
                onTaskArr.push(task);
                existingBoardData.on = onTaskArr;
            }
        } else if (taskType.toLowerCase() === 'offboard') {
            if (!existingBoardData.off || existingBoardData.off === null) {
                existingBoardData.off = taskArr;
            }
            else {//offboard tasks already present - append to the array
                let offTaskArr = existingBoardData.off;
                offTaskArr.push(task);
                existingBoardData.off = offTaskArr;
            }
        }
    } else {//create
        if (taskType.toLowerCase() === 'onboard') {
            boardTask = {
                employeeId: userId,
                on: taskArr
            }
        } else if (taskType.toLowerCase() === 'offboard') {
            boardTask = {
                employeeId: userId,
                off: taskArr
            }
        }
    }

    return (isUpdate ? existingBoardData : boardTask);
}
const validateBoardingDataPatch = (userId, taskId, taskType, updateBoardDataObj) => {
    checkUndefinedOrNull(userId, 'userId');
    checkUndefinedOrNull(taskId, 'taskId');
    checkUndefinedOrNull(updateBoardDataObj, 'updateBoardDataObj');

    userId = validObject(userId);
    taskId = validObject(taskId);
    taskType = stringExistandType(taskType);

    if (updateBoardDataObj.taskName) {
        updateBoardDataObj.taskName = stringExistandType(updateBoardDataObj.taskName);
    }

    if (updateBoardDataObj.dueDate) {
        //checkUndefinedOrNull(dueDate, 'dueDate');
        let dateArr = dateFormat(updateBoardDataObj.dueDate.trim(), 'dueDate');
        let month = dateArr[0];
        let date = dateArr[1];
        let year = dateArr[2];
        isValidDate(month, date, year, 'dueDate',true);
        updateBoardDataObj.dueDate = updateBoardDataObj.dueDate.trim();
    }

    if (updateBoardDataObj.completedOn) {
        // checkUndefinedOrNull(completedOn, 'completedOn');
        // let dateArr = dateFormat(updateBoardDataObj.completedOn.trim(), 'completedOn');
        // let month = dateArr[0];
        // let date = dateArr[1];
        // let year = dateArr[2];
        // isValidDate(month, date, year, 'completedOn');
        updateBoardDataObj.completedOn = updateBoardDataObj.completedOn.trim();
    }

    updateBoardDataObj._id = taskId;

    // let taskArr = [];
    // taskArr.push(task);
    // let boardTask;

    // if (taskType === 'onboard') {
    //     boardTask = {
    //         employeeId: userId,
    //         on: taskArr
    //     }
    // } else if (taskType === 'offboard') {
    //     boardTask = {
    //         employeeId: userId,
    //         off: taskArr
    //     }
    // }

    let resObj = {};
    resObj.employeeId = userId;
    resObj.taskType = taskType;
    resObj.taskId = taskId;
    resObj.updateBoardDataObj = updateBoardDataObj;
    return resObj;
}


const convertDateFormat = (inputDate) => {
    var parts = inputDate.split('-');
    return parts[1] + '-' + parts[2] + '-' + parts[0];
};

const getTaskList = async (boardUserData, taskList, msg, getToDo, isOnboard, isEmp) => {
    let res = {};
    let map = {};
    let empIdArr = [];
    boardUserData.forEach((value) => {
        //console.log(value);
        let employeeId = value.employeeId;
        empIdArr.push(employeeId);
        if (isOnboard || isEmp) {
            if (value.on) {
                value.on.forEach((valueOn) => {
                    valueOn.employeeId = employeeId;
                    valueOn.taskType = "Onboard";
                    valueOn.isEmp = isEmp;
                    if (getToDo) {
                        if (valueOn.completedOn == null) {
                            taskList.push(valueOn);
                        }
                    } else {
                        if (valueOn.completedOn == null) {
                            valueOn.status = 'To Do';
                            valueOn.completedOn = "-";
                        } else {
                            valueOn.status = 'Done';
                        }
                        taskList.push(valueOn);
                    }
                });
            } else if (!isEmp) {
                msg = `No tasks assigned.`;
            }
        }
        if ((!isOnboard) || isEmp) {
            if (value.off) {
                value.off.forEach((valueOff) => {
                    valueOff.employeeId = employeeId;
                    valueOff.taskType = "Offboard";
                    valueOff.isEmp = isEmp;
                    if (getToDo) {
                        if (valueOff.completedOn == null) {
                            taskList.push(valueOff);
                        }
                    } else {
                        if (valueOff.completedOn == null) {
                            valueOff.status = 'To Do';
                            valueOff.completedOn = "-";
                        } else {
                            valueOff.status = 'Done';
                        }
                        taskList.push(valueOff);
                    }
                });
            } else if (!isEmp) {
                msg = `No tasks assigned.`;
            }
        }

        if (isEmp) {
            if ((!(value.on)) && (!(value.off))) {
                msg = `No tasks assigned.`;
            }
        }
    });
    for (let i = 0; i < empIdArr.length; i++) {
        let empData = await userData.getUserById(empIdArr[i]);
        map[empIdArr[i]] = empData;
    }
    if (!msg) {
        for (let i = 0; i < taskList.length; i++) {
            let currEle = taskList[i];
            let userData = map[currEle.employeeId];
            currEle.username = userData.username;
            currEle.firstName = userData.firstName;
            currEle.lastName = userData.lastName;
            currEle.taskId = currEle._id.toString();
            taskList[i] = currEle;
        }
    }
    res.taskList = taskList;
    res.msg = msg;
    return res;
}

const getLaterDate = (days) => {
    let currDate = Date.now();
    let date = new Date(currDate);
    date.setDate(date.getDate() + days);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}-${day}-${year}`;
}

const getCurrDate = () => {
    let currDate = Date.now();
    const date = new Date(currDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${month}-${day}-${year}`;
};

export { arrayExistandType, booleanExistsandType, dateFormat, isValidDate, isValidWebsite, numberExistandType, numberRange, checkStr, checkState, validObject, checkTypeMaster, checkIfExistsAndValidate, validateBoardingData, validateBoardingDataPatch, isValidEmployeeId, checkPassConstraints, isValidEmail, isValidPhoneNumber, bcryptPass, checkStrCS, checkMasterUser, checkTypeUserHR, updateValuesOfTwoObjects, convertDateFormat, getLaterDate, checkTypeUserEmployee, isDateBeforeToday, getTaskList,getCurrDate}