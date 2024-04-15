const feedback = {
    //Only to be visible to HR's
    "_id": new ObjectId(),
    "type": String,// Can be a drop down or a subject line
    "feedbackText": String,
    "feedbackDate": Date,
    "role": String,//validate that current user is HR
    "status": String // To Do/In progress/ Completed/ Declined
}

