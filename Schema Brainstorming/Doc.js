const Doc = {
    "_id": ObjectId(),
    "Emp_id": ObjectId(),
    "Documents" : [
        {
            "type_of_doc":String,
            "Doc_url": String,
            "Status": String,
            "SubmittedOn": Date,
            "approvedby": ObjectId()

        }

    ]


}