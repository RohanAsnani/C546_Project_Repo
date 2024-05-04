const userSchema = {
  _id: ObjectId(),
  firstname: String,
  lastname: String,
  employeeId: String,
  username: String,
  password: String,
  gender: String,
  married: String,
  department: String,
  role: String,
  notes: [
    {
      _id: new ObjectId(), //note Id
      reviewerId: ObjectId(),
      noteText: [String],
      noteDate: Date,
      //boolean flag for user to acknowledge the note
    },
  ],
  status: String,
  vet: String,
  disable: String,
  race: String,
  countryOfOrigin: String,
  startDate: Date,
  endDate: Date,
  dateOfBirth: Date,
  currentPosition: String,
  currentSalary: Number,
  promoDate: Date,
  // "appraisal": [
  //   {
  //     "_date": Date,
  //     "_sal": Number
  //   }
  // ],

  //previousPos to be removed??
  previousPos: [
    {
      pos: String,
      promoDate: Date,
      posEndDate: Date,
      salary: Number,
      //     "_sal": Number
      // "_appraisal": [
      //   {
      //     "_date": Date,
      //     "_sal": Number
      //   }
      // ]
    },
  ],
  // "performance": [
  //   {
  //     "_reviewerId": String,
  //     "_reviewDate": Date,
  //     "_rating": Number,
  //     "_review": String
  //   }
  // ],
  contactInfo: {
    phone: String,
    email: String,
    primaryAddress: String,
    secondaryAddress: String,
  },
  subordinates: [ObjectId()],
  managerId: ObjectId(),
  leave: [
    {
      objectId: ObjectId(),
      employeeID: string,
      _start: Date,
      _end: Date,
      _type: String,
      commentsEmployee: String,
      _status: String,
      commentsReviewer: String,
      Reviewer_ID: ObjectId(),
    },
  ],
  leaveBank: {
    sickDay: Number,
    vacation: Number,
  },
  // "leave": [
  //   {
  //     "start": Date,
  //     "end": Date,
  //     "type": String,
  //     "status": String,
  //     "reviewerId" : ObjectId()
  //   }
  // ],
};

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


*/
