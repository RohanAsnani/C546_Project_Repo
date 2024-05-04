import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

const checkStr = (str, param, minLen, maxLen, containNum) => {
  if (!(typeof str === "string"))
    throw new Error(`${param} needs to be string type.`);
  if (!str) throw new Error(`${param} needed.`);
  str = str.trim();
  str = str.toLowerCase();
  if (str.length === 0)
    throw new Error(`${param} cannot be empty or just spaces.`);
  if (containNum === false) {
    if (/\d/.test(str))
      throw new Error(`${param} cannot have any numbers in it.`);
  }
  if (!(!minLen && !maxLen))
    if (!(minLen <= str.length && str.length <= maxLen))
      throw new Error(
        `${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`
      );
  return str;
};
const checkStrCS = (str, param, minLen, maxLen, containNum) => {
  if (!(typeof str === "string"))
    throw new Error(`${param} needs to be string type.`);
  if (!str) throw new Error(`${param} needed.`);
  str = str.trim();
  if (str.length === 0)
    throw new Error(`${param} cannot be empty or just spaces.`);
  if (containNum === false) {
    if (/\d/.test(str))
      throw new Error(`${param} cannot have any numbers in it.`);
  }
  if (!(!minLen && !maxLen))
    if (!(minLen <= str.length && str.length <= maxLen))
      throw new Error(
        `${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`
      );
  return str;
};
const dateFormat = (dateReleased, param) => {
  if (dateReleased.length !== 10) {
    throw new Error(`parameter ${param} is not in proper date format`);
  }
  let date = dateReleased.split("-").map(x => x);
  if (date.length !== 3) {
    throw new Error(`parameter ${param} is not in proper date format`);
  }
  return date;
};

const isValidDate = (month, date, year, param) => {
  let Today = new Date();
  if (month.length !== 2 || date.length !== 2 || year.length !== 4) {
    throw new Error(`parameter ${param} is not in proper date format`);
  }
  if (isNaN(month) || isNaN(date) || isNaN(year)) {
    throw new Error(`parameter ${param} is not in proper date format`);
  }
  if (Number(year) < 0) {
    throw new Error(`parameter ${param} has an invalid ${year}`);
  }
  if (Number(month) < 1 || Number(month) > 12) {
    throw new Error(`parameter ${param} has an invalid month ${month}`);
  }
  if (Number(date) < 1 || Number(date) > 31) {
    throw new Error(`parameter ${param} has an invalid day ${date}`);
  }

  if (Number(month) == 2) {
    if (Number(date) > 28) {
      throw new Error(
        `parameter ${param} has an invalid day value ${date} for February`
      );
    }
  } else {
    if (["04", "06", "09", "11"].includes(month)) {
      if (Number(date) > 30) {
        throw new Error(
          `parameter ${param} has an invalid day value ${date} for the month ${month}`
        );
      }
    }
  }

  if (Number(year) > Today.getFullYear()) {
    throw new Error(
      `parameter ${param} cannot have a future year value ${year}`
    );
  }
  if (
    Number(year) === Today.getFullYear() &&
    Today.getMonth() + 1 < Number(month)
  ) {
    throw new Error(
      `parameter ${param} cannot have a future month value ${month} for current year`
    );
  }
  if (
    Number(year) === Today.getFullYear() &&
    Today.getMonth() + 1 === Number(month) &&
    Today.getDate() < Number(date)
  ) {
    throw new Error(
      `parameter ${param} cannot have a future day value ${date} for current year and month`
    );
  }
};

const numberExistandType = (num, param, int = true, dec = 2) => {
  if (typeof num === "string")
    throw new Error(`parameter ${param} cannot be string.`);
  if (num === null) {
    throw new Error(`parameter ${param} cannot be null`);
  }
  if (num === undefined) {
    throw new Error(`parameter ${param} cannot be undefined`);
  }
  if (int) {
    if (!Number.isInteger(num)) {
      throw new Error(
        `parameter ${param} has value ${num} which is not of the type Integer`
      );
    }
  } else {
    if (typeof num !== "number" && !isNaN(num)) {
      throw new Error(
        `parameter ${param} has value ${num} which is a ${typeof num} and not of the type number`
      );
    }
    if ((num.toString().split(".")[1] || "").length > dec) {
      throw new Error(
        `parameter ${param} of value ${num} should not exceed ${dec} decimal places`
      );
    }
  }
  if (num < 0) {
    throw new Error(`parameter ${param} is a number less than 0`);
  }
  return num;
};

const arrayExistandType = (arr, param) => {
  if (arr === null) {
    throw new Error(`parameter ${param} cannot be null`);
  }
  if (arr === undefined) {
    throw new Error(`parameter ${param} cannot be undefined`);
  }
  if (!Array.isArray(arr)) {
    throw new Error(`parameter ${param} should be an array type input`);
  }
  if (arr.length == 0) {
    throw new Error(`parameter ${param} cannot be empty`);
  }
};

