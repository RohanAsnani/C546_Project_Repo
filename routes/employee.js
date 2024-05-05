import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';
import board from '../data/board.js';
import login from '../data/login.js';


router
    .route('/')
    .get(async (req, res) => {

        try {
            let status = req.session.user.status;
            let msg;
            if (status !== 'Active') {
                msg = `Please complete your profile and/or boarding tasks.`;
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
        return res. render('editProfile',{title:'Edit Profile',...userData,isLoggedIn:true})
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
                let res = await validation.getTaskList(boardUsrData, taskList, msg, true, false, true);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            } else {
                msg = `No tasks assigned.`;
            }
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: false, isEmp: true, taskTypeList: 'To-Do Task List' ,isLoggedIn:true});
            // return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

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
export default router 