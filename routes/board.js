import { Router } from 'express';
const router = Router();
import boardData from '../data/board.js';
import * as validation from '../helpers.js';
import user_Test from '../data/user_Test.js';
import xss from 'xss';
import * as analytics from '../Analytics/Analytics_Functions.js';
import { ObjectId } from "mongodb";
import sendEmail from "../util/emailNotif.js";
import doc from '../data/documents.js'
import multer from 'multer';

router.route('/')
    .get(async (req, res) => {
        try {
            return res.render('./users/hr', { title: 'HR', firstName: req.session.user.firstName, role: req.session.user.role, isLoggedIn: true });
        } catch (e) {
            return res.status(404).render('404Page', { title: '404 Not Found.', message: e.message });
        }
    });

router.route('/getAllEmployees')
    .get(async (req, res) => {
        try {
            let userdata = await user_Test.getAll();
            userdata = userdata.map(user=>{
                if(user.employeeId !== req.session.user.employeeId){
                    return user;
                }
            }).filter(Boolean);
            return res.render('./data_functions/getAllEmp', { title: 'Employee Details', empList: userdata, firstName: req.session.user.firstName, role: req.session.user.role, isLoggedIn: true, hideTable: '', hidden: 'hidden' });
        } catch (e) {
            return res.status(400).render('./data_functions/getAllEmp', { title: 'Employee Details', empList: userdata, firstName: req.session.user.firstName, role: req.session.user.role, isLoggedIn: true, hidden: '', hideTable: 'hidden', message: e.message });
        }
    });
/*
router.route('/getEmpDetails/:employeeId')
    .get(async (req, res) => {
        try {
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            return res.status(200).render('./data_functions/GetEmpDetailsandNotes', { title: 'Employee deatils', ...employeeDetails ,isLoggedIn:true});
        } catch (e) {
            return res.status(404).render('404Page', { title: '404 Not Found.', message: e.message });
        }
    });  */


router
    .route('/getEmpDetails/:employeeId')
    .get(async (req, res) => {
        try {
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            let documentsData = await doc.getDocumentsByEmployeeId(employeeId);
                let hasDocuments = documentsData.documents && documentsData.documents.length > 0;
                return res.render('./data_functions/GetEmpDetailsandNotes', {
                title: 'Employee Details',
                ...employeeDetails,
                documents: documentsData.documents,
                noDocuments: !hasDocuments, // Add a flag to indicate presence of documents
                isLoggedIn: true
            });
        } catch (error) {
            console.error("Error fetching data:", error);
            return res.status(500).render('404Page', {
                title: 'Error',
                message: 'Failed to retrieve employee details or documents.',
                isLoggedIn: true
            });
        }
    });
    

router.route('/submit-note')
    .post(async (req,res)=>{
        //console.log(req.body)
        const employeeId  = req.body.employeeId;
        const notes  = req.body.notes;
        if (!employeeId || !notes) {
            return res.status(400).render('./data_functions/GetEmpDetailsandNotes', {
                error: "Both Employee ID and note are required and cannot be empty."
            })
        }
        try {
            await user_Test.updatePatchNotes(req.body);
            const employeeDetails = await user_Test.getUserById(employeeId);
            res.status(200).render('./data_functions/GetEmpDetailsandNotes', {
                title: 'Employee Details',
                ...employeeDetails,
                isLoggedIn: true,
                successMessage: "Note successfully added."
            });
        } catch (e) {
            console.error("Error updating employee note:", e);
            res.status(500).render('./data_functions/GetEmpDetailsandNotes',{
                title: 'Employee Details',
                error: e.message,
                isLoggedIn: true
            });
        }
    });

router.route('/getonboarding')
    .get(async (req, res) => {
        try {
            let onboardingUsers = await user_Test.getOnboardingHR();
            let onboardingUsersES = await user_Test.getOnboardingHRES()
            return res.render('./data_functions/getboardingusers', { title: "Users Yet to be Onboarded", ...req.session.user, users: onboardingUsers, usersES: onboardingUsersES, isOnboarding: true, taskType: 'onboard', isLoggedIn: true, hideList: '', hidden: 'hidden' });
        } catch (e) {
            return res.status(400).render('./data_functions/getboardingusers', { title: "Users Yet to be Onboarded", ...req.session.user, users: onboardingUsers, usersES: onboardingUsersES, isOnboarding: true, taskType: 'onboard', isLoggedIn: true, hidden: '', hideList: 'hidden', message: e.message });
        }
    });