const validObject = id => {
  if (!ObjectId.isValid(id)) {
    throw new Error(`The parameter id is not a valid ObjectId`);
  }
  return id;
};

const isValidWebsite = manufacturerWebsite => {
  if (manufacturerWebsite.slice(0, 11) !== "http://www.") {
    throw new Error(
      `${manufacturerWebsite} is not a valid website URL because it doesnt start with 'http://www.'`
    );
  }
  if (manufacturerWebsite.slice(-4) !== ".com") {
    throw new Error(
      `${manufacturerWebsite} is not a valid website URL because it doesnt end with '.com'`
    );
  }
  let temp = manufacturerWebsite.slice(11, -4);
  if (temp.length < 5) {
    throw new Error(
      `${manufacturerWebsite} is not a valid website URL because it doesnt have atleast 5 characters between 'http://www.' and '.com'`
    );
  }
  const special = [
    "!",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "+",
    "=",
    "[",
    "]",
    "{",
    "}",
    "|",
    "\\",
    ";",
    ":",
    "'",
    '"',
    "<",
    ">",
    ",",
    "/",
    "?",
    "~",
    "`",
  ];
  let chars = special.filter(x => temp.indexOf(x) !== -1);
  if (chars.length !== 0) {
    throw new Error(
      `The manufacturerWebsite parameter cannot conatin special character(s) like ${chars.join()} between 'http://www.' and '.com'`
    );
  }
  const allow = ["-", "_", "."];
  let allo = temp.split("").filter(x => allow.indexOf(x) !== -1);
  if (allo.length === temp.length) {
    throw new Error(
      `The manufacturerWebsite parameter cannot just be a string of "-" or "-" or "_" characters: ${temp}, between 'http://www.' and '.com'`
    );
  }
};

const booleanExistsandType = (boo, param) => {
  if (boo === null) {
    throw new Error(`${param} parameter cannot be null`);
  }
  if (boo === undefined) {
    throw new Error(`${param} parameter cannot be undefined`);
  }
  if (typeof boo !== "boolean") {
    throw new Error(
      `${param} parameter has value ${boo} which is a ${typeof boo} and not of the type boolean`
    );
  }
};

const numberRange = (num, param, low, high) => {
  if (num < low) {
    throw new Error(
      `${param} parameter with value ${num}, cannot be less than ${low}`
    );
  }
  if (num > high) {
    throw new Error(
      `${param} parameter with value ${num}, cannot be greater than ${high}`
    );
  }
};

const isValidEmail = email => {
  email = checkStr(email, "email", 5, 35, true);
  if (!email.includes("@")) throw new Error("Email id should contain @ in it.");
  let firstIndex = email.indexOf("@");
  let lastIndex = email.lastIndexOf("@");
  if (firstIndex !== lastIndex)
    throw new Error("Email Id cannot contain more than one '@'.");

  if (!email.endsWith(".com"))
    throw new Error("Email Id should end with '.com'");
  return email;
};

const isValidEmployeeId = employeeId => {
  const regex = /^HRC[A-Z]{2}[0-9]{4}$/;
  if (!regex.test(employeeId))
    throw new Error(
      "Employee Id must be in format of HRC followed by 2 Uppercase Characters and ending with 4 digits. Eg: HRCNS0001 , HRCST0002"
    );
  return employeeId;
};

const checkPassConstraints = (str, minLen) => {
  str = str.trim(); //should we trim this??
  if (!(minLen <= str.length))
    throw new Error("password should be atleast 8 characters long.");
  if (!/[A-Z]/.test(str))
    throw new Error("password should contain atleast 1 Uppercase Character.");
  if (!/\d/.test(str))
    throw new Error("password should contain atleast 1 number in it.");
  if (!/[^a-zA-Z0-9_]/.test(str))
    throw new Error("password should contain atleast 1 special Character.");
  if (str.includes(" "))
    throw new Error("password cannot contain spaces in between.");
  return str;
};
const isValidPhoneNumber = phoneNumber => {
  if (typeof phoneNumber !== "string")
    throw new Error("Date is not in proper data type.");
  let regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!regex.test(phoneNumber))
    throw new Error("Phone Number must be in format 012-345-6789");
  return phoneNumber;
};

