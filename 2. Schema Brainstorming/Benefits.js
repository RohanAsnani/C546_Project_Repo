const benefits_OptIn = {
    employeeId: ObjectID(),
    term_start_date: Date,
    term_end_date: Date,
    window_start_date: String,
    window_end_date: String,
    opted: Boolean,
    opted_date: Date,
    benefeciary: [{
        benefeciary_name: String,
        benefeciary_relation: String,
        benefeciary_dob: Date,
        benefeciary_address: String,
        benefeciary_email: String,
        benefeciary_phone: String
    }]
}