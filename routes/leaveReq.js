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

router.route("/hrc/emp/leaveReq/form").post(async (req, res) => {
  let data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  try {
    let {
      employeeID,
      subject,
      reason,
      startDate,
      endDate,
      status,
      reviewerID,
    } = data;

    ({ subject, reason, startDate, endDate } = validation.validateLeaveReqForm(
      subject,
      reason,
      startDate,
      endDate
    ));
  } catch (error) {
    return res.status(400).json({ error: e.message });
  }

  try {
    const {
      employeeID,
      subject,
      reason,
      startDate,
      endDate,
      status,
      reviewerID,
    } = await createLeaveReq(subject, reason, startDate, endDate);
    res.status(201).send("New leave req created");
  } catch (error) {
    return res.status(404).json({ error: e.message });
  }
});

router.route("/hrc/emp/leaveReq/leaveRecord").get(async (req, res) => {
  try {
    const leaveRecord = getLeaveRecord();
    res.status(200).json("Employee gets the leave requests data successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

router.route("/hrc/emp/leaveReq/form").get(async (req, res) => {
  try {
    const { sickDaysLeft, vacationDaysLeft } = getLeaveForm();
    return res.render("leaveReqForm", { sickDaysLeft, vacationDaysLeft });
  } catch (error) {
    res.status(400).json();
  }
});

// Route for HR manager to decide on leave requests
router.route("/hrc/hr/leaveReq/reqDecision").put(async (req, res) => {});

// Route for HR manager to get all leave requests
router.route("/hrc/hr/leaveReq/getAll").get(async (req, res) => {
  try {
    const hr = getAllLeaves();
    res
      .status(200)
      .json("HR Manager gets the leave requests data successfully");
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
