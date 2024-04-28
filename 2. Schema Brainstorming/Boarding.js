const BoardingSchema = {
  "_id": new ObjectId(),
  "employeeId": ObjectId(),
  "on": [
    {
      "_id": new ObjectId(),
      "taskName": String,
      "dueDate": Date,
      "completedOn": Date
    }
  ],
  "off": [
    {
      "_id": new ObjectId(),
      "taskName": String,
      "dueDate": Date,
      "completedOn": Date
    }
  ]
}