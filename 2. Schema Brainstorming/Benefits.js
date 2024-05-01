const benefits_OptIn = {
    "employeeId": ObjectID(),
    "selectionTermStartDate": Date,
    "selectionTermEndDate": Date,
    "selectionWindowStartDate": Date,
    'selectionWindowEndDate': Date,
    "optedDate": Date,
    "beneficiary": [{
        "beneficiaryName": String,
        "beneficiaryDocType": String,
        "beneficiaryDocId": String
        // Opted: Boolean
    }]
}