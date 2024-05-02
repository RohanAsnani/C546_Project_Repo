const salarySchema = {
  "_id": new ObjectId(),
  "employeeId": String,
  "ssn": Number,
  "bankAccount": {
    "accountNo": Number,
    "routingNo": Number,
    "paymentType": String,
  },
  "salaryBreakdown": [
    {
      "position": String,
      "basePay": Number,
      "federalTax": Number,
      "stateTax": Number,
      "socialSec": Number,
      "startDate": Date,
      "endDate": Date,
      "billingAddress": String,
      "deductions": [
        {
          "typeOf": String, // Provident, Insurance, etc.
          "amount": Number,
        }
      ],
      "bonus": [
        {
          "typeOf": String, // Annual bonus, Retention, Miscellaneous, Performance
          "amount": Number,
        }
      ],
      // Total compensation calculation: basePay + bonus - deductions
      "totalComp": Number, // Placeholder, actual calculation should be handled in application logic
      "slipURL": String // URL to the salary slip
    }
  ]
};

