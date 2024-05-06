import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';
import salary from '../data/salary.js';
import board from '../data/board.js';
import login from '../data/login.js';
import { ObjectId } from 'mongodb';
import xss from 'xss';
import doc from '../data/documents.js'
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router
    .route('/')
    .get(async (req, res) => {

        try {
            let status = req.session.user.status;
            let msg;
            if (status !== 'Active' && status.startsWith('Onboarding')) {
                msg = `Please complete your profile and/or boarding tasks.`;
            } else if (status !== 'Active' && status.startsWith('Offboarding')) {
                msg = `Please complete your off boarding tasks.`;
            }
            return res.render('./users/employee', { title: 'Employee', firstName: req.session.user.firstName, role: req.session.user.role, employeeId: req.session.user.employeeId, isAdmin: (req.session.user.role === 'Admin') ? true : false, isHR: (req.session.user.role === 'HR') ? true : false, msg: msg, isLoggedIn: true, isNotActive: (status !== 'Active') ? true : false });
        } catch (e) {
            return res.json('Not yet Set Up');
        }
    });

router
    .route('/profile')
    .get(async(req,res)=>{
        try{
            let userData = req.session.user;
            return res.render('profile',{title:'My Profile',...userData,isLoggedIn:true});
            
        }catch(e){
            return res.status(500).json(e.message)
        }
    })
    router
    .route('/profile/changepass')
    .get(async(req,res)=>{
        try{
            return res.render('./data_functions/changePass',{title:'Change Password',currentPass:'',newPass:'hidden',errorList:'hidden'});
        }catch(e){
            return res.status(500).json(e.message);
        }
    })
    .post(async (req,res)=>{
        try{
           if(req.body.password){ 
            let credentialsCheck = await login.getUsernameAndValidate(req.session.user.username,req.body.password)
            credentialsCheck;
            return res.render('./data_functions/changePass',{title:'Set New Pass',currentPass:'hidden',newPass:'',errorList:'hidden'})}

            if(req.body.newPass){
                if(req.body.newPass !== req.body.confirmNewPass)throw new Error("Passwords Don't match");
                let setNewPass = await userTest.changePass(req.session.user.employeeId,req.body.newPass);

                if(setNewPass === true){
                    req.session.destroy();
                    return res.render('changePassLogout');
                    
                    
                }else{
                    return res.json("Error: Could Not Update Password.");
                }
            }
        }catch(e){
           if(e.message === "Passwords Don't match"){
            return res.status(400).render('./data_functions/changePass',{title:'Set New Pass',currentPass:'hidden',newPass:'',errorList:'',message:e.message})
           }
           if(e.message ==="New Password cannot be same as the old one."){
            return res.status(400).render('./data_functions/changePass',{title:'Set New Pass',currentPass:'hidden',newPass:'',errorList:'',message:e.message});
           }
            return res.status(400).render('./data_functions/changePass',{title:'Change Password',message:'Incorrect Password.',newPass:'hidden',errorList:'',message:"Incorrect Password. Damn How did you login in the First Place??"})
        }
    })

    router
    .route('/profile/edit')
    .get(async(req,res)=>{
        let userData = req.session.user;
        return res.render('editProfile',{title:'Edit Profile',...userData,isLoggedIn:true}) 
    })
    .post(async (req,res)=>{
       
        try{
            //validation
            let patchData = req.body
                patchData = validation.checkTypeUserEmployee(patchData);
        }catch(e){
            let existingData =req.session.user// await userTest.getUserById(req.session.user.employeeId);
            let userData = req.body;
            userData.contactInfo = {};
            userData.contactInfo.email= userData.email;
            userData.contactInfo.phone=userData.phone;
            userData.contactInfo.personalEmail=userData.personalEmail
            userData.contactInfo.primaryAddress=userData.primaryAddress;
            userData.contactInfo.secondaryAddress=userData.secondaryAddress;
            return res.status(400).render('editProfile',{title:'Edit Profile',...userData,hidden:'',message:e.message,employeeId:existingData.employeeId,firstName:userData.firstName,lastName:userData.lastName,vet:userData.vet,disability:userData.disability,race:userData.race,countryOfOrigin:userData.countryOfOrigin,phone:userData.phone,currentPosition:existingData.currentPosition, currentSalary: existingData.currentSalary,startDate:existingData.startDate,username:existingData.username,department:existingData.department,role:existingData.role,status:existingData.status,contactInfo:userData.contactInfo,isLoggedIn:true});
        }

        try{
           let patchData = req.body
           let patchedInfo = await board.patchEmployeeData(patchData);
           req.session.user = patchedInfo;
           return res.redirect('/hrc/employee/profile');

        }catch(e){
            let existingData =req.session.user// await userTest.getUserById(req.session.user.employeeId);
            let userData = req.body;
            userData.contactInfo = {};
            userData.contactInfo.email= userData.email;
            userData.contactInfo.phone=userData.phone;
            userData.contactInfo.personalEmail=userData.personalEmail
            userData.contactInfo.primaryAddress=userData.primaryAddress;
            userData.contactInfo.secondaryAddress=userData.secondaryAddress;
            return res.status(400).render('editProfile',{title:'Edit Profile',...userData,hidden:'',message:e.message,employeeId:existingData.employeeId,firstName:userData.firstName,lastName:userData.lastName,vet:userData.vet,disability:userData.disability,race:userData.race,countryOfOrigin:userData.countryOfOrigin,phone:userData.phone,currentPosition:existingData.currentPosition, currentSalary: existingData.currentSalary,startDate:existingData.startDate,username:existingData.username,department:existingData.department,role:existingData.role,status:existingData.status,contactInfo:userData.contactInfo,isLoggedIn:true});
        }

    });
    router
    .route('/getAllByEmpId')
    .get(async (req, res) => {
        try {
            let employeeId = req.session.user.employeeId;
            const boardUserData = await board.getboardingDataByEmpId(employeeId);
            let taskList = [];
            let msg;
            if (boardUserData) {
                let boardUsrData = [];
                boardUsrData.push(boardUserData);
                let res = await validation.getTaskList(boardUsrData, taskList, msg, false, false, true);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            } else {
                msg = `No tasks assigned.`;
            }
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: true, taskTypeList: 'Task List' ,isLoggedIn:true});
            // return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

    router
    .route('/getAllNotesByEmpId')
    .get(async (req, res) => {
        console.log("hi")
        if (!req.session.user || !req.session.user.employeeId) {
            return res.status(401).json({ message: "Unauthorized access: No employee ID found in session" });
        }

        const employeeId = req.session.user.employeeId;

        try {
            const notes = await userTest.getNotesByEmployeeId(employeeId); 
            console.log('after')
            if (notes.length === 0) {
                return res.render('displaynotes', { 
                    employeeId: employeeId,
                    noNotes: true, 
                    message: "No notes available for you"
                });
            } else {
                return res.render('displaynotes', { 
                    employeeId: employeeId,
                    notes: notes
                });
            }
        } catch (e) {
            console.error("Error fetching notes:", e);
            return res.status(500).json({ message: e.message });
        }
    });

router
    .route('/getAllToDoByEmpId')
    .get(async (req, res) => {
        try {
            let employeeId = req.session.user.employeeId;
            const boardUserData = await board.getboardingDataByEmpId(employeeId);
            let taskList = [];
            let msg;
            if (boardUserData) {
                let boardUsrData = [];
                boardUsrData.push(boardUserData);
                let isOnboard = true;
                let status = req.session.user.status;
                if (status.startsWith('Onboarding')) {
                    isOnboard = true;
                } else if (status.startsWith('Offboarding')) {
                    isOnboard = false;
                }
                let res = await validation.getTaskList(boardUsrData, taskList, msg, true, isOnboard, false);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            } else {
                msg = `No tasks assigned.`;
            }
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: false, isEmp: true, taskTypeList: 'To-Do Task List', isLoggedIn: true });
            // return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

router.route('/fillForm/:employeeId/:taskId/:type')
    .get(async (req, res) => {
        let employeeId;
        let taskId;
        let type;
        try {
            employeeId = validation.isValidEmployeeId(req.params.employeeId);
            if(ObjectId.isValid(req.params.taskId)){
                taskId = req.params.taskId;
            }
            type = validation.checkStrCS(req.params.type, 'Type');
        } catch (error) {
            return res.status(400).json(error.message).render('error', { title: 'Error',
            class: 'error-class',
            message: error.message,
            previous_Route: '/hrc/login',
            linkMessage: 'Go back' });
        }
        try {
            if (type === 'form') {
                console.log('fillSalaryForm', { employeeId: employeeId, taskId: taskId})
                return res.render('./data_functions/fillSalaryForm', { title: 'Salary Form', employeeId: employeeId, taskId: taskId});
            } else{
                if(type === 'select'){
                    return res.render('./data_functions/selectBenifitsForm', { title: 'Select Form', employeeId: employeeId, taskId: taskId});
                } else {
                    return res.status(404).json('Task Not Found');
                }
            }
        } catch (e) {
            return res.status(500).json(e.message);
        }
    })

router.route('/fillSalaryForm')
    .post(async (req, res) => {
        let employeeId
        let taskId
        let ssn
        let accountNo
        let routingNo
        let billingAddress
        let paymentType
        try {
            let salaryData = req.body;
            employeeId = validation.isValidEmployeeId(salaryData.employeeId);
            if(ObjectId.isValid(salaryData.taskId)){
                taskId = salaryData.taskId;
            }
            salaryData.ssn = validation.checkStrCS(salaryData.ssn, 'SSN', 9, 9, true);
            ssn = validation.numberExistandType(Number(salaryData.ssn));
            salaryData.accountNo = validation.checkStrCS(salaryData.accountNo, 'Account Number', 8, 12, true);
            accountNo = validation.numberExistandType(Number(salaryData.accountNo));
            salaryData.routingNo = validation.checkStrCS(salaryData.routingNo, 'Routing Number', 9, 9, true);
            routingNo = validation.numberExistandType(Number(salaryData.routingNo));
            salaryData.billingAddress = validation.checkStrCS(salaryData.billingAddress, 'Billing Address', 10, 100, true);
            billingAddress = validation.checkStrCS(salaryData.billingAddress, 'Billing Address', 10, 100, true);
            if(salaryData.paymentType === 'direct deposit' || salaryData.paymentType === 'check'){
                paymentType = salaryData.paymentType;
            } else {
                throw new Error('Invalid Payment Type');
            }
        } catch (error) {
            return res.status(400).render('error', { title: 'Error',
            class: 'error-class',
            message: error.message,
            previous_Route: '/hrc/login',
            linkMessage: 'Go back home' });
        }
        try {
            let hourlyPay = req.session.user.currentSalary
            let position = req.session.user.currentPosition
            let salaryData = {
                hourlyPay: hourlyPay,
                position: position,
                employeeId: employeeId,
                ssn: ssn,
                accountNo: accountNo,
                routingNo: routingNo,
                paymentType: paymentType,
                billingAddress: billingAddress
            }
            let salaryInfo = await salary.createSalary(employeeId, salaryData);
            if (salaryInfo) {

                let empData = await board.updatePatchBoardingCompleteTask(employeeId, req.body.taskId, 'Onboard', req.session.user.status, req.session.user.countryOfOrigin);
                if (empData) {
                    req.session.user = empData;
                }
                return res.redirect('/hrc/employee/getAllToDoByEmpId');
            }
        } catch (error) {
            return res.status(500).render('error', { title: 'Error',
            class: 'error-class',
            message: error.message,
            previous_Route: '/hrc/login',
            linkMessage: 'Go back home' });
        }
})

router.route('/selectBenifitsForm')
    .post(async (req, res) => {
        let employeeId;
        let taskId;
        let benefitOption;
        let beneficiaries=[];
        try {
            let benifitsData = req.body;
            employeeId = xss(validation.isValidEmployeeId(benifitsData.employeeId));
            if(ObjectId.isValid(benifitsData.taskId)){
                taskId = benifitsData.taskId;
            }
            benefitOption = xss(validation.checkStrCS(benifitsData.benefitOption, 'Benefit Option', 1, 100, true));
            if(benefitOption !== 'optInSelf' && benefitOption !== 'optOut' && benefitOption !== 'optInFamily' && benefitOption !== 'optInPartner'){
                throw new Error('Invalid Benefit Option');
            }
            if(benefitOption === 'optInSelf'){
                beneficiaries.push({benefeciary_name: req.session.user.firstName + ' ' + req.session.user.lastName,
                    benefeciary_relation: 'Self',
                    benefeciary_dob: req.session.user.dob,
                    benefeciary_address: req.session.user.contactInfo.primaryAddress,
                    benefeciary_email: req.session.user.contactInfo.email,
                    benefeciary_phone: req.session.user.contactInfo.phone});
            }
            if(benefitOption === 'optInPartner'){
                beneficiaries.push({benefeciary_name: req.session.user.firstName + ' ' + req.session.user.lastName,
                    benefeciary_relation: 'Self',
                    benefeciary_dob: req.session.user.dob,
                    benefeciary_address: req.session.user.contactInfo.primaryAddress,
                    benefeciary_email: req.session.user.contactInfo.email,
                    benefeciary_phone: req.session.user.contactInfo.phone});
                    let year = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[0];
                    let month = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[1];
                    let day = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[2];
                    validation.isValidDate(month, day, year, 'benefeciary_dob', false);
                beneficiaries.push({benefeciary_name: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_name), 'Beneficiary Name', 1, 100, false),
                    benefeciary_relation: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_relation), 'Beneficiary Relation', 1, 100, false),
                    benefeciary_dob: xss(benifitsData.beneficiaries[0].benefeciary_dob),
                    benefeciary_address: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_address), 'Beneficiary Address', 1, 100, true),
                    benefeciary_email: validation.isValidEmail(xss(benifitsData.beneficiaries[0].benefeciary_email)),
                    benefeciary_phone: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_phone), 'Beneficiary Phone', 1, 100, true)});
            }
            if(benefitOption === 'optInFamily'){
                beneficiaries.push({benefeciary_name: req.session.user.firstName + ' ' + req.session.user.lastName,
                    benefeciary_relation: 'Self',
                    benefeciary_dob: req.session.user.dob,
                    benefeciary_address: req.session.user.contactInfo.primaryAddress,
                    benefeciary_email: req.session.user.contactInfo.email,
                    benefeciary_phone: req.session.user.contactInfo.phone});
                for(let i=0; i<benifitsData.beneficiaries.length; i++){
                    let year = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[0];
                    let month = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[1];
                    let day = benifitsData.beneficiaries[0].benefeciary_dob.split('-')[2];
                    validation.isValidDate(month, day, year, 'benefeciary_dob', false);
                beneficiaries.push({benefeciary_name: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_name), 'Beneficiary Name', 1, 100, false),
                    benefeciary_relation: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_relation), 'Beneficiary Relation', 1, 100, false),
                    benefeciary_dob: xss(benifitsData.beneficiaries[0].benefeciary_dob),
                    benefeciary_address: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_address), 'Beneficiary Address', 1, 100, true),
                    benefeciary_email: validation.isValidEmail(xss(benifitsData.beneficiaries[0].benefeciary_email)),
                    benefeciary_phone: validation.checkStrCS(xss(benifitsData.beneficiaries[0].benefeciary_phone), 'Beneficiary Phone', 1, 100, true)});
                }
            }
            console.log(beneficiaries);
        } catch (e) {
            return res.status(400).render('error', { title: 'Error',
            class: 'error-class',
            message: e.message,
            previous_Route: '/hrc/login',
            linkMessage: 'Go back home' });
        }
        try{
            if(benefitOption==='optOut'){
                let benefitData = await salary.optOutBenefits(employeeId);
                if (benefitData) {
                    let empData = await board.updatePatchBoardingCompleteTask(employeeId, taskId, 'Onboard', req.session.user.status, req.session.user.countryOfOrigin);
                    if (empData) {
                        req.session.user = empData;
                    }
                    res.json ({ success: true });
                }
                else{
                    throw new Error('Could not Opt Out');
                }
            }
            else{
                let benefitData = await salary.createBenefits(employeeId, benefitOption, beneficiaries);
                if (benefitData) {
                    let empData = await board.updatePatchBoardingCompleteTask(employeeId, taskId, 'Onboard', req.session.user.status, req.session.user.countryOfOrigin);
                    if (empData) {
                        req.session.user = empData;
                    }
                    res.json ({ success: true });
                }
                else{
                    throw new Error('Could not create Benefits');
                }
            }
        }catch(e){
            return res.status(500).render('error', { title: 'Error',
            class: 'error-class',
            message: e.message,
            previous_Route: '/hrc/login',
            linkMessage: 'Go back home' });
        }
})

