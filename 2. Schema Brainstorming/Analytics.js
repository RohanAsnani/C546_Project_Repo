const analytics= {
    "_id": ObjectId(),
    "Last_update": Date, // When the analytics were last updated
    "totalEmployees": Number,
    "averageTenure": Number,
    "diversityIndex": {"Vet":Number,"Disable":Number,"Ethincity_Namee":String},  // just a gist  /// ADD TO USER 
    "churnRate": Number,
    "absentism_Ratee": Number,
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
    "IncompleteTasks_by_Percent" : Number
    
}

  //// Just a thought 

// Employees left to complete their hr related tasks 
const suggestions ={
 
   
}