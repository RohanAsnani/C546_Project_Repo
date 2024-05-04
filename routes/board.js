import { Router } from 'express';
const router = Router();
import boardData from '../data/board.js';
import * as validation from '../helpers.js';
import user_Test from '../data/user_Test.js';
import xss from 'xss';

router.route('/')
    .get(async (req, res) => {
        try {
            return res.render('./users/hr', { title: 'HR', firstName: req.session.user.firstName, role: req.session.user.role ,isLoggedIn:true});
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

router.route('/getAllEmployees')
    .get(async (req, res) => {
        try {
            const userdata = await user_Test.getAll();
            return res.render('./data_functions/getAllEmp', { title: 'Employee Details', empList: userdata, firstName: req.session.user.firstName, role: req.session.user.role ,isLoggedIn:true});
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

router.route('/getEmpDetails/:employeeId')
    .get(async (req, res) => {
        try {
            let employeeId = req.params.employeeId;
            let employeeDetails = await user_Test.getUserById(employeeId);
            return res.render('./data_functions/patchFormHR', { title: 'Onboarding Edit User', ...employeeDetails, manager: managerDetails ,isLoggedIn:true});
        } catch (e) {
            return res.status(404).render('404Page',{title:'404 Not Found.',message:e.message});
        }
    });

router.route('/getonboarding')
    .get(async (req, res) => {
        try {
            let onboardingUsers = await user_Test.getOnboardingHR();
            let onboardingUsersES = await user_Test.getOnboardingHRES()
            return res.render('./data_functions/getboardingusers', { title: "Users Yet to be Onboarded", ...req.session.user, users: onboardingUsers,usersES:onboardingUsersES, isOnboarding: true, taskType: 'onboard',isLoggedIn:true});
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

router.route('/getoffboarding')
    .get(async (req, res) => {
        try {
            let offboardingUsers = await user_Test.getOffboardingHR();
            return res.render('./data_functions/getboardingusers', { title: "Users Yet to be Offboarded", ...req.session.user, users: offboardingUsers, isOnboarding: false, taskType: 'offboard' ,isLoggedIn:true});
        } catch (e) {
            return res.status(500).json(e.message);
        }
    });

router.route('/onboarding/:employeeId')
.get(async (req,res)=>{
    try{
        let employeeId = req.params.employeeId;
        let employeeDetails = await user_Test.getUserById(employeeId);
        let managerDetails = await boardData.getManagers();
        managerDetails = managerDetails.filter((data)=>{
            if(data.employeeId !== employeeDetails.employeeId){
                return data
            }
        })
        return res.render('./data_functions/patchFormHR',{title:'Onboarding Edit User',...employeeDetails,manager:managerDetails,isLoggedIn:true});
    }catch(e){
        return res.status(404).render('404Page',{title:'404 Not Found.',message:e});
    }
})
.post(async (req,res)=>{
    let patchInfo;
    try{
        patchInfo =  validation.checkTypeUserHR(req.body);
        console.log(patchInfo);
    }catch(e){
        let employeeId = req.params.employeeId;
        let employeeDetails = await user_Test.getUserById(employeeId);
        let managerDetails = await boardData.getManagers();
        managerDetails = managerDetails.filter((data)=>{
            if(data.employeeId !== employeeDetails.employeeId){
                return data
            }
        })
        return res.status(400).render('./data_functions/patchFormHR',{title:'Onboarding Edit User',...employeeDetails,manager:managerDetails,hidden:'',message:e.message,isLoggedIn:true})
    }

    try{
        let updatedDetails = await boardData.updatePatchOnboardingData(patchInfo)
        return res.render('./data_functions/newAdded',{title:'Updated User',...updatedDetails,hrView:true,adminButtons:'hidden',isLoggedIn:true});
    }catch(e){
        return res.status(400).json(e.message);
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
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Onboard Task List' ,isLoggedIn:true});
            //return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json(e.message );
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
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: false, taskTypeList: 'Offboard Task List' ,isLoggedIn:true});
            //return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json({ error: e });
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
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        let empData = await user_Test.getUserById(req.params.employeeId);
        return res.render('./data_functions/createTask', { title: ((req.params.taskType === 'onboard') ? 'Create New Onboard Task' : 'Create New Offboard Task'), hidden: 'hidden', firstName: empData.firstName, lastName: empData.lastName, username: empData.username, employeeId: empData.employeeId, taskType: req.params.taskType, isOnboard: ((req.params.taskType === 'onboard') ? true : false) ,isLoggedIn:true});
    });

router
    .route('/createTask')
    .post(async (req, res) => {

        let data = req.body;
        //make sure there is something present in the req.body
        if (!data || Object.keys(data).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }
        try {
            let employeeId = xss(data.employeeId);
            let taskName = xss(data.taskName);
            let taskDesc = xss(data.taskDesc);
            let dueDate = validation.convertDateFormat(xss(data.dueDate));
            let taskType = xss(data.taskType);
            data = validation.validateBoardingData(null, employeeId, taskName, taskDesc, dueDate, taskType, false);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            //check if boarding entry already present for user
            let existingBoardData = await boardData.getboardingDataByEmpId(data.employeeId);
            if (!existingBoardData || existingBoardData === null) {
                //create
                let createdBoardUserData = await boardData.createBoardingTask(data.employeeId, data);
                return res.render('./data_functions/newTaskAdded', { title: "Created Task" ,isLoggedIn:true});
                //return res.json(createdBoardUserData);
            } else {
                //update - PUT
                let updatedBoardUserData = await boardData.updatePutBoardingTask(existingBoardData, data);
                return res.render('./data_functions/newTaskAdded', { title: "Created Task" ,isLoggedIn:true});
                //return res.json(updatedBoardUserData);
            }

        } catch (e) {
            return res.status(404).json({ error: e.message });
        }

    })
    .patch(async (req, res) => {
        let updateBoardData = req.body;
        //make sure there is something present in the req.body
        if (!updateBoardData || Object.keys(updateBoardData).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }
        try {
            updateBoardData = validation.validateBoardingDataPatch(updateBoardData.employeeId, updateBoardData.taskId, updateBoardData.taskType, updateBoardData.updateBoardDataObj);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            let patchedInfo = await boardData.updatePatchBoardingTask(updateBoardData);

            return res.json(patchedInfo);
        } catch (e) {
            return res.status(404).json({ error: e.message });
        }

    });



export default router;