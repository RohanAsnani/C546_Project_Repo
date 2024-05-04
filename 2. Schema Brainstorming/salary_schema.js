const salarySchema = {
    _id: "New ObjectId()", 
    employeeId: "String",
    SSN: "Number", 
    bankAccount: {
      accountNo: "Number",
      routingNo: "Number",
      paymentType: "String", 
    },
    position: "String",
    hourlyPay: "Number",
    federalTaxbracket: "Number",
    stateTaxBracket: "Number",
    billingAddress: "String",
    salaryBreakdown: [
      {
        position: "String",
        basePay: "Number",
        federalTax: "Number",
        stateTax: "Number",
        startDate: "Date",
        endDate: "Date",
        billingAddress: "String",
        deductions: [
          {
            _typeOf: "String", // Provident, Insurance, etc.
            _amount: "Number",
          }
        ],
        // Total compensation calculation: basePay + bonus - deductions
        totalComp: "Number", // Placeholder, actual calculation should be handled in application logic
        slipURL: "String" // URL to the salary slip
      }
    ]
  };
  
  