const benefits_OptIn = {
    employeeId: ObjectID(),
    term_start_date: Date,
    term_end_date: Date,
    window_start_date: String,
    window_end_date: String,
    Opted_date: Date,
    benefeciary: [{
        benefeciary_name: String,
        Opted: Boolean
    }]
}