import * as validation from "../helpers.js";
import { users, leaves } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createLeaveReq = async (
  subject,
  reason,
  startDate,
  endDate,
  empId
) => {
  // do valiration
  //   const { subject, reason, startDate, endDate } =
  //     validation.validateLeaveReqForm(subject, reason, startDate, endDate);

  ({ subject, reason, startDate, endDate } = validation.validateLeaveReqForm(
    subject,
    reason,
    startDate,
    endDate
  ));
  startDate = validation.getDateFormat(startDate);
  endDate = validation.getDateFormat(endDate);
  //   As the leave request is created the status will be pending
  //   const status = "pending";
  let newLeave = {
    employeeID: empId,
    subject: subject,
    reason: reason,
    startDate: startDate,
    endDate: endDate,
    status: "pending",
    commentsReviewer: "",
    reviewerID: null,
  };

  const leaveCollection = await leaves();
  const insertInfo = await leaveCollection.insertOne(newLeave);

  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not add the leave");
  }

  return newLeave;
};

export const getLeaveRecord = async employeeId => {
  const leaveCollection = await leaves();
  const leave = await leaveCollection
    .find({ employeeID: employeeId })
    .toArray();

  if (!leave) return [];

  return leave;
};

export const getAllLeaves = async () => {
  const leaveCollection = await leaves();
  const leave = await leaveCollection.find({}).toArray();

  if (!leave) return [];

  return leave;
};

export const createReqDecision = async (
  employeeID,
  reasonHR,
  Approve,
  Decline,
  Pending
) => {
  // Get HR id
  // put it into reviewer id
  // add comments into commentsReviewer
  // change status accordingly
  // push to employee view
  // if nothing don put status as pending again if no decision is made

  reasonHR = validation.checkIsProperString(reasonHR);

  //   How to get the particular leaveReq selected

  const leaveCollection = await leaves();
  const leave = leaveCollection.findOne({ _id: new ObjectId() });

  updatedLeaveData = {
    ...leave,
    reviewerID: employeeID,
    commentsReviewer: reasonHR,
  };

  const leaveUpdated = leaveCollection.findOneAndUpdate(
    { employeeID: employeeID },
    { $set: { leave: updatedLeaveData } },
    { returnDocument: "after" }
  );

  return leaveUpdated;
};
export const getLeaveForm = async empId => {
  const userCollection = await users();
  const user = await userCollection.findOne(
    { employeeId: empId },
    { "leaveBank.sickDay": 1, "leaveBank.vacation": 1 }
  );

  return user;
};
