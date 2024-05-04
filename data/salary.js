import * as validation from "../helpers.js"
import { salary } from "../config/mongoCollections.js"
import { calculateTax } from "../util/salaryFunc.js"
import { ObjectId } from "mongodb"

const exportedMethods = {
    async createSalary(employeeId, data) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, false);
        data.ssn = validation.numberExistandType(data.ssn, 'SSN', true);
        data.hourlyPay = validation.numberExistandType(data.hourlyPay, 'Hourly Pay', false);
        validation.numberRange(data.hourlyPay, 'Hourly Pay', 15.13, 200);
        data.account_No = validation.numberExistandType(data.accountNo, 'Account Number', true);
        data.routing_No = validation.numberExistandType(data.routingNo, 'Routing Number', true);
        data.paymentType = validation.checkStrCS(data.paymentType, 'Payment Type', 0, 100, false);
        data.billingAddress = validation.checkStrCS(data.billingAddress, 'Billing Address', 0, 200, false);
        data.position = validation.checkStrCS(data.position, 'Position', 0, 100, false);
        // send hourly pay some how
        let yearlyPay = data.hourlyPay * 40 * 52;
        let federalTaxbracket = 0.1;
        let stateTaxBracket = 0.014;
        if (data.maritalStatus === 'Married'){
            let fedtax = [0, 23200, 94300, 201050, 383900, 487450, 731200];
            let statetax = [0, 20000, 50000, 70000, 80000, 150000, 500000, 1000000];
            let fedtaxrate = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
            let statetaxrate = [0.014, 0.0175, 0.0245, 0.035, 0.05525, 0.0637, 0.0897, 0.1075];
            federalTaxbracket = calculateTax(yearlyPay, fedtax, fedtaxrate);
            stateTaxBracket = calculateTax(yearlyPay, statetax, statetaxrate);
        }
        else{
            let fedtax = [0, 11600, 47150, 100525, 191950, 243725, 609350];
            let fedtaxrate = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
            let statetax = [0, 20000, 35000, 40000, 75000, 500000, 1000000];
            let statetaxrate = [0.014, 0.0175, 0.035, 0.05525, 0.0637, 0.0897, 0.1075];
            federalTaxbracket = calculateTax(yearlyPay, fedtax, fedtaxrate);
            stateTaxBracket = calculateTax(yearlyPay, statetax, statetaxrate);
        }
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
            federalTaxbracket: federalTaxbracket,
            stateTaxBracket: stateTaxBracket,
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
    },
    // just get surface data
    async getSalary(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const salaryCollection = await salary();
        const salaryData = await salaryCollection.findOne({ employeeId: employeeId }, { projection: { _id: 0, salaryBreakdown: 0} });
        if (salaryData === null) throw new Error('Salary not found');
        return salaryData;
    },
    //for emplyee to update their own salary
    async updateSalaryEmployee(employeeId, data) {
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
    async addSalaryBreakdown (check) {
        const basePay = check.hourlyPay*40;
        const federalTax = basePay*check.federalTaxbracket;
        const stateTax = basePay*check.stateTaxBracket;
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(endDate.getDate() - 7);
        startDate.setDate(startDate.getDate() - 21);
        // add leave days deductions and benifits
        let deductions = [
            {
                _typeOf: 'Insurance',
                _amount: 100
            }
        ]
        let totalComp = basePay - deductions[0]._amount;
        newID = ObjectId();
        payDay = new Date();
        const newSalaryBreakdown = {
            _id: newID,
            position: check.position,
            basePay: basePay,
            federalTax: federalTax,
            stateTax: stateTax,
            startDate: startDate,
            endDate: endDate,
            billingAddress: check.billingAddress,
            deductions: deductions,
            totalComp: totalComp,
            payDay: payDay,
            slipURL: ''
        }
        console.log(newSalaryBreakdown);
        // const salaryCollection = await salary();
        // const updateInfo = await salaryCollection.updateOne({employeeId: check.employeeId}, {$push: {salaryBreakdown: newSalaryBreakdown}});
        // if (updateInfo.modifiedCount === 0) throw new Error('Could not add salary breakdown. Please try again');
        // const salaryData = await this.getSalary(employeeId);
        return {success: true, /*salaryData*/};
    },
    async getSalaryBreakdown(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const salaryCollection = await salary();
        const salaryData = await salaryCollection.findOne({ employeeId: employeeId }, { projection: { _id: 0, employeeId:1, salaryBreakdown: 1} });
        if (salaryData === null) throw new Error('Salary not found');
        return salaryData;
    },
    async generateSalaryBreakdown() {
        try {
            const salaryCollection = await salary();
            const allSalaries = await salaryCollection.find({}).toArray();
            for (let i = 0; i < allSalaries.length; i++) {
                let check = allSalaries[i];
                let newSalaryBreakdown = await this.addSalaryBreakdown(check);
                if (!newSalaryBreakdown.success) console.log(`Could not add salary breakdown for ${check.employeeId}`);
            }
        } catch (error) {
            console.error(`An error occurred while generating salary breakdowns: ${error.message}`);
        }
    }

}

export default exportedMethods;