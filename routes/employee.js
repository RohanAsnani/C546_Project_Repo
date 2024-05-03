import { Router } from 'express';
const router = Router();
import * as validation from '../helpers.js';
import boardData from '../data/board.js';


router
    .route('/')
    .get(async (req, res) => {

        try {
            return res.render('./users/employee', { title: 'Employee', firstName: req.session.user.firstName, role: req.session.user.role, employeeId: req.session.user.employeeId });
        } catch (e) {
            return res.json('Not yet Set Up');
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
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: true, isEmp: true, taskTypeList: 'Task List' });
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
            const boardUserData = await boardData.getboardingDataByEmpId(employeeId);
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
            return res.render('./data_functions/getTaskList', { taskList: taskList, noDataPresentMsg: msg, viewAll: false, isEmp: true, taskTypeList: 'To-Do Task List' });
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
            let patchedInfo = await boardData.updatePatchBoardingCompleteTask(req.params.employeeId, req.params.taskId, req.params.taskType);
            return res.redirect('/hrc/employee/getAllToDoByEmpId');
            //return res.json(patchedInfo);
        } catch (e) {
            return res.status(404).json(e.message);
        }

    });
export default router 