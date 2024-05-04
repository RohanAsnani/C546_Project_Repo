import { Router } from "express";
const router = Router();
import {
  getAllLeaves,
  createReqDecision,
  getLeaveForm,
  getLeaveRecord,
  createLeaveReq,
} from "../data/leaveReq.js";
import * as validation from "../helpers.js";
import { ObjectId } from "mongodb";
import { users, leaves } from "../config/mongoCollections.js";

router.route("/hrc/emp/leaveReq/form").post(async (req, res) => {
  let data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }

  let { subject, reason, startDate, endDate } = data;
  try {
    ({ subject, reason, startDate, endDate } = validation.validateLeaveReqForm(
      subject,
      reason,
      startDate,
      endDate
    ));
  } catch (error) {
    return res.status(400).json(error);
  }

  try {
    const finalData = await createLeaveReq(subject, reason, startDate, endDate);
    res.status(201).send("New leave req created");
  } catch (error) {
    return res.status(404).json(error);
  }
});

router.route("/hrc/emp/leaveReq/leaveRecord").get(async (req, res) => {
  try {
    // TODO: Get the employee id of the current logged in empployee

    let empId = req.session.user.employeeId;
    const leaveRecords = getLeaveRecord(empId);

    res
      .status(200)
      .json("Employee gets the leave requests data successfully")
      .render("leaveRecord", { leaveRecords });
  } catch (error) {
    res.status(500).send(error);
  }
});
// Route for HR manager to decide on leave requests
router.route("/hrc/hr/leaveReq/:employeeId").put(async (req, res) => {
  const { reasonHR, Approve, Decline, Pending } = req.body;

  try {
    reasonHR = validation.checkIsProperString(reasonHR);
    
  } catch (error) {
    res.status(500).send(error);
  }

  try {
    const empId = req.session.user.employeeId;
    const leaveRecords = createReqDecision(
      empId,
      reasonHR,
      Approve,
      Decline,
      Pending
    );

    return leaveRecords;
  } catch (error) {
    res.status(500).send(error);
  }
});

router.route("/hrc/emp/leaveReq/form").get(async (req, res) => {
  try {
    const { sickDaysLeft, vacationDaysLeft } = getLeaveForm();
    return res.render("leaveReqForm", { sickDaysLeft, vacationDaysLeft });
  } catch (error) {
    res.status(400).json(error);
  }
});

// Route for HR manager to get all leave requests
router.route("/hrc/hr/leaveReq/getAll").get(async (req, res) => {
  try {
    const leaveRequests = getAllLeaves();
    res
      .status(200)
      .json("HR Manager gets the leave requests data successfully")
      .render("leaveRequestList", { leaveRequests });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