const checkTypeMaster = updationInfo => {
  let strArr = [
    updationInfo.firstName,
    updationInfo.lastName,
    updationInfo.disability,
    updationInfo.race,
    updationInfo.countryOfOrigin,
    updationInfo.currentPosition,
  ];

  updationInfo.username = checkStr(
    updationInfo.username,
    "username",
    5,
    20,
    true
  );

  updationInfo.email = isValidEmail(updationInfo.email);
  updationInfo.employeeId = isValidEmployeeId(updationInfo.employeeId);
  if (!(updationInfo.password === updationInfo.confirmPassword))
    throw new Error("password and Confirm passwords do not match.");
  updationInfo.password = checkPassConstraints(updationInfo.password, 8);

  updationInfo.gender = checkState(updationInfo.gender, "Gender", [
    "male",
    "female",
    "other",
  ]);

  updationInfo.department = checkState(updationInfo.department, "Department", [
    "it",
    "finance",
    "human resources",
    "adminstration",
    "research and development",
    "customer service",
  ]);

  updationInfo.role = checkState(updationInfo.role, "role", [
    "admin",
    "hr",
    "employee",
  ]);

  updationInfo.maritalStatus = checkState(
    updationInfo.maritalStatus,
    "Marital Status",
    ["single", "married", "divorced", "seperated", "widowed"]
  );

  let dateArr = [updationInfo.startDate, updationInfo.dob];

  updationInfo.endDate = "";

  let numArr = [updationInfo.currentSalary];

  strArr = strArr.map(check => {
    check = checkStr(check, `${check}`, 2, 20, false);
    return check;
  });

  updationInfo.phone = isValidPhoneNumber(updationInfo.phone);

  dateArr = dateArr.map(check => {
    check = check.trim();
    check = dateFormat(check);
    let year = check[0];
    let month = check[1];
    let date = check[2];

    isValidDate(month, date, year);
    check = String(check[0]) + "-" + String(check[1]) + "-" + String(check[2]);
    return check;
  });

  if (updationInfo.dob > updationInfo.startDate)
    throw new Error("Start Date cannot be before Date of birth.");

  if (!(updationInfo.promoDate === "")) {
    check = dateFormat(updationInfo.promoDate);
    let year = check[0];
    let month = check[1];
    let date = check[2];

    isValidDate(month, date, year);
    updationInfo.promoDate =
      String(check[0]) + "-" + String(check[1]) + "-" + String(check[2]);
    if (updationInfo.promoDate < updationInfo.startDate)
      throw new Error("Promotion Date cannot be before Start Date.");
  }

  numArr = numArr.map(check => {
    check = parseInt(check);
    check = numberExistandType(check, `${check}`);
    return check;
  });

  updationInfo.primaryAddress = checkStr(
    updationInfo.primaryAddress,
    "Primary Address",
    5,
    200,
    true
  );
  updationInfo.secondaryAddress = checkStr(
    updationInfo.secondaryAddress,
    "Primary Address",
    5,
    200,
    true
  );

  const updateuser = {
    employeeId: updationInfo.employeeId,
    firstName: strArr[0],
    lastName: strArr[1],
    username: updationInfo.username,
    password: updationInfo.password,
    gender: updationInfo.gender,
    maritalStatus: updationInfo.maritalStatus,
    department: updationInfo.department,
    role: updationInfo.role,
    disability: strArr[2],
    race: strArr[3],
    countryOfOrigin: strArr[4],
    startDate: dateArr[0],
    endDate: updationInfo.endDate,
    dob: dateArr[1],
    currentPosition: strArr[5],
    currentSalary: numArr[0],
    promoDate: updationInfo.promoDate,
    subordinates: updationInfo.subordinates,
    managerId: updationInfo.managerId,
    email: updationInfo.email,
    phone: updationInfo.phone,
    primaryAddress: updationInfo.primaryAddress,
    secondaryAddress: updationInfo.secondaryAddress,
  };
  return updateuser;
};

const checkState = (val, param, arr) => {
  if (!(typeof val === "string"))
    throw new Error(`${param} needs to be string type.`);
  val = val.trim();
  val = val.toLowerCase();
  if (!arr.includes(val))
    throw new Error(`${param} should be ${[...arr]} nothing else.`);
  return val;
};
async function bcryptPass(str) {
  const saltRounds = 12;
  str = await bcrypt.hash(str, saltRounds);
  let buffer = 1;
  return str;
}

const checkIfExistsAndValidate = info => {
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
  }
  if (info.department) {
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
  }
  if (info.endDate) {
    dateFormat(info.endDate);
    let month = check[0];
    let date = check[1];
    let year = check[2];
    isValidDate(month, date, year);
  }
  if (info.promoDate) {
    dateFormat(info.promoDate);
    let month = check[0];
    let date = check[1];
    let year = check[2];
    isValidDate(month, date, year);
  }
  return info;
};

let checkUndefinedOrNull = (obj, variable) => {
  if (obj === undefined || obj === null)
    throw `All fields need to have valid values. Input for '${
      variable || "provided variable"
    }' param is undefined or null.`;
};

