const BoardingSchema = {
  "_id": new ObjectId(),
  "employeeId": ObjectId(),
  "on": [
    {
      "taskName": String,
      "dueDate": Date,
      "completedOn": Date
    }
  ],
  "off": [
    {
      "taskName": String,
      "dueDate": Date,
      "completedOn": Date
    }
  ]
}