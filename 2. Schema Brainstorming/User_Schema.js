  const userSchema = {
  "_id": ObjectId(), 
  "firstName": String,
  "lastName": String,
  "employeeId": String,
  "username": String,
  "password": String, 
  "gender": String,
  "maritalStatus": String,
  "department": String,
  "role": String,
  "notes": [{
    "_id": new ObjectId(),//note Id
    "_reviewerId": ObjectId(),
    "note_text": [String],
    "note_date": Date
    //boolean flag for user to acknowledge the note
  }],
  "status": String,
  "Vet": String,
  "disability": String,
  "Race": String,
  "Country_of_Origin":String,
  "startDate": Date,
  "endDate": Date,
  "dob": Date,
  "currentPosition": String,
  "currentSalary": Number,
  "promoDate": Date,
  // "appraisal": [
  //   {
  //     "_date": Date,
  //     "_sal": Number
  //   }
  // ],

  //previousPos to be removed??
  "previousPos": [
    {
      "_pos": String,
      "_promoDate": Date,
      "_posEndDate": Date,
      "_sal": Number
      //     "_sal": Number
      // "_appraisal": [
      //   {
      //     "_date": Date,
      //     "_sal": Number
      //   }
      // ]
    }
  ],
  // "performance": [
  //   {
  //     "_reviewerId": String,
  //     "_reviewDate": Date,
  //     "_rating": Number,
  //     "_review": String
  //   }
  // ],
  "contactInfo": {
    "phone": String, 
    "email": String,
    "primaryAddress": String,
    "secondaryAddress": String
  },
  "subordinates": [ObjectId()], 
  "managerId": ObjectId(),
  "leave": [
    {
      "_start": Date,
      "_end": Date,
      "_type": String,
      "_status": String,
      "Reviewer_ID" : ObjectId()
    }
  ],
  "leaveBank": {
    "sickDay": Number,
    "paternityLeave": Number,
    "maternityLeave": Number
  }
}



/// How we are tackling that which hr does the current employee belong too.
//// Notes update just 
/// DEPARTMENT AND HR RELATION SOMETHING LIKE THAT 
/*
Leaves and Leave Banks another collection
Leave Collection---------------------------
"leave": [
    {
      "objectId": ObjectId()
      "employeeID":string
      "_start": Date,
      "_end": Date,
      "_type": String,
      "commentsEmployee": String,
      "_status": String,
      'commentsReviewer': String,
      "Reviewer_ID" : ObjectId()
    }
  ]

  ------------------------------
  User's Collection
  "leaveBank": {
    "sickDay": Number,
    "vacation": Number
  }
its working

*/
