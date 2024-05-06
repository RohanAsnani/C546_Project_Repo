import axios from "axios";
import * as validation from "../helpers.js"
import { boarding, users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"
import user_Test from '../data/user_Test.js';
import { type } from "os";

const exportedMethods = {
    async createBoardingTask(userId, data) {

        let resObj = getTaskData(data);

        let boardData = validation.validateBoardingData(null, userId, resObj.taskName, resObj.taskDesc, resObj.dueDate, resObj.taskType, false);

        const boardingCollection = await boarding();
        let createdInfo = await boardingCollection.insertOne(boardData);

        if (!createdInfo || typeof (createdInfo) === 'null') throw new Error('Could not add Task.');

        return this.getboardingDataByObjectId(createdInfo.insertedId)

    },

    async getAll() {
        const boardingCollection = await boarding();
        let boardingList = await boardingCollection.find({}).toArray()
        if (!boardingList) {
            return []
        }
        return boardingList
    },

    async getboardingDataByObjectId(objectId) {
        objectId = validation.validObject(objectId);

        const boardingCollection = await boarding();
        let userData = await boardingCollection.findOne({
            _id: new ObjectId(objectId)
        });

        if (!userData) throw new Error(`Could not find onboard record with id ${objectId}`);

        return userData
    },

    async getboardingDataByEmpId(userId) {

        if (!userId) throw 'id is required';
        userId = validation.checkStrCS(userId, 'Employee Id', 0, 100, true);

        const boardingCollection = await boarding();
        let userData = await boardingCollection.findOne({ employeeId: userId });
        // const userCollection = await users();
        // let userData = await getByObjectId(userId);

        // if (!userData || userData === null) throw new Error(`Could not find onboard record for employee id ${userId}`);

        return userData;

    },

    async updatePutBoardingTask(existingBoardData, data) {

        let resObj = getTaskData(data);

        let boardData = validation.validateBoardingData(existingBoardData, data.employeeId, resObj.taskName, resObj.taskDesc, resObj.dueDate, resObj.taskType, resObj.type, true);

        const boardingCollection = await boarding();
        let updatedInfo = await boardingCollection.findOneAndReplace(
            { employeeId: data.employeeId },
            boardData,
            { returnDocument: 'after' }
        );

        if (!updatedInfo || updatedInfo === 'null') throw new Error(`Could not find boarding record for employee with id: ${data.employeeId}`);
        return updatedInfo

    },

    async updatePatchBoardingTask(updateBoardData) {
        if (updateBoardData)
            console.log("data : ");

        let updationPatchInfo = validation.validateBoardingDataPatch(updateBoardData.employeeId, updateBoardData.taskId, updateBoardData.taskType, updateBoardData.updateBoardDataObj);
        const boardingCollection = await boarding();
        const totBoardingData = await this.getboardingDataByEmpId(updationPatchInfo.employeeId);
        let updatedRevObj = updatedBoardObj(totBoardingData, updationPatchInfo);

        let patchedInfo;

        patchedInfo = await boardingCollection.findOneAndUpdate({ employeeId: updationPatchInfo.employeeId },
            { $set: updatedRevObj },
            { returnDocument: 'after' }
        );

        if (!patchedInfo) throw new Error(`Cannot update task for user with id: ${updationPatchInfo.employeeId}`);

        return patchedInfo

    },

    async updatePatchBoardingCompleteTask(employeeId, taskId, taskType, status, countryOfOrigin) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        taskId = validation.validObject(taskId);
        taskType = validation.checkStrCS(taskType, 'Task Type', 0, 100, true);
        console.log('taskType : ', taskType);
        const boardingCollection = await boarding();
        const userCollection = await users();
        const totBoardingData = await this.getboardingDataByEmpId(employeeId);
        let updatedObj = updatedBoardObj(totBoardingData, taskId, taskType);
        console.log('updatedObj : ', updatedObj);
        let patchedInfo;

        patchedInfo = await boardingCollection.findOneAndUpdate({ employeeId: employeeId },
            { $set: updatedObj },
            { returnDocument: 'after' }
        );
        console.log('patchedInfo : ', patchedInfo);
        if (!patchedInfo) throw new Error(`Cannot update task for user with id: ${updationPatchInfo.employeeId}`);
        let empData;
        if (status !== 'Active') {
            if (countryOfOrigin) {
                let taskList = await this.checkAllTasksCompletedForEmp(employeeId);
                if (taskList.length === 0) {
                    empData = await userCollection.findOne({ employeeId: employeeId });
                    empData.status = 'Active';

                    let updatedData = await userCollection.findOneAndUpdate({ employeeId: employeeId },
                        { $set: empData },
                        { returnDocument: 'after' }
                    )

                    if (!updatedData) throw new Error('Could not Update data in the system.')

                }
            }
        }

        return empData;

    },

    async getManagers() {
        let userCollection = await users();
        let managerList = await userCollection.find({ isManager: true }, { projection: { employeeId: 1, firstName: 1, lastName: 1 } })

        if (!managerList) return "No Managers."
        return managerList.toArray()
    },

    async addEndDate(userId,endDate){
        if(!userId || !endDate)throw new Error('EmployeeId and End Date both needed.');

        userId = validation.isValidEmployeeId(userId);
        
        endDate = validation.dateFormat(endDate,'Start Date');
    
         let year = endDate[0];
         let month = endDate[1];
         let date = endDate[2];

         validation.isValidDate(month, date, year,'Start Date',true);
         endDate = String(endDate[0]) + '-' + String(endDate[1]) + '-' + String(endDate[2]);

         if(validation.isDateBeforeToday(endDate))throw new Error('End Date Cannot be in the past.');

        let userCollection = await users();
        let checkDate = await userCollection.find({employeeId: userId},{projection:{startDate:1}}).toArray();

        

        if(validation.isFirstDateBeforeSecondDate(endDate,checkDate[0].startDate))throw new Error('End Date Cannot be before Start Date.');

        let updatedUser = await userCollection.updateOne({employeeId: userId},{$set:{endDate: endDate,status:'Offboarding(Notice Period)'}});

        if(!updatedUser)throw new Error('Could not Add End Date.');

        let updatedInfo = await user_Test.getUserById(userId);
        return updatedInfo
    },

    async updatePatchOnboardingData(updationInfo){

        if(!updationInfo.employeeId)throw new Error('Missing employee id.');

        
        
        let userCollection = await users();
        let existingData = await userCollection.findOne({employeeId:updationInfo.employeeId})
        updationInfo = validation.updateValuesOfTwoObjects(existingData,updationInfo);
        let patchedInfo = await userCollection.findOneAndUpdate({employeeId: updationInfo.employeeId},
        {$set:updationInfo},
        {returnDocument: 'after'}
        );
      
        if(!patchedInfo)throw new Error(`Cannot update user with id: ${employeeId}`);
      
        return patchedInfo
      
      },

    async checkAllTasksCompletedForEmp(employeeId) {
        //check if onboarding tasks are completed
        const boardingCollection = await boarding();
        const boardUserData = await this.getboardingDataByEmpId(employeeId);
        let taskList = [];
        let msg;
        if (boardUserData) {
            let boardUsrData = [];
            boardUsrData.push(boardUserData);
            let res = await validation.getTaskList(boardUsrData, taskList, msg, true, true, false);
            if (res.taskList) {
                taskList = res.taskList;
            }
            if (res.msg) {
                msg = res.msg;
            }
        } else {
            msg = `No tasks assigned.`;
        }
        return taskList;
    },

    async patchEmployeeData(patchData) {
        patchData = validation.checkTypeUserEmployee(patchData);
        let taskList = await this.checkAllTasksCompletedForEmp(patchData.employeeId);
        if (taskList.length > 0) {
            patchData.status = 'Onboarding(Employee-Side)';
        }

        let userCollection = await users();

        let checkPhone = await userCollection.findOne({ 'contactInfo.phone': patchData.contactInfo.phone });

        
        let checkPersonalEmail = await userCollection.findOne({'contactInfo.personalEmail': patchData.contactInfo.personalEmail})

       
            
            if(checkPhone){
                if(checkPhone.employeeId !== patchData.employeeId)throw new Error('Phone Number Already exists.');
            }

            if(checkPersonalEmail){
                if(checkPersonalEmail.employeeId !== patchData.employeeId )throw new Error('email Id already Exists , try another Personal Email Id');
            }
            
        
    
        let existingData = await userCollection.findOne({employeeId: patchData.employeeId});

        patchData = validation.updateValuesOfTwoObjects(existingData,patchData);

        let updatedData = await userCollection.findOneAndUpdate({employeeId: patchData.employeeId},
            {$set:patchData},
            {returnDocument: 'after'}
            )
        
        if(!updatedData)throw new Error('Could not Update data in the system.')
        
        updatedData = await user_Test.getUserById(patchData.employeeId);

        return updatedData
    },
    async createSalaryBenifits(employeeId){
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        let dueDate = validation.getLaterDate(7)
        const boardData = {
            employeeId: employeeId,
            on: [
                {
                    _id: new ObjectId(),
                    taskName: 'Bank Account Details',
                    taskDesc: 'please provide your bank account details',
                    dueDate: dueDate,
                    completedOn: null,
                    type: 'form'
                },
                {
                    _id: new ObjectId(),
                    taskName: 'Tax Forms',
                    taskDesc: 'please provide your tax forms',
                    dueDate: dueDate,
                    completedOn: null,
                    type: 'document'
                },
                {
                    _id: new ObjectId(),
                    taskName: 'Health Insurance',
                    taskDesc: 'please provide your health insurance details',
                    dueDate: dueDate,
                    completedOn: null,
                    type: 'select'
                },
            ],
        }
        const boardingCollection = await boarding();
        let createdInfo = await boardingCollection.insertOne(boardData);

        if (!createdInfo || typeof (createdInfo) === 'null') throw new Error('Could not add Task.');

        return this.getboardingDataByObjectId(createdInfo.insertedId)
    },
    async deleteTask(employeeId, taskType, taskId) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        let taskIdStr = taskId;
        let taskObjId = ObjectId.createFromHexString(taskId);
        taskId = validation.validObject(taskObjId);
        taskType = validation.checkStrCS(taskType, 'Task Type', 0, 100, true);
        const boardingCollection = await boarding();

        const checkIfExists = await this.getTaskById(employeeId, taskType, taskId);

        if (!checkIfExists) throw `Task does not exist with task Id: ${taskIdStr}.`;
        let deletionInfo;
        if (taskType === 'onboard') {
            deletionInfo = await boardingCollection.updateOne(
                { employeeId: employeeId, 'on._id': taskId },
                { $pull: { on: { _id: taskId } } }
            );
        } else {
            deletionInfo = await boardingCollection.updateOne(
                { employeeId: employeeId, 'off._id': taskId },
                { $pull: { off: { _id: taskId } } }
            );
        }


        if (!deletionInfo) throw `Could not delete task with for employee id ${employeeId}`;
        return deletionInfo;
    },
    async getTaskById(employeeId, taskType, taskId) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        taskId = validation.validObject(taskId);
        taskType = validation.checkStrCS(taskType, 'Task Type', 0, 100, true);

        const boardingCollection = await boarding();
        let taskData;
        if (taskType === 'onboard') {
            taskData = await boardingCollection.findOne({ 'on._id': taskId }, { projection: { 'on.$': 1 } });
        } else {
            taskData = await boardingCollection.findOne({ 'off._id': taskId }, { projection: { 'off.$': 1 } });
        }

        if (!taskData || taskData === null) throw 'Error : Task Not Found.';
        return (taskType === 'onboard') ? taskData.on[0] : taskData.off[0];
    }
}



