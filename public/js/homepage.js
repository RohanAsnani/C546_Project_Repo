// clientside JS
function checkAgeOver18(birthDate) {
   
    const dob = new Date(birthDate);


    const currentDate = new Date();


    const age = currentDate.getFullYear() - dob.getFullYear();


    if (age < 18) {
        throw new Error('Start date should reflect user being over 18.');
    }
}
function isDateBeforeToday(dateString) {
    const inputDate = new Date(dateString);


    inputDate.setHours(0);
    inputDate.setMinutes(0);
    inputDate.setSeconds(0);
    inputDate.setMilliseconds(0);


    inputDate.setDate(inputDate.getDate() + 1);


    const currentDate = new Date();

    currentDate.setHours(0);
    currentDate.setMinutes(0);
    currentDate.setSeconds(0);
    currentDate.setMilliseconds(0);

    if(inputDate.getDate() === currentDate.getDate()){
        return false
    }   

    if(inputDate < currentDate){
        return true
    }else{
        return false
    }
    
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

const isValidEmail = (email) =>{
    email = checkStr(email,'Email',5,35,true);
    if(!(email.includes('@')))throw new Error('Email id should contain @ in it.');
    let firstIndex = email.indexOf('@');
    let lastIndex = email.lastIndexOf('@');
    if(firstIndex !== lastIndex)throw new Error("Email Id cannot contain more than one '@'.")
    
    if(!(email.endsWith('.com')))throw new Error("Email Id should end with '.com'");
    return email
}
const isValidPhoneNumber=(phoneNumber) =>{
    if(typeof(phoneNumber) !== 'string')throw new Error('Date is not in proper data type.');
    let regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
    if(!(regex.test(phoneNumber)))throw new Error('Phone Number must be in format 012-345-6789');
    return phoneNumber
}
const dateFormat = (dateReleased, param) => {
    if (dateReleased.length !== 10) {
        throw new Error(`${(param)} is not in proper date format`)
    }
    let date = dateReleased.split('-').map(x => x)
    if (date.length !== 3) {
        throw new Error(`${(param)} is not in proper date format`)
    }
    return date
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
const checkPassConstraints=(str,minLen)=>{
    str = str.trim(); //should we trim this??
    if(!(minLen <= str.length))throw new Error('Password should be atleast 8 characters long.');
    if(!(/[A-Z]/.test(str)))throw new Error('Password should contain atleast 1 Uppercase Character.');
    if(!(/\d/.test(str)))throw new Error('Password should contain atleast 1 number in it.');
    if(!(/[^a-zA-Z0-9_]/.test(str))) throw new Error('Password should contain atleast 1 special Character.');
    if(str.includes(' '))throw new Error('Password cannot contain spaces in between.')
    return str
    
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

    if(beFutureDate=== false){ 
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
const checkState =(val,param,arr) =>{
    if(!(typeof(val) === 'string'))throw new Error(`${param} needs to be string type.`)
    val=val.trim();
    if(!(arr.includes(val)))throw new Error(`${param} should be ${[...arr]} nothing else.`);
    return val

}
const checkStr =(str,param,minLen,maxLen,containNum,containSpecialChar)=>{
    if(!(typeof(str) === 'string'))throw new Error(`${param} needs to be string type.`)
    if(!str) throw new Error(`${param} cannot be empty or just blank spaces.`);
    str  = str.trim()
    str = str.toLowerCase(); 
    if(str.length === 0) throw new Error(`${param} cannot be empty or be just spaces.`);
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

const isValidEmployeeId =(employeeId)=> {
    const regex = /^HRC[A-Z]{2}[0-9]{4}$/;
    if(!(regex.test(employeeId)))throw new Error('Employee Id must be in format of HRC followed by 2 Uppercase Characters and ending with 4 digits. Eg: HRCNS0001 , HRCST0002');
    return employeeId
}

const numberRange = (num, param, low, high) => {
    if (num < low) {
        throw new Error(`${(param)} parameter with value ${num}, cannot be less than ${low}`)
    }
    if (num > high) {
        throw new Error(`${(param)} parameter with value ${num}, cannot be greater than ${high}`)
    }
}


$('#loginForm').submit((event)=>{
    let usernameStatus = false;
    let passwordStatus = false;
    $('#errorList li').remove();
    try{
        checkStr($('#username').val(),'Username',5,20,true);
        usernameStatus = true
        if($('#username').val().includes(' '))throw new Error('Username cannot contain spaces in between.');
        $('#username').removeClass('error');
        $('#labelUsername').removeClass('error');
    }catch(e){
        $('#username').addClass('error');
        $('#labelUsername').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#username').val('');
        event.preventDefault();
    }


    try{
        if(!$('#password').val())throw new Error('Password Needed.');
        passwordStatus = true;
        $('#password').removeClass('error');
        $('#labelPassword').removeClass('error');
    }catch(e){
        $('#password').addClass('error');
        $('#labelPassword').addClass('error');
        let li = `<li class='error'>${e.message}</li>`;
        $('#errorList').show();
        $('#errorList').append(li);
        $('#password').val('');
        event.preventDefault();
    } 
    if(usernameStatus && passwordStatus){
        $('#errorList').hide();
    }

});

$('#createUser-form').submit((event)=>{
    //firstName
    $('#errorList li').remove();
   try{
    checkStrCS($('#firstName').val(),'First Name',2,20,false,false);
    $('#firstName').removeClass('error');
    $('#labelFirstName').removeClass('error');
   }catch(e){
    $('#firstName').addClass('error');
    $('#labelFirstName').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#firstName').val('');
    event.preventDefault();
   }

   try{
    checkStrCS($('#lastName').val(),'Last Name',2,20,false,false);
    $('#lastName').removeClass('error');
    $('#labelLastName').removeClass('error');
   }catch(e){
    $('#lastName').addClass('error');
    $('#labelLastName').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#lastName').val('');
    event.preventDefault();
   }

   try{
    isValidEmployeeId($('#employeeId').val());
    $('#employeeId').removeClass('error');
    $('#labelEmployeeId').removeClass('error');
   }catch(e){
    $('#employeeId').addClass('error');
    $('#labelEmployeeId').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#employeeId').val('');
    event.preventDefault();
   }

   try{
    checkStrCS($('#username').val(),'Username',5,20,true,true);
    $('#username').removeClass('error');
    $('#labelUsername').removeClass('error');
   }catch(e){
    $('#username').addClass('error');
    $('#labelUsername').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#username').val('');
    event.preventDefault();
   }
   if($('#password').val() !== $('#confirmPassword').val()){
    $('#password').addClass('error');
    $('#labelPassword').addClass('error');
    $('#confirmPassword').addClass('error');
    $('#labelConfirmPassword').addClass('error');
    let li= `<li class='error'>Passwords do not match.</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    event.preventDefault();
   }else{
    $('#password').removeClass('error');
    $('#labelPassword').removeClass('error');
    $('#confirmPassword').removeClass('error');
    $('#labelConfirmPassword').removeClass('error');
   }

   try{
    checkPassConstraints($('#password').val(),8);
    $('#password').removeClass('error');
    $('#labelPassword').removeClass('error');
   }catch(e){
    $('#password').addClass('error');
    $('#labelPassword').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#password').val('');
    event.preventDefault();
   }

//    try{
//     checkState($('#gender').val(),'Gender',['male','female','other']);
//     $('#gender').removeClass('error');
//     $('#labelGender').removeClass('error');
//    }catch(e){
//     $('#gender').addClass('error');
//     $('#labelGender').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#gender').val('');
//     event.preventDefault();
//    }

//    try{
//     checkState($('#maritalStatus').val(),'Marital Status',['single','married','seperated','widowed','divorced']);
//     $('#maritalStatus').removeClass('error');
//     $('#labelMaritalStatus').removeClass('error');
//    }catch(e){
//     $('#maritalStatus').addClass('error');
//     $('#labelMaritalStatus').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#maritalStatus').val('');
//     event.preventDefault();
//    }

   try{
    checkState($('#department').val(),'Department',['Finance','IT','Human Resources','Adminstration','Research And Development','Customer Service']);
    $('#department').removeClass('error');
    $('#labelDepartment').removeClass('error');
   }catch(e){
    $('#department').addClass('error');
    $('#labelDepartment').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#department').val('');
    event.preventDefault();
   }

   try{
    checkState($('#role').val(),'Role',['Admin','HR','Employee']);
    $('#role').removeClass('error');
    $('#labelrole').removeClass('error');
   }catch(e){
    $('#role').addClass('error');
    $('#labelrole').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    $('#role').val('');
    event.preventDefault();
   }

//    try{
//     checkStr($('#disability').val(),'Disability',2,20,false);
//     $('#disability').removeClass('error');
//     $('#labelDisability').removeClass('error');
//    }catch(e){
//     $('#disability').addClass('error');
//     $('#labelDisability').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#disability').val('');
//     event.preventDefault();
//    }

//    try{
//     checkStr($('#race').val(),'Race',2,20,false);
//     $('#race').removeClass('error');
//     $('#labelRace').removeClass('error');
//    }catch(e){
//     $('#race').addClass('error');
//     $('#labelRace').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#race').val('');
//     event.preventDefault();
//    }

//    try{
//     checkStr($('#countryOfOrigin').val(),'Country Of Origin',2,20,false);
//     $('#countryOfOrigin').removeClass('error');
//     $('#labelCountryOfOrigin').removeClass('error');
//    }catch(e){
//     $('#countryOfOrigin').addClass('error');
//     $('#labelCountryOfOrigin').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#countryOfOrigin').val('');
//     event.preventDefault();
//    }

   try{
    check = dateFormat($('#startDate').val().trim(),'Start Date');
    let year = check[0];
    let month = check[1];
    let date = check[2];
    isValidDate(month, date, year,'Start Date',true);
    if(isDateBeforeToday($('#startDate').val().toString()))throw new Error("Start Date Cannot be in past.");
    $('#startDate').removeClass('error');
    $('#labelStartDate').removeClass('error');
   }catch(e){
    $('#startDate').addClass('error');
    $('#labelStartDate').addClass('error');
    let li= `<li class='error'>${e.message}</li>`;
    $('#errorList').append(li);
    $('#errorList').show();
    event.preventDefault();
   } 

//    try{
//     check = dateFormat($('#dob').val().trim(),'Date Of Birth');
//     let year = check[0];
//     let month = check[1];
//     let date = check[2];
//     isValidDate(month, date, year);
//     $('#dob').removeClass('error');
//     $('#labelDob').removeClass('error');
//    }catch(e){
//     $('#dob').addClass('error');
//     $('#labelDob').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     event.preventDefault();
//    } 

//    try{
//     checkStr($('#currentPosition').val(),'Current Position',2,20,false);
//     $('#currentPosition').removeClass('error');
//     $('#labelCurrentPosition').removeClass('error');
//    }catch(e){
//     $('#currentPosition').addClass('error');
//     $('#labelCurrentPosition').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#currentPosition').val('');
//     event.preventDefault();
//    }

//    try{
//     check = parseInt($('#currentSalary').val());
//     numberExistandType(check, `Current Salary`);
//     $('#currentSalary').removeClass('error');
//     $('#labelCurrentSalary').removeClass('error');
//    }catch(e){
//     $('#currentSalary').addClass('error');
//     $('#labelCurrentSalary').addClass('error');
//     let li= `<li class='error'>${e.message}</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     $('#currentSalary').val('');
//     event.preventDefault();
//    }
   
//    if($('#dob').val() > $('#startDate').val()){
//     $('#dob').addClass('error');
//     $('#labelDob').addClass('error');
//     let li= `<li class='error'>Start Date cannot be before DOB.</li>`;
//     $('#errorList').append(li);
//     $('#errorList').show();
//     event.preventDefault();
//    }
   
   
    // try{
    //     isValidPhoneNumber($('#phone').val());
    //     $('#phone').removeClass('error');
    //     $('#labelPhone').removeClass('error');
    // }catch(e){
    //     $('#phone').addClass('error');
    //     $('#labelPhone').addClass('error');
    //     let li= `<li class ='error'>${e.message}</li>`;
    //     $('#errorList').append(li);
    //     $('#errorList').show();
    //     event.preventDefault();
    // }

    try{
        isValidEmail($('#email').val());
        $('#email').removeClass('error');
        $('#labelEmail').removeClass('error');
    }catch(e){
        $('#email').addClass('error');
        $('#labelEmail').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }

    try{
        isValidEmail($('#personalEmail').val());
        $('#personalEmail').removeClass('error');
        $('#labelPersonalEmail').removeClass('error');
    }catch(e){
        $('#personalEmail').addClass('error');
        $('#labelPersonalEmail').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }


    // try{
    //     checkStr($('#primaryAddress').val(),'Primary Address',5,200,true);
    //     $('#primaryAddress').removeClass('error');
    //     $('#labelPrimaryAddress').removeClass('error');
    // }
    // catch(e){
    //     $('#primaryAddress').addClass('error');
    //     $('#labelPrimaryAddress').addClass('error');
    //     let li= `<li class ='error'>${e.message}</li>`;
    //     $('#errorList').append(li);
    //     $('#errorList').show();
    //     event.preventDefault();
    // }
    // try{
    //     checkStr($('#secondaryAddress').val(),'Secondary Address',5,200,true);
    //     $('#secondaryAddress').removeClass('error');
    //     $('#labelSecondaryAddress').removeClass('error');
    // }
    // catch(e){
    //     $('#secondaryAddress').addClass('error');
    //     $('#labelSecondaryAddress').addClass('error');
    //     let li= `<li class ='error'>${e.message}</li>`;
    //     $('#errorList').append(li);
    //     $('#errorList').show();
    //     event.preventDefault();
    // }

});

$('#updateUser').submit((event)=>{
    $('#errorList li').remove();
    try{
        checkStrCS($('#firstName').val(),'First Name',2,20,false,false);
        $('#firstName').removeClass('error');
        $('#labelFirstName').removeClass('error');
       }catch(e){
        $('#firstName').addClass('error');
        $('#labelFirstName').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#firstName').val('');
        event.preventDefault();
       }
    
       try{
        checkStrCS($('#lastName').val(),'Last Name',2,20,false,false);
        $('#lastName').removeClass('error');
        $('#labelLastName').removeClass('error');
       }catch(e){
        $('#lastName').addClass('error');
        $('#labelLastName').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#lastName').val('');
        event.preventDefault();
       }
    
       try{
        isValidEmployeeId($('#employeeId').val());
        $('#employeeId').removeClass('error');
        $('#labelEmployeeId').removeClass('error');
       }catch(e){
        $('#employeeId').addClass('error');
        $('#labelEmployeeId').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#employeeId').val('');
        event.preventDefault();
       }
    
       try{
        checkStrCS($('#username').val(),'Username',5,20,true,true);
        $('#username').removeClass('error');
        $('#labelUsername').removeClass('error');
       }catch(e){
        $('#username').addClass('error');
        $('#labelUsername').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#username').val('');
        event.preventDefault();
       }

       try{
        checkState($('#department').val(),'Department',['Finance','IT','Human Resources','Adminstration','Research And Development','Customer Service']);
        $('#department').removeClass('error');
        $('#labelDepartment').removeClass('error');
       }catch(e){
        $('#department').addClass('error');
        $('#labelDepartment').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#department').val('');
        event.preventDefault();
       }
    
       try{
        checkState($('#role').val(),'Role',['Admin','HR','Employee']);
        $('#role').removeClass('error');
        $('#labelrole').removeClass('error');
       }catch(e){
        $('#role').addClass('error');
        $('#labelrole').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#role').val('');
        event.preventDefault();
       }

       try{
        if(!($('#isManager').val().toString() ==='true' || $('#isManager').val().toString() === 'false' ))throw new Error('Is Manager should be boolean value.')
       }catch(e){
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
       }

       try{
        check = dateFormat($('#startDate').val().trim(),'Start Date');
        let year = check[0];
        let month = check[1];
        let date = check[2];
        isValidDate(month, date, year,'Start Date',true);
        $('#startDate').removeClass('error');
        $('#labelStartDate').removeClass('error');
       }catch(e){
        $('#startDate').addClass('error');
        $('#labelStartDate').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
       } 

       try{
        checkStr($('#currentPosition').val(),'Current Position',2,20,false);
        $('#currentPosition').removeClass('error');
        $('#labelCurrentPosition').removeClass('error');
       }catch(e){
        $('#currentPosition').addClass('error');
        $('#labelCurrentPosition').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#currentPosition').val('');
        event.preventDefault();
       }
    
       try{
        check = parseInt($('#currentSalary').val());
        numberExistandType(check, `Current Salary`, false, 2);
        numberRange(check,'Current Salary',15.13,200);
        $('#currentSalary').removeClass('error');
        $('#labelCurrentSalary').removeClass('error');
       }catch(e){
        $('#currentSalary').addClass('error');
        $('#labelCurrentSalary').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#currentSalary').val('');
        event.preventDefault();
       }
       
       try{
        isValidEmail($('#email').val());
        $('#email').removeClass('error');
        $('#labelEmail').removeClass('error');
    }catch(e){
        $('#email').addClass('error');
        $('#labelEmail').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }
})

$('#editForm').submit((event)=>{
    $('#errorList li').remove();
    try{
        checkStrCS($('#firstName').val(),'First Name',2,20,false,false);
        $('#firstName').removeClass('error');
        $('#labelFirstName').removeClass('error');
       }catch(e){
        $('#firstName').addClass('error');
        $('#labelFirstName').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#firstName').val('');
        event.preventDefault();
       }
    
    try{
     checkStrCS($('#lastName').val(),'Last Name',2,20,false,false);
     $('#lastName').removeClass('error');
     $('#labelLastName').removeClass('error');
    }catch(e){
     $('#lastName').addClass('error');
     $('#labelLastName').addClass('error');
     let li= `<li class='error'>${e.message}</li>`;
     $('#errorList').append(li);
     $('#errorList').show();
     $('#lastName').val('');
     event.preventDefault();
    }

    try{
         checkState($('#gender').val(),'Gender',['Male','Female','Other','Rather Not Say']);
         $('#gender').removeClass('error');
         $('#labelGender').removeClass('error');
        }catch(e){
         $('#gender').addClass('error');
         $('#labelGender').addClass('error');
         let li= `<li class='error'>${e.message}</li>`;
         $('#errorList').append(li);
         $('#errorList').show();
         $('#gender').val('');
         event.preventDefault();
        }
        
        try{
            checkState($('#vet').val(),'Veteran',['I self identify as a Veteran','Do not wish to identify','Not a Veteran']);
            $('#vet').removeClass('error');
            $('#labelVet').removeClass('error');
           }catch(e){
            $('#vet').addClass('error');
            $('#labelVet').addClass('error');
            let li= `<li class='error'>${e.message}</li>`;
            $('#errorList').append(li);
            $('#errorList').show();
            event.preventDefault();
           }

           try{
            checkState($('#maritalStatus').val(),'Marital Status',['Single','Married','Seperated','Widowed','Divorced','Rather Not Say']);
            $('#maritalStatus').removeClass('error');
            $('#labelMaritalStatus').removeClass('error');
           }catch(e){
            $('#maritalStatus').addClass('error');
            $('#labelMaritalStatus').addClass('error');
            let li= `<li class='error'>${e.message}</li>`;
            $('#errorList').append(li);
            $('#errorList').show();
            $('#maritalStatus').val('');
            event.preventDefault();
           }

           try{
                checkState($('#disability').val(),'Disability',['Yes','No','Rather Not Say']);
                $('#disability').removeClass('error');
                $('#labelDisability').removeClass('error');
               }catch(e){
                $('#disability').addClass('error');
                $('#labelDisability').addClass('error');
                let li= `<li class='error'>${e.message}</li>`;
                $('#errorList').append(li);
                $('#errorList').show();
                event.preventDefault();
               } 
               
         try{
            checkState($('#race').val(),'Race',['African', 'Asian', 'European', 'Native American', 'Pacific Islander', 'Middle Eastern', 'Indigenous Australian', 'South Asian', 'East Asian', 'Hispanic/Latino', 'Arab', 'Polynesian', 'Melanesian', 'Indigenous Siberian', 'Maori', 'Inuit', 'Romani', 'Berber', 'Jewish', 'Afro-Latino','Rather Not Say']);
            $('#race').removeClass('error');
            $('#labelRace').removeClass('error');
        }catch(e){
            $('#race').addClass('error');
            $('#labelRace').addClass('error');
            let li= `<li class='error'>${e.message}</li>`;
            $('#errorList').append(li);
            $('#errorList').show();
            $('#race').val('');
            event.preventDefault();
        }

     try{
      checkState($('#countryOfOrigin').val(),'Country Of Origin',[
        "Moldova", "United States", "Mayotte", "Nauru", "Mozambique", "Brazil", "Cape Verde", "Equatorial Guinea", "Albania", "United States Virgin Islands",
        "Niue", "Palau", "Nigeria", "British Virgin Islands", "Gambia", "Somalia", "Yemen", "Malaysia", "Dominica", "United Kingdom", "Madagascar",
        "Western Sahara", "Cyprus", "Antigua and Barbuda", "Ireland", "Paraguay", "Sri Lanka", "South Africa", "Kuwait", "Algeria", "Croatia", "Martinique",
        "Sierra Leone", "Northern Mariana Islands", "Rwanda", "Syria", "Saint Vincent and the Grenadines", "Kosovo", "Saint Lucia", "Honduras", "Jordan",
        "Tuvalu", "Nepal", "Liberia", "Heard Island and McDonald Islands", "Austria", "Guernsey", "Central African Republic", "Mauritania", "Djibouti",
        "Fiji", "Norway", "Latvia", "Falkland Islands", "Kazakhstan", "Åland Islands", "Turkmenistan", "Cocos (Keeling) Islands", "Bulgaria", "Tokelau",
        "New Caledonia", "Barbados", "São Tomé and Príncipe", "Antarctica", "Brunei", "Bhutan", "Cameroon", "Argentina", "Azerbaijan", "Mexico", "Morocco",
        "Guatemala", "Kenya", "Malta", "Czechia", "Gibraltar", "Aruba", "Saint Barthélemy", "Monaco", "United Arab Emirates", "South Sudan", "Puerto Rico",
        "El Salvador", "France", "Niger", "Ivory Coast", "South Georgia", "Botswana", "British Indian Ocean Territory", "Uzbekistan", "Tunisia", "Hong Kong",
        "North Macedonia", "Suriname", "Belgium", "American Samoa", "Solomon Islands", "Ukraine", "Finland", "Burkina Faso", "Bosnia and Herzegovina", "Iran",
        "Cuba", "Eritrea", "Slovakia", "Lithuania", "Saint Martin", "Pitcairn Islands", "Guinea-Bissau", "Montserrat", "Turkey", "Philippines", "Vanuatu",
        "Bolivia", "Saint Kitts and Nevis", "Romania", "Cambodia", "Zimbabwe", "Jersey", "Kyrgyzstan", "Caribbean Netherlands", "Guyana",
        "United States Minor Outlying Islands", "Armenia", "Lebanon", "Montenegro", "Greenland", "Papua New Guinea", "Zambia", "Trinidad and Tobago",
        "French Southern and Antarctic Lands", "Peru", "Sweden", "Sudan", "Saint Pierre and Miquelon", "Oman", "India", "Taiwan", "Mongolia", "Senegal",
        "Tanzania", "Canada", "Costa Rica", "China", "Colombia", "Myanmar", "Russia", "North Korea", "Cayman Islands", "Bouvet Island", "Belarus",
        "Portugal", "Eswatini", "Poland", "Switzerland", "Republic of the Congo", "Venezuela", "Panama", "Netherlands", "Samoa", "Denmark", "Luxembourg",
        "Faroe Islands", "Slovenia", "Togo", "Thailand", "Wallis and Futuna", "Bahamas", "Tonga", "Greece", "San Marino", "Réunion", "Vatican City",
        "Burundi", "Bahrain", "Marshall Islands", "Turks and Caicos Islands", "Isle of Man", "Haiti", "Afghanistan", "Israel", "Libya", "Uruguay",
        "Norfolk Island", "Nicaragua", "Cook Islands", "Laos", "Christmas Island", "Saint Helena, Ascension and Tristan da Cunha", "Anguilla",
        "Micronesia", "Germany", "Guam", "Kiribati", "Sint Maarten", "Spain", "Jamaica", "Palestine", "French Guiana", "Andorra", "Chile", "Lesotho",
        "Australia", "Grenada", "Ghana", "Seychelles", "Angola", "Bermuda", "Pakistan", "Mali", "Saudi Arabia", "Curaçao", "South Korea", "Ethiopia",
        "Guadeloupe", "Bangladesh", "New Zealand", "Comoros", "Belize", "Uganda", "Singapore", "Liechtenstein", "Hungary", "Iceland", "Tajikistan",
        "Namibia", "Timor-Leste", "Egypt", "Serbia", "Mauritius", "Macau", "French Polynesia", "Maldives", "Indonesia", "DR Congo", "Estonia", "Vietnam",
        "Italy", "Guinea", "Chad", "Ecuador", "Georgia", "Malawi", "Iraq", "Svalbard and Jan Mayen", "Benin", "Japan", "Dominican Republic", "Qatar",
        "Gabon",
    ]);
      $('#countryOfOrigin').removeClass('error');
      $('#labelCountryOfOrigin').removeClass('error');
     }catch(e){
      $('#countryOfOrigin').addClass('error');
      $('#labelCountryOfOrigin').addClass('error');
      let li= `<li class='error'>${e.message}</li>`;
      $('#errorList').append(li);
      $('#errorList').show();
      event.preventDefault();
     }

     try{
        if(!$('#dob').val())throw new Error('Date Of Birth Needed.');
        let dob = new Date($('#dob').val())
        let startDate = new Date($('#startDate').val())
        if(startDate <= dob)throw new Error('Date of Birth cannot be After Start Date.');
        checkAgeOver18($('#dob').val());
        $('#labelDob').removeClass('error');
        $('#dob').removeClass('error');
     }catch(e){
      $('#dob').addClass('error');
      $('#labelDob').addClass('error');
      let li= `<li class='error'>${e.message}</li>`;
      $('#errorList').append(li);
      $('#errorList').show();
      $('#dob').val('');
      event.preventDefault();
     }

     try{
        isValidPhoneNumber($('#phone').val());
        $('#phone').removeClass('error');
        $('#LabelPhone').removeClass('error');
     }
     catch(e){
        $('#phone').addClass('error');
        $('#labelPhone').addClass('error');
        let li= `<li class='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        $('#phone').val('');
        event.preventDefault();
     }

     try{
        isValidEmail($('#personalEmail').val());
        $('#personalEmail').removeClass('error');
        $('#labelPersonalEmail').removeClass('error');
    }catch(e){
        $('#personalEmail').addClass('error');
        $('#labelPersonalEmail').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }  
    try{
        checkStr($('#primaryAddress').val(),'Primary Address',5,200,true);
        $('#primaryAddress').removeClass('error');
        $('#labelPrimaryAddress').removeClass('error');
    }
    catch(e){
        $('#primaryAddress').addClass('error');
        $('#labelPrimaryAddress').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }
    try{
        checkStr($('#secondaryAddress').val(),'Secondary Address',5,200,true);
        $('#secondaryAddress').removeClass('error');
        $('#labelSecondaryAddress').removeClass('error');
    }
    catch(e){
        $('#secondaryAddress').addClass('error');
        $('#labelSecondaryAddress').addClass('error');
        let li= `<li class ='error'>${e.message}</li>`;
        $('#errorList').append(li);
        $('#errorList').show();
        event.preventDefault();
    }


})