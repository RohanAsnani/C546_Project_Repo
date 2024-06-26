import { Router } from "express";
const router = Router();
import {
  // getAllLeaves,
  // createReqDecision,
  getLeaveForm,
  getLeaveRecord,
  createLeaveReq,
} from "../data/leaveReq.js";
import * as validation from "../helpers.js";

router.route("/form").get(async (req, res) => {
  let empId = req.session.user.employeeId;

  try {
    const user = await getLeaveForm(empId);
    const { leaveBank } = user;
    const { sickLeaves, vacation } = leaveBank;
    return res.render("./leaveReq/leaveReqForm", {
      sickLeaves,
      vacation,
      isSubmitted: false,
      title: "Leave Request Form",
    });
  } catch (error) {
    return res.status(404).render("./404Page/", { message: e.message, title: "Error"});
  }
});

router.route("/form").post(async (req, res) => {
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
  } catch (e) {
    console.log("here");
    return res.status(404).render("./404Page/", { message: e.message, title: "Error"});
  }

  try {
    let empId = req.session.user.employeeId;

    const finalLeaveCreated = await createLeaveReq(
      subject,
      reason,
      startDate,
      endDate,
      empId
    );

    // console.log(finalLeaveCreated);

    // res.status(201).render("./leaveReq/leaveReqForm", {
    //   sickDaysLeft,
    //   vacationDaysLeft,
    // });

    // res.status(201).json("Successfully created the request");

    res.status(200).render("./leaveReq/success", { title: "Success" });
    // console.log("idk4");
  } catch (error) {
    return res.status(404).render("./404Page/", { message: e.message, title: "Error"});
  }
});

router.route("/leaveRecord").get(async (req, res) => {
  try {
    // TODO: Get the employee id of the current logged in empployee

    let empId = req.session.user.employeeId;
    const leaveRecords = await getLeaveRecord(empId);

    res.status(200).render("./leaveReq/leaveRecord", { leaveRecords, title: "Leave Record"});
  } catch (error) {
    return res.status(404).render("./404Page/", { message: e.message, title: "Error"});
  }
});

export default router;