const getTaskData = (data) => {
    let resObj = {};
    let taskName;
    let taskDesc;
    let dueDate;
    let taskType;
    let type;
    if (data.on) {
        taskName = data.on[0].taskName;
        taskDesc = data.on[0].taskDesc;
        dueDate = data.on[0].dueDate;
        type = data.on[0].type;
        taskType = "onboard";
    } else {
        taskName = data.off[0].taskName;
        taskDesc = data.off[0].taskDesc;
        dueDate = data.off[0].dueDate;
        taskType = "offboard";
    }

    resObj.taskName = taskName;
    resObj.taskDesc = taskDesc;
    resObj.dueDate = dueDate;
    resObj.taskType = taskType;
    resObj.type = type;
    return resObj;
};

let updatedBoardObj = (oldObj, taskId, taskType) => {
    let updatedBoardObj = oldObj;
    if (taskType === "Onboard") {
        let onArr = [];
        onArr = updatedBoardObj.on;
        for (let i = 0; i < onArr.length; i++) {
            if (onArr[i]._id.toString() === taskId) {
                let currDate = validation.getCurrDate();
                onArr[i].completedOn = currDate;
            }
        }
    } else {
        let offArr = [];
        offArr = updatedBoardObj.off;
        for (let i = 0; i < offArr.length; i++) {
            if (offArr[i]._id.toString() === taskId) {
                let currDate = validation.getCurrDate();
                offArr[i].completedOn = currDate;
            }
        }
    }
    return updatedBoardObj;
};
export default exportedMethods;