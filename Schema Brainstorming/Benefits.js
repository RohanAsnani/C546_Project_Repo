const benefits_OptIn = {
    employeeId: ObjectID(),
    selection_term_start_date: Date,
    selection_term_end_date: Date,
    selection_window_start_date: Date,
    selection_window_end_date: Date,
    benefits: [{
        benefit_name: String,
        Opted: Boolean,
        Opted_date: Date,
    }]
}