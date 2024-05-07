import "dotenv/config";

import * as mongoCollections from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import salaryData from "../data/salary.js";
import userData from '../data/user_Test.js';
import boardData from '../data/board.js';
import { closeConnection } from '../config/mongoConnection.js';

const adminCreationInfo = {
    employeeId: "HRCSP0001",
    firstName: "Sally",
    lastName: "Potter",
    username: "sallypotter01",
    password: "W@lly0001",
    confirmPassword: "W@lly0001",
    gender: "Female",
    maritalStatus: "Single",
    department: "Research And Development",
    role: "Admin",
    notes: [],
    status: "Active",
    vet: "Do not wish to identify",
    disability: "No",
    race: "East Asian",
    countryOfOrigin: "Nepal",
    startDate: "2024-05-06",
    endDate: "",
    dob: "2001-09-11",
    currentPosition: "Software Dev",
    isManager: false,
    currentSalary: 20,
    phone: "000-000-0011",
    email: "sallypotter01@hrccentral.com",
    personalEmail: "sallypotter01@gmail.com",
    primaryAddress: "555 Eddy Ave",
    secondaryAddress: "555 Eddy Ave",
    managerId: "",
    leaveBank: {
        sickLeaves: 5,
        vacation: 5
    }
};
const adminSalaryData = {
    ssn: 123456789, // replace with actual SSN
    hourlyPay: 30, // replace with actual hourly pay
    accountNo: 12345678, // replace with actual account number
    routingNo: 123456789, // replace with actual routing number
    paymentType: 'Direct Deposit', // replace with actual payment type
    billingAddress: '123 Main St, Anytown, USA', // replace with actual billing address
    position: 'Admin', // replace with actual position
};
const adminEmployeeId = 'HRCSP0001'; 
const hrCreationInfo = {
    employeeId: "HRCRS0001",
    firstName: "Rob",
    lastName: "Stark",
    username: "robstark0001",
    password: "W@lly0001",
    confirmPassword: "W@lly0001",
    gender: "Male",
    maritalStatus: "Single",
    department: "Research And Development",
    role: "HR",
    notes: [],
    status: "Active",
    vet: "Do not wish to identify",
    disability: "No",
    race: "Asian",
    countryOfOrigin: "India",
    startDate: "2024-05-06",
    endDate: "",
    dob: "2001-09-11",
    currentPosition: "Software Dev",
    isManager: false,
    currentSalary: 20,
    phone: "000-000-0110",
    email: "robstark0001@hrccentral.com",
    personalEmail: "robstark0001@gmail.com",
    primaryAddress: "555 Eddy Ave",
    secondaryAddress: "555 Eddy Ave",
    managerId: "",
    leaveBank: {
        sickLeaves: 5,
        vacation: 5
    }
};

const employeeCreationInfo1 = {
    employeeId: "HRCAC0001",
    firstName: "Amy",
    lastName: "Cooper",
    username: "amycooper23",
    password: "W@lly0001",
    confirmPassword: "W@lly0001",
    gender: "Female",
    maritalStatus: "Single",
    department: "Research And Development",
    role: "Employee",
    notes: [],
    status: "Onboarding",
    vet: "Do not wish to identify",
    disability: "No",
    race: "Jewish",
    countryOfOrigin: "Mayotte",
    startDate: "2024-05-06",
    endDate: "",
    dob: "2001-09-11",
    currentPosition: "Software Dev",
    isManager: false,
    currentSalary: 20,
    phone: "000-000-0010",
    email: "amycooper23@hrccentral.com",
    personalEmail: "amycooper@gmail.com",
    primaryAddress: "555 Eddy Ave",
    secondaryAddress: "555 Eddy Ave",
    managerId: "",
    leaveBank: {
        sickLeaves: 5,
        vacation: 5
    }
};

const run = async () => {
    const adminUser = await userData.create(adminCreationInfo);
    console.log(adminUser);
    // await salaryData.createSalary(adminEmployeeId, adminSalaryData);

    // // Add salary breakdown to admin user's salary record
    // const adminSalary = await salaryData.getSalaryByEmpId(adminEmployeeId);
    // await salaryData.addSalaryBreakdown(adminSalary);

    const hrUser = await userData.create(hrCreationInfo);
    console.log(hrUser);

    const empUser1 = await userData.create(employeeCreationInfo1);
    console.log(empUser1);

    const empUser1EmpId = empUser1.employeeId.toString();

    const empUser1Task = await boardData.createSalaryBenifits(empUser1EmpId);

    console.log(empUser1Task);

    // Close the database connection
    await closeConnection();
};

run();


