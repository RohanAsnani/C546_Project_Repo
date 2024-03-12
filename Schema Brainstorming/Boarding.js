const BoardingSchema =  {
    "_id": ObjectId(),
    "employeeId": ObjectId(),
    "on": [
      {
        "task_name": String,
        "Due_Date": Date,
        "Completed_on": Date
      }
    ],
    "off": [
      {
        "task_name": String,
        "Due_Date": Date,
        "Completed_on": Date
      }
    ]
  }