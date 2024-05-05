import { Router } from "express";
const router = Router();
import {
  getAllLeaves,
  createReqDecision,
  //   getLeaveForm,
  //   getLeaveRecord,
  //   createLeaveReq,
} from "../data/leaveReq.js";
import * as validation from "../helpers.js";

// Route for HR manager to get all leave requests
router.route("/getAll").get(async (req, res) => {
  try {
    const leaveRequests = await getAllLeaves();
    res.status(200).render("./leaveReq/leaveRequestList", { leaveRequests });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Route for HR manager to decide on leave requests

router.route("/:objectId").get(async (req, res) => {
  let obj = req.params.objectId;
  try {
    const leavesCollection = await leaves();
    const leaveData = leavesCollection.findOne({ _id: obj });

    return res.status(200).render("./leaveReq/decideHR", { leaveData });
  } catch (e) {
    return res.status(400).json(e.message);
  }
});

router.route("/:objectId").post(async (req, res) => {
  const { reasonHR, Approve, Decline, Pending } = req.body;
  try {
    reasonHR = validation.checkIsProperString(reasonHR);
  } catch (error) {
    res.status(400).json(error.message);
  }

  try {
    let empId = req.session.user.employeeId;

    const leaveRecords = await createReqDecision(
      empId,
      reasonHR,
      Approve,
      Decline,
      Pending
    );
    return res.status(200).render("./leaveReq/decideHR");
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

export default router;
