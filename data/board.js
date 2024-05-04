import axios from "axios";
import * as validation from "../helpers.js";
import { boarding, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const exportedMethods = {
  async createBoardingTask(userId, data) {
    let resObj = getTaskData(data);

    let boardData = validation.validateBoardingData(
      null,
      userId,
      resObj.taskName,
      resObj.dueDate,
      resObj.taskType,
      false
    );

    const boardingCollection = await boarding();
    let createdInfo = await boardingCollection.insertOne(boardData);

    if (!createdInfo || typeof createdInfo === "null")
      throw new Error("Could not add Task.");

    return this.getboardingDataByObjectId(createdInfo.insertedId);
  },

  async getAll() {
    const boardingCollection = await boarding();
    let boardingList = await boardingCollection.find({}).toArray();
    if (!boardingList) {
      return [];
    }
    return boardingList;
  },

  async getboardingDataByObjectId(objectId) {
    objectId = validation.validObject(objectId);

    const boardingCollection = await boarding();
    let userData = await boardingCollection.findOne({
      _id: new ObjectId(objectId),
    });

    if (!userData)
      throw new Error(`Could not find onboard record with id ${objectId}`);

    return userData;
  },

  async getboardingDataByEmpId(userId) {
    if (!userId) throw "id is required";
    userId = validation.stringExistandType(userId, "User Id");

    const boardingCollection = await boarding();
    let userData = await boardingCollection.findOne({ employeeId: userId });
    // const userCollection = await users();
    // let userData = await getByObjectId(userId);

    // if (!userData || userData === null) throw new Error(`Could not find onboard record for employee id ${userId}`);

    return userData;
  },

  async updatePutBoardingTask(existingBoardData, data) {
    let resObj = getTaskData(data);

    let boardData = validation.validateBoardingData(
      existingBoardData,
      data.employeeId,
      resObj.taskName,
      resObj.dueDate,
      resObj.taskType,
      true
    );

    const boardingCollection = await boarding();
    let updatedInfo = await boardingCollection.findOneAndReplace(
      { employeeId: data.employeeId },
      boardData,
      { returnDocument: "after" }
    );

    if (!updatedInfo || updatedInfo === "null")
      throw new Error(
        `Could not find boarding record for employee with id: ${data.employeeId}`
      );
    return updatedInfo;
  },

  async updatePatchBoardingTask(updateBoardData) {
    if (updateBoardData) console.log("data : ");

    let updationPatchInfo = validation.validateBoardingDataPatch(
      updateBoardData.employeeId,
      updateBoardData.taskId,
      updateBoardData.taskType,
      updateBoardData.updateBoardDataObj
    );

    const boardingCollection = await boarding();
    const totBoardingData = await this.getboardingDataByEmpId(
      updationPatchInfo.employeeId
    );
    let updatedRevObj = updatedBoardObj(totBoardingData, updationPatchInfo);

    let patchedInfo;

    patchedInfo = await boardingCollection.findOneAndUpdate(
      { employeeId: updationPatchInfo.employeeId },
      { $set: updatedRevObj },
      { returnDocument: "after" }
    );

    if (!patchedInfo)
      throw new Error(
        `Cannot update task for user with id: ${updationPatchInfo.employeeId}`
      );

    return patchedInfo;
  },
};

const getTaskData = data => {
  let resObj = {};
  let taskName;
  let dueDate;
  let taskType;
  if (data.on) {
    taskName = data.on[0].taskName;
    dueDate = data.on[0].dueDate;
    taskType = "onboard";
  } else {
    taskName = data.off[0].taskName;
    dueDate = data.off[0].dueDate;
    taskType = "offboard";
  }

  resObj.taskName = taskName;
  resObj.dueDate = dueDate;
  resObj.taskType = taskType;

  return resObj;
};

let updatedBoardObj = (oldObj, newObj) => {
  let updatedBoardObj = oldObj;
  if (newObj.taskType === "onboard") {
    let onArr = [];
    onArr = updatedBoardObj.on;
    for (let i = 0; i < onArr.length; i++) {
      if (onArr[i]._id.toString() === newObj.taskId) {
        if (newObj.updateBoardDataObj.taskName) {
          onArr[i].taskName = newObj.updateBoardDataObj.taskName;
        }
        if (newObj.updateBoardDataObj.dueDate) {
          onArr[i].dueDate = newObj.updateBoardDataObj.dueDate.trim();
        }
        if (newObj.updateBoardDataObj.completedOn) {
          onArr[i].completedOn = newObj.updateBoardDataObj.completedOn;
        }
      }
    }
  } else {
    let offArr = [];
    offArr = updatedBoardObj.off;
    for (let i = 0; i < offArr.length; i++) {
      if (offArr[i]._id.toString() === newObj.taskId) {
        if (newObj.updateBoardDataObj.taskName) {
          offArr[i].taskName = newObj.updateBoardDataObj.taskName;
        }
        if (newObj.updateBoardDataObj.dueDate) {
          offArr[i].dueDate = newObj.updateBoardDataObj.dueDate.trim();
        }
        if (newObj.updateBoardDataObj.completedOn) {
          offArr[i].completedOn = newObj.updateBoardDataObj.completedOn;
        }
      }
    }
  }
  return updatedBoardObj;
};
export default exportedMethods;
