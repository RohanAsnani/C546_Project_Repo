const userSchema = {
    "_id": ObjectId(), 
    "firstname": String,
    "lastname": String,
    "employeeid": String,
    "username": String,
    "password": String, 
    "gender": String,
    "married": String,
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
    "Disable": String,
    "Race": String,
    "Country_of_Origin":String,
    "startDate": Date,
    "endDate": Date,
    "DOB": Date,
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