router.route('/getoffboarding')
    .get(async (req, res) => {
        try {
            let offboardingUsers = await user_Test.getOffboardingHR();
            return res.render('./data_functions/getboardingusers', { title: "Users Yet to be Offboarded", ...req.session.user, users: offboardingUsers, isOnboarding: false, taskType: 'offboard', isLoggedIn: true, hideList: '', hidden: 'hidden' });
        } catch (e) {
            return res.status(400).render('./data_functions/getboardingusers', { title: "Users Yet to be Offboarded", ...req.session.user, users: offboardingUsers, isOnboarding: false, taskType: 'offboard', isLoggedIn: true, hidden: '', hideList: 'hidden', message: e.message });
        }
    });
router
    .route('/offboarding/:employeeId')
    .get(async (req,res)=>{
        let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            return res.render('./data_functions/endDate',{...employeeDetails});
    })
    .post(async (req,res)=>{
        try{
            let data = req.body
            let updatedUser = await boardData.addEndDate(data.employeeId,data.endDate);
            if(updatedUser){
                return res.render('offboardingAcknowledge',{title:`Offboarding ${updatedUser.employeeId}`,...updatedUser});
            }
        }catch(e){
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            return res.status(400).render('./data_functions/endDate', { ...employeeDetails, error: e.message });
        }
    })

router.route('/onboarding/:employeeId')
    .get(async (req, res) => {
        try {
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            let managerDetails = await boardData.getManagers();
            managerDetails = managerDetails.filter((data) => {
                if (data.employeeId !== employeeDetails.employeeId) {
                    return data
                }
            })
            return res.render('./data_functions/patchFormHR', { title: 'Onboarding Edit User', ...employeeDetails, manager: managerDetails, isLoggedIn: true });
        } catch (e) {
            return res.status(404).render('404Page', { title: '404 Not Found.', message: e.message });
        }
    })
    .post(async (req, res) => {
        let patchInfo;
        try {
            patchInfo = validation.checkTypeUserHR(req.body);
            console.log(patchInfo);
        } catch (e) {
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            let managerDetails = await boardData.getManagers();
            managerDetails = managerDetails.filter((data) => {
                if (data.employeeId !== employeeDetails.employeeId) {
                    return data
                }
            })
            return res.status(400).render('./data_functions/patchFormHR', { title: 'Onboarding Edit User', ...employeeDetails, manager: managerDetails, hidden: '', message: e.message, isLoggedIn: true })
        }

        try {
            let updatedDetails = await boardData.updatePatchOnboardingData(patchInfo)
            return res.render('./data_functions/newAdded', { title: 'Updated User', ...updatedDetails, hrView: true, adminButtons: 'hidden', isLoggedIn: true, hidden: 'hidden' });
        } catch (e) {
            return res.status(400).render('./data_functions/patchFormHR', { title: 'Onboarding Edit User', ...employeeDetails, manager: managerDetails, hidden: '', message: e.message, isLoggedIn: true });
        }
    })

router
    .route('/getAllOnBoadingTask')
    .get(async (req, res) => {
        try {
            const boardUserData = await boardData.getAll();
            let taskList = [];
            let msg;
            if (boardUserData.length > 0) {
                let res = await validation.getTaskList(boardUserData, taskList, msg, false, true, false);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            }
            //console.dir(taskList)
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Onboard Task List', isLoggedIn: true, hidden: 'hidden', hideTable: '' });
            //return res.json(boardUserData);
        } catch (e) {
            return res.status(400).render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Onboard Task List', isLoggedIn: true, hideTable: 'hidden', hidden: '', message: e.message });
        }
    });

router
    .route('/getAllOffBoadingTask')
    .get(async (req, res) => {
        try {
            const boardUserData = await boardData.getAll();
            let taskList = [];
            let msg;
            if (boardUserData.length > 0) {
                let res = await validation.getTaskList(boardUserData, taskList, msg, false, false, false);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            }
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Offboard Task List', isLoggedIn: true, hidden: 'hidden', hideTable: '' });
            //return res.json(boardUserData);
        } catch (e) {
            return res.status(400).render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Offboard Task List', isLoggedIn: true, hideTable: 'hidden', hidden: '', message: e.message });
        }
    });

