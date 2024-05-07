import * as validation from "../helpers.js"
import { salary } from "../config/mongoCollections.js"
import { benefits } from "../config/mongoCollections.js"
import { calculateTaxRate } from "../util/salaryFunc.js"
import bcrypt from 'bcryptjs';
import { ObjectId } from "mongodb"
import cron from 'node-cron';

const exportedMethods = {
    async createSalary(employeeId, data) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        data.ssn = validation.numberExistandType(data.ssn, 'SSN', true);
        let ssnLast4 = String(data.ssn).slice(-4);
        data.ssn = await bcrypt.hash(String(data.ssn), 12);
        data.hourlyPay = validation.numberExistandType(data.hourlyPay, 'Hourly Pay', false);
        validation.numberRange(data.hourlyPay, 'Hourly Pay', 15.13, 200);
        data.account_No = validation.numberExistandType(data.accountNo, 'Account Number', true);
        let account_NoLast4 = String(data.accountNo).slice(-4);
        data.account_No = await bcrypt.hash(String(data.account_No), 12);
        data.routing_No = validation.numberExistandType(data.routingNo, 'Routing Number', true);
        data.paymentType = validation.checkStrCS(data.paymentType, 'Payment Type', 0, 100, false);
        data.billingAddress = validation.checkStrCS(data.billingAddress, 'Billing Address', 10, 100, true);
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
            federalTaxbracket = calculateTaxRate(yearlyPay, fedtax, fedtaxrate);
            stateTaxBracket = calculateTaxRate(yearlyPay, statetax, statetaxrate);
        }
        else{
            let fedtax = [0, 11600, 47150, 100525, 191950, 243725, 609350];
            let fedtaxrate = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
            let statetax = [0, 20000, 35000, 40000, 75000, 500000, 1000000];
            let statetaxrate = [0.014, 0.0175, 0.035, 0.05525, 0.0637, 0.0897, 0.1075];
            federalTaxbracket = calculateTaxRate(yearlyPay, fedtax, fedtaxrate);
            stateTaxBracket = calculateTaxRate(yearlyPay, statetax, statetaxrate);
        }
        const salaryCollection = await salary();
        const newSalary = {
            employeeId: employeeId,
            ssnLast4: ssnLast4,
            SSN: data.ssn,
            bankAccount: {
                account_NoLast4: account_NoLast4,
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
        return insertInfo.insertedId;
    },
    async getSalaryBreakdown(employeeId,_id) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const salaryCollection = await salary();
        const salaryData = await salaryCollection.findOne({ employeeId: employeeId }, { projection: { _id: 0, SSN: 0, bankAccount: {accountNo: 0}} });
        //handle hashed values

        if (salaryData === null) throw new Error('Salary not found');
        salaryData.SSN = '***-**-' + salaryData.ssnLast4;
        salaryData.bankAccount.accountNo = '********' + salaryData.bankAccount.account_NoLast4;
        const breakdown = salaryData.salaryBreakdown.find(breakdown => breakdown._id.toString() === _id);
        if (!breakdown) throw new Error('Salary breakdown not found');
        salaryData.salaryBreakdown = breakdown;
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
        let startDate = validation.getLaterDate(-21);
        let endDate = validation.getLaterDate(-7);
        let benifitsCollection = await benefits();
        let deductions = await benifitsCollection.findOne({employeeId: check.employeeId}, {projection: {benefeciary: 1}});
        let benifits_amount = deductions.benefeciary.length * 50;
        let totalComp = basePay - benifits_amount- federalTax - stateTax;
        let newID = new ObjectId();
        let payDay = validation.getCurrDate();
        const newSalaryBreakdown = {
            _id: newID,
            position: check.position,
            basePay: basePay,
            federalTax: federalTax,
            stateTax: stateTax,
            startDate: startDate,
            endDate: endDate,
            billingAddress: check.billingAddress,
            benifits_amount: deductions.benefeciary.length*50,
            totalComp: totalComp,
            payDay: payDay,
        }
        console.log(newSalaryBreakdown);
        const salaryCollection = await salary();
        const updateInfo = await salaryCollection.updateOne({employeeId: check.employeeId}, {$push: {salaryBreakdown: newSalaryBreakdown}});
        if (updateInfo.modifiedCount === 0) throw new Error('Could not add salary breakdown. Please try again');
        // const salaryData = await this.getSalary(employeeId);
        return {success: true /*salaryData*/};
    },

    async getSalaryByEmpId(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const salaryCollection = await salary();
        const salaryData = await salaryCollection.findOne({ employeeId: employeeId }, { projection: { _id: 0} });
        if (salaryData === null) throw new Error('Salary not found');
        salaryData.SSN = '***-**-' + salaryData.ssnLast4;
        salaryData.bankAccount.accountNo = '********' + salaryData.bankAccount.account_NoLast4;
        return salaryData;
    },
    async generateSalaryBreakdown() {
    try {
        console.log('Generating salary breakdowns...');
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
},
    async createBenefits(employeeId, benifitOption, data) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        const term_start_date = validation.getLaterDate(7);
        const term_end_date = validation.getLaterDate(372);
        const opted = benifitOption;
        const opted_date = validation.getCurrDate();

        const benefitsCollection = await benefits();
        const newBenefits = {
            employeeId: employeeId,
            term_start_date: term_start_date,
            term_end_date: term_end_date,
            opted: opted,
            opted_date: opted_date,
            benefeciary: data
        }
        const check = await benefitsCollection.findOne({ employeeId: employeeId });
        if (check) throw new Error('Benefits for this employee already exists');
        const insertInfo = await benefitsCollection.insertOne(newBenefits);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add benefits details. Please try again');
        return insertInfo.insertedId;
    },    
    async optOutBenefits(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'Employee Id', 0, 100, true);
        const term_start_date = validation.getLaterDate(7);
        const term_end_date = validation.getLaterDate(365);
        const opted = 'optOut'
        const opted_date = validation.getCurrDate();
        const benefitsCollection = await benefits();
        const newBenefits = {
            employeeId: employeeId,
            term_start_date: term_start_date,
            term_end_date: term_end_date,
            opted: opted,
            opted_date: opted_date,
            benefeciary: []
        }
        const check = await benefitsCollection.findOne({ employeeId: employeeId });
        if (check) throw new Error('Benefits for this employee already exists');
        const insertInfo = await benefitsCollection.insertOne(newBenefits);
        if (insertInfo.insertedCount === 0) throw new Error('Could not add benefits details. Please try again');
        return insertInfo.insertedId;
    },
    async getBenefitsByEmpId(employeeId) {
        employeeId = validation.checkStrCS(employeeId, 'employeeId');
        const benefitsCollection = await benefits();
        const benefitsData = await benefitsCollection.findOne({ employeeId: employeeId }, { projection: { _id: 0} });
        if (benefitsData === null) throw new Error('Benefits not found');
        return benefitsData;
    },      
}

// Schedule generateSalaryBreakdown to run every minute
//cron.schedule('* * * * *', exportedMethods.generateSalaryBreakdown.bind(exportedMethods));
// Schedule generateSalaryBreakdown to run on the 14th and 29th of each month
cron.schedule('0 0 14,29 * *', exportedMethods.generateSalaryBreakdown);

// Schedule generateSalaryBreakdown to run on the 28th of February
cron.schedule('0 0 28 2 *', exportedMethods.generateSalaryBreakdown);

export default exportedMethods;