router
    .route('/completeTask/:employeeId/:taskId/:taskType')
    .patch(async (req, res) => {
        try {
            if (!req.params.employeeId || req.params.employeeId.trim() === '' || !req.params.taskId || req.params.taskId.trim() === ''
                || !req.params.taskType || req.params.taskType.trim() === '') {
                res.status(400)
                //res.render('home', { hasError400Id: true });
                return;
            }
        } catch (e) {
            return res.status(400).json({ error: e });
        }

        try {
            let empData = await board.updatePatchBoardingCompleteTask(req.params.employeeId, req.params.taskId, req.params.taskType, req.session.user.status, req.session.user.countryOfOrigin);
            if (empData) {
                req.session.user = empData;
            }
            return res.redirect('/hrc/employee/getAllToDoByEmpId');
            //return res.json(patchedInfo);
        } catch (e) {
            return res.status(404).json(e.message);
        }

    });

router
    .route('/resign')
    .get(async (req, res) => {
        try {
            let employeeId = req.session.user.employeeId;
            let empData = await userTest.getUserById(employeeId);
            return res.render('./data_functions/resign', { title: 'Emloyee Resignation', firstName: empData.firstName, lastName: empData.lastName, username: empData.username, employeeId: empData.employeeId });
        } catch (e) {
            return res.status(400).json({ error: e });
        }
    })
    .post(async (req, res) => {
        try {
            let data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res
                    .status(400)
                    .json({ error: 'There are no fields in the request body' });
            }
            let employeeId = xss(data.employeeId);
            let resignReason = xss(data.resignReason);

            let empData = await userTest.getUserByIdWithPass(employeeId);
            empData.status = 'Offboarding';
            empData.resignedOn = validation.getCurrDate();
            empData.resignReason = resignReason;
            let patchedInfo = await userTest.updateUserStatus(empData);
            empData = await userTest.getUserById(employeeId);
            req.session.user = empData;
            let status = req.session.user.status;
            let msg;
            if (status !== 'Active' && status.startsWith('Offboarding')) {
                msg = `Please complete your off boarding tasks.`;
            }
            return res.render('./users/employee', { title: 'Employee', firstName: req.session.user.firstName, role: req.session.user.role, employeeId: req.session.user.employeeId, isAdmin: (req.session.user.role === 'Admin') ? true : false, isHR: (req.session.user.role === 'HR') ? true : false, msg: msg, isLoggedIn: true, isNotActive: (status !== 'Active' && status.startsWith('Offboarding')) ? true : false });

        } catch (e) {
            return res.status(400).json({ error: e });
        }
    });
    
    router
    .route('/uploadDocs/:taskId?')
    .get(async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        
        try {
            const documentsData = await doc.getDocumentsByEmployeeId(req.session.user.employeeId);
            return res.render('uploadDocs', {
                title: 'Upload Document',
                isLoggedIn: true,
                documents: documentsData.documents,
                noDocuments: documentsData.documents.length === 0,
                taskId: req.params.taskId
            });
        } catch (error) {
            console.error("Error fetching documents:", error);
            return res.status(500).render('uploadDocs', {
                title: 'Upload Document',
                message: 'Failed to fetch documents',
                isLoggedIn: true,
            });
        }
    })
    .post(upload.single('file'), async (req, res) => {
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        
        if (!req.file) {
            return res.status(400).render('uploadDocs', {
                title: 'Upload Document',
                message: 'No file provided',
                isLoggedIn: true
            });
        }

        const taskId = req.params.taskId; 
        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const documentInfo = {
            empId: req.session.user.employeeId,
            typeOfDoc: req.body.typeOfDoc,
            status: "Pending",
            approvedby: null
        };
        try {
            const result = await doc.createDocument(documentInfo, fileBuffer, fileName, taskId);
            if (result && taskId) { 
                await doc.markTaskAsCompleted(req.session.user.employeeId,taskId);
            }
            return res.render('uploadDocs', {
                title: 'Upload Document',
                success: true,
                message: "Document uploaded successfully!",
                isLoggedIn: true,
                taskId: req.params.taskId
            });
        } catch (error) {
            console.error("Error uploading document:", error);
            return res.render('uploadDocs', {
                title: 'Upload Document',
                message: `Error uploading document: ${error.message}`,
                isLoggedIn: true
            });
        }
    });
    


    router
    .route('/uploadDocs/viewDocByDocId/:docId')
    .get(async (req, res) => {
        if (!req.session.user || !req.session.user.employeeId) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        
        const { docId } = req.params;
        const empId = req.session.user.employeeId;

        try {
            const result = await doc.getDocumentUrlByDocId(empId, docId);
            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }
            
            res.redirect(result.docUrl);
        } catch (error) {
            console.error("Error fetching document:", error);
            return res.status(500).json({ message: "Failed to fetch document" });
        }
    });

    router
    .route('/uploadDocs/viewDocByDocIdEmpID/:docId/:employeeId')
    .get(async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    const { docId, employeeId } = req.params;  

    try {
        const result = await doc.getDocumentUrlByDocId(employeeId, docId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }

        res.redirect(result.docUrl);
    } catch (error) {
        console.error("Error fetching document:", error);
        return res.status(500).json({ message: "Failed to fetch document" });
    }
});



    router
    .route('/uploadDocs/viewDocByTaskId/:taskId/:employeeId')
    .get(async (req, res) => {
    if (!req.session.user || !req.session.user.employeeId) {
        return res.status(401).json({ message: "Unauthorized access" });
    }

    let taskId, empId;
    try {
        taskId = req.params.taskId;
        empId = req.params.employeeId;
    } catch (error) {
        console.error("Error parsing parameters:", error);
        return res.status(400).json({ message: "Invalid parameter format" });
    }

    try {
        const result = await doc.getDocumentUrlByTaskId(empId, taskId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        
        res.redirect(result.docUrl);
    } catch (error) {
        console.error("Error fetching document by task ID:", error);
        return res.status(500).json({ message: "Failed to fetch document by task ID" });
    }
});


    router
    .route('/getdocs/:employeeId')
    router.get(async (req, res) => {
        if (!req.session.user || req.session.user.employeeId !== req.params.employeeId) {
            return res.status(403).json({ message: "Unauthorized access" });
        }
    
        try {
            const documentsData = await doc.getDocumentsByEmployeeId(req.params.employeeId);
            if (documentsData.documents.length === 0) {
                res.render('./data_functions/GetEmpDetailsandNotes', {
                    title: 'Employee Documents',
                    isLoggedIn: true,
                    noDocuments: true
                });
            } else {
                res.render('./data_functions/GetEmpDetailsandNotes', {
                    title: 'Employee Documents',
                    isLoggedIn: true,
                    documents: documentsData.documents
                });
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            res.status(500).render('./data_functions/GetEmpDetailsandNotes', {
                title: 'Employee Documents',
                message: 'Failed to fetch documents',
                isLoggedIn: true,
            });
        }
    });
    





export default router 