router
    .route('/createTask/:taskType/:employeeId')
    .get(async (req, res) => {
        try {
            if (!req.params.employeeId || req.params.employeeId.trim() === '' || !req.params.taskType || req.params.taskType.trim() === '') {
                res.status(400)
                //res.render('home', { hasError400Id: true });
                return;
            }
            let employeeId = req.params.employeeId.trim();
            let taskType = req.params.taskType.trim();
            let empData = await user_Test.getUserById(employeeId);
            let isOnboard = true;
            if (taskType === 'offboard') {
                isOnboard = false;
            }
            const boardUserData = await boardData.getboardingDataByEmpId(employeeId);
            let taskList = [];
            let msg;
            if (boardUserData) {
                let boardUsrData = [];
                boardUsrData.push(boardUserData);
                let res = await validation.getTaskList(boardUsrData, taskList, msg, false, isOnboard, true);
                if (res.taskList) {
                    taskList = res.taskList;
                }
                if (res.msg) {
                    msg = res.msg;
                }
            } else {
                msg = `No tasks assigned.`;
            }

            return res.render('./data_functions/createTask', { title: ((taskType === 'onboard') ? 'Create New Onboard Task' : 'Create New Offboard Task'), hidden: 'hidden', firstName: empData.firstName, lastName: empData.lastName, username: empData.username, employeeId: empData.employeeId, taskType: req.params.taskType, isOnboard: ((taskType === 'onboard') ? true : false), taskList: taskList, noDataPresentMsg: msg, isLoggedIn: true, hidden: 'hidden', hideForm: '', hideTable: '' });
        } catch (e) {
            return res.status(400).render('./data_functions/createTask', { title: ((taskType === 'onboard') ? 'Create New Onboard Task' : 'Create New Offboard Task'), hidden: 'hidden', firstName: empData.firstName, lastName: empData.lastName, username: empData.username, employeeId: empData.employeeId, taskType: req.params.taskType, isOnboard: ((taskType === 'onboard') ? true : false), taskList: taskList, noDataPresentMsg: msg, isLoggedIn: true, hidden: '', hideForm: 'hidden', hideTable: 'hidden', message: e.message });
        }
    });