const validateBoardingData = (
  existingBoardData,
  userId,
  taskName,
  dueDate,
  taskType,
  isUpdate
) => {
  checkUndefinedOrNull(userId, "userId");
  checkUndefinedOrNull(taskName, "taskName");
  checkUndefinedOrNull(dueDate, "dueDate");
  checkUndefinedOrNull(taskType, "taskType");

  userId = validObject(userId);
  taskName = stringExistandType(taskName);

  // let dateArr = dateFormat(dueDate.trim(), 'dueDate');
  // let month = dateArr[0];
  // let date = dateArr[1];
  // let year = dateArr[2];
  // isValidDate(month, date, year, 'dueDate');
  dueDate = dueDate.trim();

  taskType = stringExistandType(taskType);
  let task = {
    _id: new ObjectId(),
    taskName: taskName,
    dueDate: dueDate,
    completedOn: null,
  };
  let taskArr = [];
  taskArr.push(task);
  let boardTask;
  if (isUpdate) {
    if (taskType === "onboard") {
      if (!existingBoardData.on || existingBoardData.on === null) {
        existingBoardData.on = taskArr;
      } else {
        //onboard tasks already present - append to the array
        let onTaskArr = existingBoardData.on;
        onTaskArr.push(task);
        existingBoardData.on = onTaskArr;
      }
    } else if (taskType === "offboard") {
      if (!existingBoardData.off || existingBoardData.off === null) {
        existingBoardData.off = taskArr;
      } else {
        //offboard tasks already present - append to the array
        let offTaskArr = existingBoardData.off;
        offTaskArr.push(task);
        existingBoardData.off = offTaskArr;
      }
    }
  } else {
    //create
    if (taskType === "onboard") {
      boardTask = {
        employeeId: userId,
        on: taskArr,
      };
    } else if (taskType === "offboard") {
      boardTask = {
        employeeId: userId,
        off: taskArr,
      };
    }
  }

  return isUpdate ? existingBoardData : boardTask;
};
const validateBoardingDataPatch = (
  userId,
  taskId,
  taskType,
  updateBoardDataObj
) => {
  checkUndefinedOrNull(userId, "userId");
  checkUndefinedOrNull(taskId, "taskId");
  checkUndefinedOrNull(updateBoardDataObj, "updateBoardDataObj");

  userId = validObject(userId);
  taskId = validObject(taskId);
  taskType = stringExistandType(taskType);

  if (updateBoardDataObj.taskName) {
    updateBoardDataObj.taskName = stringExistandType(
      updateBoardDataObj.taskName
    );
  }

  if (updateBoardDataObj.dueDate) {
    //checkUndefinedOrNull(dueDate, 'dueDate');
    let dateArr = dateFormat(updateBoardDataObj.dueDate.trim(), "dueDate");
    let month = dateArr[0];
    let date = dateArr[1];
    let year = dateArr[2];
    isValidDate(month, date, year, "dueDate");
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
};

const checkIsProperString = string1 => {
  // To check if the input provided is valid or not

  if (typeof string1 !== "string") {
    throw `${
      string1 || "provided input"
    } is not of type string. Kindly enter a string data type`;
  }

  if (string1 == undefined || string1 == null) {
    throw `${
      string1 || "provided input"
    } is undefined or unvalid. Kindly enter a valid string.`;
  }

  if (string1.trim().length < 1) {
    throw `${string1 || "provided input"} is empty`;
  }

  return string1.trim();
};

const checkifEmptySubject = subject => {
  if (subject == null) {
    throw new Error("subject for the leave is not selected");
  }
  return subject;
};

const validateLeaveReqForm = (subject, reason, startDate, endDate) => {
  subject = checkifEmptySubject(subject);
  const validOptions = ["Sick Leave", "Vacation Leave"];
  if (!validOptions.includes(subject)) {
    throw new Error("Subject is not choosen properly");
  }
  reason = checkIsProperString(reason);

  const startDate = new Date(startDate);
  const endDate = new Date(endDate);
  const currentDate = new Date();

  if (startDate < currentDate) {
    throw new Error(
      "The start date of the leave should be in the future, i.e. after the today's date"
    );
  }

  if (endDate < startDate) {
    throw new Error(
      "The end date of the leave should be in the future, i.e. after the start date"
    );
  }

  return { subject, reason, startDate, endDate };
};

export {
  arrayExistandType,
  booleanExistsandType,
  dateFormat,
  isValidDate,
  isValidWebsite,
  numberExistandType,
  numberRange,
  checkStr,
  checkState,
  validObject,
  checkTypeMaster,
  checkIfExistsAndValidate,
  validateBoardingData,
  validateBoardingDataPatch,
  isValidEmployeeId,
  checkPassConstraints,
  isValidEmail,
  isValidPhoneNumber,
  bcryptPass,
  checkStrCS,
  checkIsProperString,
  checkifEmptySubject,
  validateLeaveReqForm,
};
