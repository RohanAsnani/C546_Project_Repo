import * as validation from "../helpers.js";
import { users, leaves } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const createLeaveReq = async (subject, reason, startDate, endDate) => {
  // do valiration
  const { subject, reason, startDate, endDate } =
    validation.validateLeaveReqForm(subject, reason, startDate, endDate);

  //   As the leave request is created the status will be pending
  //   const status = "pending";

  //   Getting the empId of the currently logged in employee
  const usersCollection = await users();
  const userWanted = await usersCollection.findOne({
    //   TODO: How to get the current employee id
  });

  if (!userWanted) {
    throw `The desired user with the id ${userId} could not be fetched`;
  }

  let newLeave = {
    employeeID: employeeID,
    subject: subject,
    reason: reason,
    startDate: startDate,
    endDate: endDate,
    status: "pending",
    reviewerID: null,
  };

  const leaveCollection = await leaves();
  const insertInfo = await leaveCollection.insertOne(newLeave);

  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw "Could not add the leave";

  return newLeave;
};

export const getLeaveRecord = async () => {
  // TODO: Get the employee id of the current logged in empployee

  const usersCollection = await users(); // idk how to get employeeID
  const user = await usersCollection.findOne({ _id: new ObjectId(employeeID) });

  const leaveCollection = await leaves();

  const leave = await leaveCollection.find({
    _id: new ObjectId(employeeId),
  });

  if (!leave) throw `No leave under this employee`;

  return leave;
};

export const getAllLeaves = async () => {
  const leaveCollection = await leaves();
  const leave = await leaveCollection.find({});

  if (!leave) throw `No leaves found for the HR to review`;

  return leave;
};
export const createReqDecision = async (
  employeeID,
  commentsReviewer,
  Reviewer_ID
) => {
  // Get HR id
  // put it into reviewer id
  // add comments into commentsReviewer
  // change status accordingly
  // push to employee view
  // if nothing don put status as pending again if no decision is made

  //   TODO: get the HR id and put it into Reviewer_ID
  const usersCollection = await users();
  const hrID = usersCollection.findOne({});

  const leaveCollection = await leaves();

  const leave = leaveCollection.findOne({ _id: new ObjectId() });

  const leaveUpdated = leaveCollection.findOneAndUpdate(
    { _id: new ObjectId() },
    { _id: findReview._id, "reviews._id": new ObjectId(reviewId) },
    { $set: { reviews: updatedReviewData } },
    { returnDocument: "after" }
  );

  return Reviewer_ID;
};
export const getLeaveForm = async () => {
  const userCollection = await users();
  const user = await userCollection.findOne(
    { _id: new ObjectId(employeeId) },
    { "leaveBank.sickDay": 1, "leaveBank.vacation": 1 }
  );

  return user;
};
