//Here you will import route files and export them as used in previous labs
import user_Test from "./user_Test.js";
import boardRoutes from "./board.js";
import login from "./login.js";
import logout from "./logout.js";
import admin from "./admin.js";
import employee from "./employee.js";
import deactivated from './deactivated.js';
import notonboarded from './notonboarded.js';
import onboarding from './onboarding.js';
import leaveReqEmp from "./leaveReqEmp.js";
import leaveReqHR from "./leaveReqHR.js";
import path from "path";
import { static as staticDir } from "express";

const constructorMethod = (app) => {
  app.use('/hrc/notonboarded',notonboarded);
  app.use('/hrc/deactivated',deactivated);
  app.use('/hrc/onboarding',onboarding);
  app.use('/hrc/login', login);
  app.use('/hrc/logout', logout);
  app.use('/hrc/admin', admin);
  // app.use('/hrc/users', user_Test);
  app.use("/hrc/employee/leaveReq", leaveReqEmp);
  app.use("/hrc/hr/leaveReq", leaveReqHR);
  app.use("/hrc/hr", boardRoutes);
  app.use("/hrc/employee", employee);

  // app.use("/hrc/", user_Test);
  app.use("*", (req, res) => {
   res.redirect("/hrc/login");
   console.log("Error originating from here.");
  });
};

export default constructorMethod;
