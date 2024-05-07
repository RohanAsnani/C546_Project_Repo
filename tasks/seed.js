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
    ssn: 123456789,
    hourlyPay: 30,
    accountNo: 12345678,
    routingNo: 123456789,
    paymentType: 'Direct Deposit',
    billingAddress: '123 Main St, Anytown, USA',
    position: 'Admin',
};
const adminEmployeeId = 'HRCSP0001';



const adminBenifitOption = "optInPartner";
const adminData = [
    {
        benefeciary_name: "Sally Potter",
        benefeciary_relation: "Self",
        benefeciary_dob: "",
        benefeciary_address: "",
        benefeciary_email: "sallypotter01a@hrccentral.com",
        benefeciary_phone: ""
    },
    {
        benefeciary_name: "Alexis",
        benefeciary_relation: "Spouse",
        benefeciary_dob: "2000-01-14",
        benefeciary_address: "23 Hancock Ave Jersey Heights NJ 07307",
        benefeciary_email: "alexis@gmail.com",
        benefeciary_phone: "123-456-7890"
    }
];

const hrBenifitOption = "optInSelf";
const hrData = [
    {
        benefeciary_name: "Manav Mody",
        benefeciary_relation: "Self",
        benefeciary_dob: "",
        benefeciary_address: "",
        benefeciary_email: "manavmody@hrccentral.com",
        benefeciary_phone: ""
    }
];
const hrSalaryData = {
    ssn: 987654321,
    hourlyPay: 35,
    accountNo: 87654321,
    routingNo: 987654321,
    paymentType: 'Direct Deposit',
    billingAddress: '456 Elm St, Springfield, USA',
    position: 'Senior Admin',
};

const hrEmployeeId = 'HRCRS0001';
const emp1EmployeeId = 'HRCAC0001';
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
    const createAdminBene = await salaryData.createBenefits(adminEmployeeId, adminBenifitOption, adminData)

    const createAdminSal = await salaryData.createSalary(adminEmployeeId, adminSalaryData)
    const adminSalary = await salaryData.getSalaryByEmpId(adminEmployeeId);

    const addAdminSal = await salaryData.addSalaryBreakdown(adminSalary);

    const hrUser = await userData.create(hrCreationInfo);
    console.log(hrUser);


    const createHrBene = await salaryData.createBenefits(hrEmployeeId, hrBenifitOption, hrData)

    const createHrSal = await salaryData.createSalary(hrEmployeeId, hrSalaryData)
    const hrSalary = await salaryData.getSalaryByEmpId(hrEmployeeId);

    const addHrSal = await salaryData.addSalaryBreakdown(hrSalary);

    const empUser1 = await userData.create(employeeCreationInfo1);
    console.log(empUser1);

    const empUser1EmpId = empUser1.employeeId.toString();

    const empUser1Task = await boardData.createSalaryBenifits(empUser1EmpId);

    console.log(empUser1Task);
    console.log('Seed Done.');
    // Close the database connection
    await closeConnection();
};

run();


