import { ObjectId } from "mongodb";

const stringExistandType=(str,param,length=0)=>{
    if(str===null){
        throw new Error(`${(param)} parameter cannot be null`)
    }
    if(str===undefined){
        throw new Error(`${(param)} parameter cannot be undefined`)
    }
    if(typeof(str)!=='string'){
        throw new Error(`${(param)} parameter has value ${str} which is a ${typeof(str)} and not of the type string`)
    }
    str = str.trim()
    if(str.length===0){
        throw new Error(`${(param)} parameter cannot be a empty string`)
    }
    if(length!==0){
        if(str.length!==length){
            throw new Error(`${(param)} parameter should be ${length} characters long`)
        }
    }
    return str;
}

const dateFormat=(dateReleased,param)=>{
    if(dateReleased.length!==10){
        throw new Error (`parameter ${(param)} is not in proper date format`)
      }
    let date = dateReleased.split('/').map(x=>x)
    if(date.length!==3){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    return date
}

const isValidDate=(month,date,year,param)=>{
    let Today = new Date()
    if(month.length!==2||date.length!==2||year.length!==4){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    if(isNaN(month)||isNaN(date)||isNaN(year)){
        throw new Error (`parameter ${(param)} is not in proper date format`)
    }
    if(Number(year)<0){
        throw new Error (`parameter ${(param)} has an invalid ${year}`)
    }
    if(Number(month)<1||Number(month)>12){
        throw new Error (`parameter ${(param)} has an invalid month ${month}`)
    }
    if(Number(date)<1||Number(date)>31){
        throw new Error (`parameter ${(param)} has an invalid day ${date}`)
    }

    if(Number(month)==2){
        if(Number(date)>28){
            throw new Error (`parameter ${(param)} has an invalid day value ${date} for February`)
        }
    }else{
        if(['04','06','09','11'].includes(month)){
            if(Number(date)>30){
                throw new Error (`parameter ${(param)} has an invalid day value ${date} for the month ${month}`)
            }
        }
    }

    if(Number(year)>Today.getFullYear()){
        throw new Error (`parameter ${(param)} cannot have a future year value ${year}`)
    }
    if(Number(year)===Today.getFullYear()&&(Today.getMonth()+1)<Number(month)){
        throw new Error (`parameter ${(param)} cannot have a future month value ${month} for current year`)
    }
    if(Number(year)===Today.getFullYear()&&(Today.getMonth()+1)===Number(month)&&Today.getDate()<Number(date)){
        throw new Error (`parameter ${(param)} cannot have a future day value ${date} for current year and month`)
    }
}

const numberExistandType=(num,param,int=true,dec=2)=>{
    if(typeof(num)==='string') throw new Error (`parameter ${param} cannot be string.`)
    if(num===null){
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if(num===undefined){
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if(int){
        if(!Number.isInteger(num)){
            throw new Error(`parameter ${(param)} has value ${num} which is not of the type Integer`)
        }
    }
    else{
        if(typeof(num)!=='number'&&!isNaN(num)){
            throw new Error(`parameter ${(param)} has value ${num} which is a ${typeof(num)} and not of the type number`)
        }
        if(((num.toString()).split('.')[1]|| '').length>dec){
            throw new Error (`parameter ${(param)} of value ${num} should not exceed ${dec} decimal places`)
        }
    }
    if(num<0){
        throw new Error(`parameter ${(param)} is a number less than 0`) 
    }
    return num
}

const arrayExistandType=(arr,param)=>{
    if(arr===null){
        throw new Error(`parameter ${(param)} cannot be null`)
    }
    if(arr===undefined){
        throw new Error(`parameter ${(param)} cannot be undefined`)
    }
    if(!Array.isArray(arr)){
        throw new Error(`parameter ${(param)} should be an array type input`)
    }
    if(arr.length==0){
        throw new Error(`parameter ${(param)} cannot be empty`)
    }
}

const validObject=(id)=>{
    if(!ObjectId.isValid(id)){
        throw new Error(`The parameter id is not a valid ObjectId`)
    }
    return id
}

const isValidWebsite=(manufacturerWebsite)=>{
    if(manufacturerWebsite.slice(0,11)!=='http://www.'){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt start with 'http://www.'`)
  }
  if(manufacturerWebsite.slice(-4)!=='.com'){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt end with '.com'`)
  }
  let temp = manufacturerWebsite.slice(11,-4)
  if(temp.length<5){
    throw new Error (`${manufacturerWebsite} is not a valid website URL because it doesnt have atleast 5 characters between 'http://www.' and '.com'`)
  }
  const special=['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+', '=', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', '<', '>', ',', '/', '?', '~', '`']
  let chars = special.filter(x=>temp.indexOf(x)!==-1)
  if(chars.length!==0){
      throw new Error(`The manufacturerWebsite parameter cannot conatin special character(s) like ${(chars.join())} between 'http://www.' and '.com'`)
  }
  const allow=['-','_','.']
  let allo = temp.split('').filter(x=>allow.indexOf(x)!==-1)
  if(allo.length===temp.length){
    throw new Error(`The manufacturerWebsite parameter cannot just be a string of "-" or "-" or "_" characters: ${(temp)}, between 'http://www.' and '.com'`)
  }
}

const booleanExistsandType=(boo,param)=>{
    if(boo===null){
        throw new Error(`${(param)} parameter cannot be null`)
      }
      if(boo===undefined){
          throw new Error(`${(param)} parameter cannot be undefined`)
      }
      if(typeof(boo)!=='boolean'){
          throw new Error(`${(param)} parameter has value ${boo} which is a ${typeof(boo)} and not of the type boolean`)
      }
}

const numberRange=(num,param,low,high)=>{
    if(num<low){
        throw new Error(`${(param)} parameter with value ${num}, cannot be less than ${low}`)
    }
    if(num>high){
        throw new Error(`${(param)} parameter with value ${num}, cannot be greater than ${high}`)
    }
}


const checkTypeMaster=(updationInfo)=>{
    let strArr = [updationInfo.employeeId,updationInfo.firstName,updationInfo.lastName,updationInfo.username,updationInfo.password,updationInfo.gender,updationInfo.maritalStatus,updationInfo.department,updationInfo.role,updationInfo.disable,updationInfo.race,updationInfo.countryOfOrigin,updationInfo.currentPosition,];

  let dateArr = [updationInfo.startDate,updationInfo.endDate,updationInfo.dob,updationInfo.promoDate];

  let numArr = [updationInfo.currentSalary];


  strArr = strArr.map((check)=>{
    check = stringExistandType(check,`${check}`);
    return check
  });

  dateArr = dateArr.map((check)=>{
    check = check.trim();
    check = dateFormat(check);
    let month = check[0];
    let date = check[1];
    let year = check[2];

    isValidDate(month,date,year);
    check = String(check[0])+'/'+String(check[1])+'/'+String(check[2]);
    return check
  });

  numArr = numArr.map((check)=>{
    check = numberExistandType(check,`${check}`);
    return check
  });

  const updateuser ={
    employeeId : strArr[0], firstName: strArr[1], lastName: strArr[2], username: strArr[3],password: strArr[4], gender: strArr[5], maritalStatus: strArr[6], department: strArr[7], role: strArr[8], disable: strArr[9], race: strArr[10], countryOfOrigin: strArr[11], startDate:dateArr[0], endDate:dateArr[1],dob:dateArr[2], currentPosition: strArr[12], currentSalary: numArr[0], promoDate: dateArr[3]
  }
  return updateuser
}


const checkIfExistsAndValidate =(info)=>{
    
    
    if(info.firstName){
        info.firstName = stringExistandType(info.firstName);
    }
    if(info.lastName){
        info.lastName = stringExistandType(info.lastName);
    }
    if(info.username){
        info.username = stringExistandType(info.username);
    }    
    if(info.password){
        info.password = stringExistandType(info.password);
    }
    if(info.gender){
        info.gender = stringExistandType(info.gender);
    }
    if(info.maritalStatus){
        info.maritalStatus = stringExistandType(info.maritalStatus);
    }if(info.department){
        info.department = stringExistandType(info.department);
    }
    if(info.role){
        info.role = stringExistandType(info.role);
    }
    if(info.status){
        info.status = stringExistandType(info.status);
    }
    if(info.disable){
        info.disable = stringExistandType(info.disable);
    }
    if(info.race){
        info.race = stringExistandType(info.race);
    }
    if(info.countryOfOrigin){
        info.countryOfOrigin = stringExistandType(info.countryOfOrigin);
    }
    if(info.currentPosition){
        info.currentPosition = stringExistandType(info.currentPosition);
    }
    if(info.currentSalary){
        info.currentSalary = numberExistandType(info.currentSalary);
    }
    if(info.startDate){
        dateFormat(info.startDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month,date,year);
    }if(info.endDate){
        dateFormat(info.endDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month,date,year);
    }if(info.promoDate){
        dateFormat(info.promoDate);
        let month = check[0];
        let date = check[1];
        let year = check[2];
        isValidDate(month,date,year);
    }
    return info
}

export{arrayExistandType,booleanExistsandType,dateFormat,isValidDate,isValidWebsite,numberExistandType,numberRange,stringExistandType,validObject,checkTypeMaster,checkIfExistsAndValidate}