router
    .route('/createTask')
    .post(async (req, res) => {

        let data = req.body;
        //make sure there is something present in the req.body
        if (!data || Object.keys(data).length === 0) {

            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
        try {
            let employeeId = xss(data.employeeId);
            let taskName = xss(data.taskName);
            let taskDesc = xss(data.taskDesc);
            let dueDate = validation.convertDateFormat(xss(data.dueDate));
            let taskType = xss(data.taskType);
            let type = xss(data.type);
            data = validation.validateBoardingData(null, employeeId, taskName, taskDesc, dueDate, taskType, type, false);

            //check if boarding entry already present for user
            let existingBoardData = await boardData.getboardingDataByEmpId(data.employeeId);
            if (!existingBoardData || existingBoardData === null) {
                //create
                let createdBoardUserData = await boardData.createBoardingTask(data.employeeId, data);
                return res.render('./data_functions/newTaskAdded', { title: "Created Task", isLoggedIn: true, hidden: 'hidden', hideTag: '', isOnboard: taskType === 'onboard' ? true : false });
                //return res.json(createdBoardUserData);
            } else {
                //update - PUT
                let updatedBoardUserData = await boardData.updatePutBoardingTask(existingBoardData, data);
                return res.render('./data_functions/newTaskAdded', { title: "Created Task", isLoggedIn: true, hidden: 'hidden', hideTag: '', isOnboard: taskType === 'onboard' ? true : false });
                //return res.json(updatedBoardUserData);
            }

        } catch (e) {
            return res.status(400).render('./data_functions/newTaskAdded', { title: "Created Task", isLoggedIn: true, hidden: '', hideTag: 'hidden', message: e.message, isOnboard: taskType === 'onboard' ? true : false });
        }

    })
    .patch(async (req, res) => {
        let updateBoardData = req.body;
        //make sure there is something present in the req.body
        if (!updateBoardData || Object.keys(updateBoardData).length === 0) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
        try {
            updateBoardData = validation.validateBoardingDataPatch(updateBoardData.employeeId, updateBoardData.taskId, updateBoardData.taskType, updateBoardData.updateBoardDataObj);
            let patchedInfo = await boardData.updatePatchBoardingTask(updateBoardData);

            return res.json(patchedInfo);
        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }

    });

router
    .route('/deleteTask/:employeeId/:taskId/:taskType/:byEmp')
    .delete(async (req, res) => {

        if (!req.params.employeeId || req.params.employeeId.trim() === '' || !req.params.taskId || req.params.taskId.trim() === ''
            || !req.params.taskType || req.params.taskType.trim() === '' || !req.params.byEmp || req.params.byEmp.trim() === '') {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
        try {
            let employeeId = req.params.employeeId.trim();
            let taskType = req.params.taskType.trim().toLowerCase();
            let taskId = req.params.taskId.trim();
            let byEmp = req.params.byEmp.trim();

            const deletedInfo = await boardData.deleteTask(employeeId, taskType, taskId);
            if (byEmp === 'true') {
                return res.redirect(`/hrc/hr/createTask/${taskType}/${employeeId}`);
            } else {
                if (taskType === 'onboard') {
                    return res.redirect('/hrc/hr/getAllOnBoadingTask');
                } else {
                    return res.redirect('/hrc/hr/getAllOffBoadingTask');
                }
            }
        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
    });

router
    .route('/emailReminder')
    .post(async (req, res) => {

        try {
            let data = req.body;
            if (!data || Object.keys(data).length === 0) {
                return res.status(400).json(e.message).render('error', {
                    title: 'Error',
                    class: 'error-class',
                    message: e.message,
                    previous_Route: '/hrc/login',
                    linkMessage: 'Go back'
                });
            }
            let employeeId = xss(data.employeeId.trim());
            let taskType = xss(data.taskType.trim().toLowerCase());
            let taskId = xss(data.taskId.trim());

            let taskObjId = ObjectId.createFromHexString(taskId);
            taskId = validation.validObject(taskObjId);
            let empData = await user_Test.getUserById(employeeId);
            let taskData = await boardData.getTaskById(employeeId, taskType, taskId);
            console.log('Sending email to ' + empData.contactInfo.email);
            let email = empData.contactInfo.email;
            let subject = `Task Completion Reminder for Employee ID: ${employeeId}`;
            let msg = `This is a gentle reminder to complete task assigned to you. Please visit company portal to complete the task.\n Task Details:\n Task Name: ${taskData.taskName}\n Task Description: ${taskData.taskDesc}\n Due Date: ${taskData.dueDate}`;

            let info = await sendEmail(email, subject, msg);

            return res.status(200).json(info);

        } catch (e) {
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
    });


// HR Dashboard route to display analytics
router
    .route('/hr-dashboard')
    .get(async (req, res) => {
        try {
            const totalEmployees = await analytics.getTotalEmployees();
            const employeesByDepartment = await analytics.getEmployeesByDepartment();
            const averageTenureResult = await analytics.getAverageTenure();
            const incompleteBoardingTasks = await analytics.getIncompleteBoardingTasks(); 
            const diversityCount = await analytics.getDiversityCount();

            console.log(totalEmployees, employeesByDepartment, averageTenureResult, incompleteBoardingTasks,diversityCount);

            const labels = employeesByDepartment.map(dept => dept._id);
            const data = employeesByDepartment.map(dept => dept.count);
            const boardingLabels = incompleteBoardingTasks.details.map(task => task.employeeId);
            const boardingData = incompleteBoardingTasks.details.map(task => task.dueDates.join(', ')); 
            const diversityLabels = diversityCount.map(race => race._id);
            const diversityData = diversityCount.map(race => race.count);
            diversity: JSON.stringify({ labels: diversityLabels, data: diversityData })
            res.render('./data_functions/hr_dashboard', {
                totalEmployees,
                departments: JSON.stringify({ labels, data }), 
                averageTenureResult,
                incompleteBoardingTasks: JSON.stringify({ labels: boardingLabels, data: boardingData }),
                diversity: JSON.stringify({ labels: diversityLabels, data: diversityData }) 
            });

        } catch (e) {
            console.error("Failed to load HR dashboard:", e);
            return res.status(400).json(e.message).render('error', {
                title: 'Error',
                class: 'error-class',
                message: e.message,
                previous_Route: '/hrc/login',
                linkMessage: 'Go back'
            });
        }
    });

    

export default router;