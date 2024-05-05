import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import bcrypt from 'bcryptjs';
import userTest from '../data/user_Test.js';
import board from '../data/board.js';
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

router
    .route('/uploadDocs')
    .get(async (req, res) => {
        console.log("helloooo");
        if (!req.session.user) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        
        try {
            const documentsData = await doc.getDocumentsByEmployeeId(req.session.user.employeeId);
            return res.render('uploadDocs', {
                title: 'Upload Document',
                isLoggedIn: true,
                documents: documentsData.documents,
                noDocuments: documentsData.documents.length === 0
            });
        } catch (error) {
            console.error("Error fetching documents:", error);
            return res.status(500).render('uploadDocs', {
                title: 'Upload Document',
                message: 'Failed to fetch documents',
                isLoggedIn: true
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

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const documentInfo = {
            empId: req.session.user.employeeId,
            typeOfDoc: req.body.typeOfDoc,
            status: "Pending",
            approvedby: null
        };

        try {
            const result = await doc.createDocument(documentInfo, fileBuffer, fileName);
            return res.render('uploadDocs', {
                title: 'Upload Document',
                success: true,
                message: "Document uploaded successfully!",
                isLoggedIn: true
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


export default router 