import axios from "axios";
import * as validation from "../helpers.js"
import { boarding, users } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"
import user_Test from '../data/user_Test.js';

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

        let boardData = validation.validateBoardingData(existingBoardData, data.employeeId, resObj.taskName, resObj.taskDesc, resObj.dueDate, resObj.taskType, true);

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

    async updatePatchBoardingCompleteTask(employeeId, taskId, taskType) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        taskId = validation.validObject(taskId);
        taskType = validation.checkStrCS(taskType, 'Task Type', 0, 100, true);

        const boardingCollection = await boarding();
        const totBoardingData = await this.getboardingDataByEmpId(employeeId);
        let updatedObj = updatedBoardObj(totBoardingData, taskId, taskType);

        let patchedInfo;

        patchedInfo = await boardingCollection.findOneAndUpdate({ employeeId: employeeId },
            { $set: updatedObj },
            { returnDocument: 'after' }
        );

        if (!patchedInfo) throw new Error(`Cannot update task for user with id: ${updationPatchInfo.employeeId}`);

        return patchedInfo

    },

    async getManagers() {
        let userCollection = await users();
        let managerList = await userCollection.find({ isManager: true }, { projection: { employeeId: 1, firstName: 1, lastName: 1 } })

        if (!managerList) return "No Managers."
        return managerList.toArray()
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

      async patchEmployeeData(patchData){
        patchData = validation.checkTypeUserEmployee(patchData);
    
        let userCollection =    await users();
        
        let checkPhone = await userCollection.findOne({'contactInfo.phone': patchData.contactInfo.phone});

        if(checkPhone)throw new Error('Phone number already exists try another one.');
        let checkPersonalEmail = await userCollection.findOne({'contactInfo.personalEmail': patchData.contactInfo.personalEmail})

        if(checkPersonalEmail)throw new Error('email Id already Exists , try another Personal Email Id')

        let existingData = await userCollection.findOne({employeeId: patchData.employeeId});

        patchData = validation.updateValuesOfTwoObjects(existingData,patchData);

        let updatedData = await userCollection.findOneAndUpdate({employeeId: patchData.employeeId},
            {$set:patchData},
            {returnDocument: 'after'}
            )
        
        if(!updatedData)throw new Error('Could not Update data in the system.')
        
        updatedData = await user_Test.getUserById(patchData.employeeId);

        return updatedData
    }
}



const getTaskData = (data) => {
    let resObj = {};
    let taskName;
    let taskDesc;
    let dueDate;
    let taskType;
    if (data.on) {
        taskName = data.on[0].taskName;
        taskDesc = data.on[0].taskDesc;
        dueDate = data.on[0].dueDate;
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

    return resObj;
}

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