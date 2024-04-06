const benefits_OptIn = {
    employeeId: ObjectID(),
    selection_term_start_date: Date,
    selection_term_end_date: Date,
    selection_window_start_date: Date,
    selection_window_end_date: Date,
    Opted_date: Date,
    benefeciary: [{
        benefeciary_name: String,
        benefeciary_doc_type: String,
        benefeciary_doc_id: String,
        // Opted: Boolean
    }]
}