const analytics = {
  "_id": new ObjectId(),
  "lastUpdated": Date, // When the analytics were last updated
  "totalEmployees": Number,
  "averageTenure": Number,
  "diversityIndex": {
    "countVeteran": Number, // Number of Veterans
    "countDisable": Number, // Number of Disable people
    "ethincityType": [
      // An array to store the count of each ethnic race people in an object
      { "asian": Number },
      { "african": Number },
      { "white": Number },
      { "hispanic": Number },
    ],
  },
  "churnRate": Number,
  "absentismRatee": Number,
  "employeeBreakdown": {
    "byDepartment": [{ "department": String, "count": Number }], // department name and the count each department 
    "byRole": [{ "role": String, "count": Number }],  // same for role 
    "averageTenureByDepartment": [{ "department": String, "averageTenure": Number }]  /// each department by tenure avg
  },
  "demographics": {
    "byAge": [{ "ageRange": String, "count": Number }],
    "byGender": [{ "gender": String, "count": Number }],
    "byDepartment": [{ "department": String, "distribution": [{ "gender": String, "count": Number }] }]
  },
  "leaveAnalysis": {
    "peakTimes": [{ "month": String, "totalLeaves": Number }],
    "averageLeavesTaken": Number
  },
  "incompleteTasksByPercent": Number

}