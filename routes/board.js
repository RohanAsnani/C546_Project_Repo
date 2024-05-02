import { Router } from 'express';
const router = Router();
import boardData from '../data/board.js';
import * as validation from '../helpers.js';
import user_Test from '../data/user_Test.js';

router.route('/')
.get(async(req,res)=>{
    try{
       return res.render('./users/hr',{title:'HR',firstName:req.session.user.firstName,role:req.session.user.role});
    }catch(e){
        return res.status(500).json(e.message);
    }
})

router.route('/getonboarding')
.get(async(req,res)=>{
    try{
        let onboardingUsers = await user_Test.getOnboardingHR();
       return  res.render('./data_functions/getonboardingusers',{title:"users to be Onboarded",...req.session.user,users:onboardingUsers});
    }catch(e){
        return res.status(500).json(e.message);
    }
})

router.route('/onboarding/:employeeId')
.get(async (req,res)=>{
    let employeeId = req.params.employeeId;
    let employeeDetails = await user_Test.getUserById(employeeId);
    let managerDetails = await boardData.getManagers();
    managerDetails = managerDetails.filter((data)=>{
        if(data.employeeId !== employeeDetails.employeeId){
            return data
        }
    })
    return res.render('./data_functions/patchFormHR',{title:'Onboarding Edit User',...employeeDetails,manager:managerDetails});
})
.post(async (req,res)=>{
    try{
        let patchInfo =  validation.checkTypeUserHR(req.body);
        console.log(patchInfo);
    }catch(e){
        return res.status(400).json(e.message);
    }

    try{
        let patchInfo = validation.checkTypeUserHR(req.body);
        let updatedDetails = await boardData.updatePatchOnboardingData(patchInfo)
        return res.render('./data_functions/newAdded',{title:'Updated User',...updatedDetails,hrView:true,adminButtons:'hidden'});
    }catch(e){
        return res.status(400).json(e.message);
    }
})

router
    .route('/getAll')
    .get(async (req, res) => {
        try {
            const boardUserData = await boardData.getAll();
            return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    })
    .post(async (req, res) => {

        let data = req.body;
        //make sure there is something present in the req.body
        if (!data || Object.keys(data).length === 0) {
            return res
                .status(400)
                .json({ error: 'There are no fields in the request body' });
        }
        try {

            data = validation.validateBoardingData(null, data.employeeId, data.taskName, data.dueDate, data.taskType, false);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }

        try {
            //check if boarding entry already present for user
            let existingBoardData = await boardData.getboardingDataByEmpId(data.employeeId);
            if (!existingBoardData || existingBoardData === null) {
                //create
                let createdBoardUserData = await boardData.createBoardingTask(data.employeeId, data);
                return res.json(createdBoardUserData);
            } else {
                //update - PUT
                let updatedBoardUserData = await boardData.updatePutBoardingTask(existingBoardData, data);
                return res.json(updatedBoardUserData);
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

router
    .route('/createTask/:employeeId')
    .get(async (req, res) => {
        try {
            if (!req.params.employeeId || req.params.employeeId.trim() === '') {
                res.status(400)
                //res.render('home', { hasError400Id: true });
                return;
            }
        } catch (e) {
            return res.status(400).json({ error: e });
        }
        let empData = await user_Test.getUserById(req.params.employeeId);
        return res.render('./data_functions/createTask', { title: 'Create Task', hidden: 'hidden', firstName: empData.firstName, lastName: empData.lastName, username: empData.username, employeeId: empData.employeeId });
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
                return res.render('./data_functions/newTaskAdded', { title: "Created Task" });
                //return res.json(createdBoardUserData);
            } else {
                //update - PUT
                let updatedBoardUserData = await boardData.updatePutBoardingTask(existingBoardData, data);
                return res.render('./data_functions/newTaskAdded', { title: "Created Task" });
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


router
    .route('/getAllByEmpId')
    .get(async (req, res) => {
        try {
            let employeeId = req.session.user.employeeId;
            const boardUserData = await boardData.getboardingDataByEmpId(employeeId);
            let taskList = [];
            let msg;
            if (boardUserData.on) {
                boardUserData.on.forEach((value) => {
                    taskList.push(value);
                });
                //taskList.append(boardUserData.on);
            } else if (boardUserData.off) {
                boardUserData.off.forEach((value) => {
                    taskList.push(value);
                });
                //taskList.append(boardUserData.off);
            } else {
                msg = `No tasks assigned.`;
            }
            return res.render('./data_funstions/getTaskList', { taskList: taskList, firstName: req.session.user.firstName, role: req.session.user.role, noDataPresentMsg: msg });
            // return res.json(boardUserData);
        } catch (e) {
            return res.status(500).json({ error: e });
        }
    });
export default router;