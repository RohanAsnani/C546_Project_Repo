const Doc = {
    "_id": new ObjectId(),
    "employeeId": ObjectId(),
    "documents": [
        {
            "typeOfDoc": String,
            "docUrl": String,
            "status": String,
            "submittedOn": Date,
            "approvedBy": ObjectId()
        }
    ]
}