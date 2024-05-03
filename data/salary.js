import * as validation from "../helpers.js"
import { salary } from "../config/mongoCollections.js"
import { ObjectId } from "mongodb"

const exportedMethods = {
    async createSalary(employeeId, data) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, false);
        data.ssn = validation.numberExistandType(data.ssn, 'SSN', true);
        data.hourlyPay = validation.numberExistandType(data.hourlyPay, 'Hourly Pay', true);
        data.account_No = validation.numberExistandType(data.accountNo, 'Account Number', true);
        data.routing_No = validation.numberExistandType(data.routingNo, 'Routing Number', true);
        data.paymentType = validation.checkStrCS(data.paymentType, 'Payment Type', 0, 100, false);
        data.billingAddress = validation.checkStrCS(data.billingAddress, 'Billing Address', 0, 200, false);
        data.position = validation.checkStrCS(data.position, 'Position', 0, 100, false);
        const salaryCollection = await salary();
        const newSalary = {
            employeeId: employeeId,
            SSN: data.ssn,
            bankAccount: {
                accountNo: data.account_No,
                routingNo: data.routing_No,
                paymentType: data.paymentType
            },
            position: data.position,
            hourlyPay: data.hourlyPay,
            billingAddress: data.billingAddress,
            salaryBreakdown: []
        }
        const check = await salaryCollection.findOne({ employeeId: employeeId });
        if (check) throw new Error('Salary for this employee already exists');
        const insertInfo = await salaryCollection.insertOne(newSalary);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add salary details. Please try again');
        const newId = insertInfo.insertedId;
        const salaryData = await this.getSalary(newId.toString());
        return salaryData;
    }
    ,
    async getSalary(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const salaryCollection = await salary();
        const salaryData = await salaryCollection.findOne({ employeeId: employeeId });
        if (salaryData === null) throw new Error('Salary not found');
        return salaryData;
    },
    async updateSalary(employeeId, data) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, false);
        
        let updatedSalary = {};

        if (data.accountNo) {
            data.account_No = validation.numberExistandType(data.accountNo, 'Account Number', true);
            updatedSalary['bankAccount.accountNo'] = data.account_No;
        }

        if (data.routingNo) {
            data.routing_No = validation.numberExistandType(data.routingNo, 'Routing Number', true);
            updatedSalary['bankAccount.routingNo'] = data.routing_No;
        }

        if (data.paymentType) {
            data.paymentType = validation.checkStrCS(data.paymentType, 'Payment Type', 0, 100, false);
            updatedSalary['bankAccount.paymentType'] = data.paymentType;
        }

        if (data.billingAddress) {
            data.billingAddress = validation.checkStrCS(data.billingAddress, 'Billing Address', 0, 200, false);
            updatedSalary['billingAddress'] = data.billingAddress;
        }

        const salaryCollection = await salary();
        const check = await salaryCollection.findOne({ employeeId: employeeId });
        if (!check) throw new Error('Salary for this employee does not exist');
        const updateInfo = await salaryCollection.updateOne({ employeeId: employeeId }, { $set: updatedSalary });
        if (updateInfo.modifiedCount === 0) throw new Error('Could not update salary details. Please try again');
        const salaryData = await this.getSalary(employeeId);
        return salaryData;
    },
}

export default exportedMethods;