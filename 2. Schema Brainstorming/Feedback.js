const feedback = {
    //Only to be visible to HR's
    "_id": new Object(),
    "type": String,// Can be a drop down or a subject line
    "feedback_text": String,
    "feedback_date": Date,
    "role": String,//validate that current user is HR
    "status": String // To Do/In progress/ Completed/ Declined
}

