$(document).ready(function() {
    var beneficiaryCount = 1;

    $('.firstBeneficiaryRemove').hide();

    $('input[type=radio][name=benefitOption]').change(function() {
        if (this.value == 'optInPartner' || this.value == 'optInFamily') {
            $('#beneficiaryDetails').show();
            if (this.value == 'optInFamily') {
                $('#addBeneficiary').show();
                $('.removeBeneficiary').not('.firstBeneficiaryRemove').show();
                $('.beneficiaryField select').html('<option value="Spouse">Spouse</option>' +
                                                   '<option value="Daughter">Daughter</option>' +
                                                   '<option value="Son">Son</option>' +
                                                   '<option value="Mother">Mother</option>' +
                                                   '<option value="Father">Father</option>');
            } else {
                $('#addBeneficiary').hide();
                $('.removeBeneficiary').hide();
                $('.beneficiaryField select').html('<option value="Spouse">Spouse</option>');
                while ($('.beneficiaryField').length > 1) {
                    $('.beneficiaryField').last().remove();
                    beneficiaryCount--;
                }
            }
        } else {
            $('#beneficiaryDetails').hide();
        }
    });

    $('#addBeneficiary').click(function() {
    beneficiaryCount++;
    var newField = '<div class="beneficiaryField">' +
                   '<label for="beneficiaryName' + beneficiaryCount + '">Beneficiary Name:</label>' +
                   '<input type="text" id="beneficiaryName' + beneficiaryCount + '" name="beneficiaryName' + beneficiaryCount + '">' +
                   '<label for="beneficiaryRelation' + beneficiaryCount + '">Relation:</label>' +
                   '<select id="beneficiaryRelation' + beneficiaryCount + '" name="beneficiaryRelation' + beneficiaryCount + '">' +
                   '<option value="Spouse">Spouse</option>' +
                   '<option value="Daughter">Daughter</option>' +
                   '<option value="Son">Son</option>' +
                   '<option value="Mother">Mother</option>' +
                   '<option value="Father">Father</option>' +
                   '</select>' +
                   '<label for="beneficiaryDob' + beneficiaryCount + '">Date of Birth:</label>' +
                   '<input type="date" id="beneficiaryDob' + beneficiaryCount + '" name="beneficiaryDob' + beneficiaryCount + '">' +
                   '<label for="beneficiaryAddress' + beneficiaryCount + '">Address:</label>' +
                   '<input type="text" id="beneficiaryAddress' + beneficiaryCount + '" name="beneficiaryAddress' + beneficiaryCount + '">' +
                   '<label for="beneficiaryEmail' + beneficiaryCount + '">Email:</label>' +
                   '<input type="email" id="beneficiaryEmail' + beneficiaryCount + '" name="beneficiaryEmail' + beneficiaryCount + '">' +
                   '<label for="beneficiaryPhone' + beneficiaryCount + '">Phone:</label>' +
                   '<input type="tel" id="beneficiaryPhone' + beneficiaryCount + '" name="beneficiaryPhone' + beneficiaryCount + '">' +
                   '<button type="button" class="removeBeneficiary">Remove</button>' +
                   '</div>';
    $(newField).appendTo('#beneficiaryDetails');
});

    $('#beneficiaryDetails').on('click', '.removeBeneficiary', function() {
        $(this).parent().remove();
        beneficiaryCount--;
    });

$('#benefitsForm').submit(function(e) {
    e.preventDefault();

    var data = $(this).serializeArray();
    var formattedData = {};
    var beneficiaries = [];
    var beneficiaryCount = 1;

    $.each(data, function(i, field) {
        formattedData[field.name] = field.value;
    });

    while (formattedData['beneficiaryName' + beneficiaryCount]) {
        beneficiaries.push({
            benefeciary_name: formattedData['beneficiaryName' + beneficiaryCount],
            benefeciary_relation: formattedData['beneficiaryRelation' + beneficiaryCount],
            benefeciary_dob: formattedData['beneficiaryDob' + beneficiaryCount],
            benefeciary_address: formattedData['beneficiaryAddress' + beneficiaryCount],
            benefeciary_email: formattedData['beneficiaryEmail' + beneficiaryCount],
            benefeciary_phone: formattedData['beneficiaryPhone' + beneficiaryCount]
        });
        delete formattedData['beneficiaryName' + beneficiaryCount];
        delete formattedData['beneficiaryRelation' + beneficiaryCount];
        delete formattedData['beneficiaryDob' + beneficiaryCount];
        delete formattedData['beneficiaryAddress' + beneficiaryCount];
        delete formattedData['beneficiaryEmail' + beneficiaryCount];
        delete formattedData['beneficiaryPhone' + beneficiaryCount];
        beneficiaryCount++;
    }

    formattedData.beneficiaries = beneficiaries;
    console.log(formattedData);
    // validation here
    
    $.ajax({
        type: 'POST',
        url: '/hrc/employee/selectBenifitsForm',
        data: formattedData,
        success: function(response) {
            if (response.success) {
                alert('Benefits saved successfully.');
                window.location.href = '/hrc/employee/getAllToDoByEmpId';
            } else {
                alert('An error occurred: ' + response.message);
            }
        }
    });
});

});