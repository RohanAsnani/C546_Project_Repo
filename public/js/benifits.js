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

    $('#benefitsForm').submit(function (e) {
        e.preventDefault();
        let errorList = $('#errorList'),
            errorDiv = $('#error');
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
        errorDiv.hide();
        errorDiv.textContent = "";
        let errors = [];
        if (formattedData.beneficiaries) {
            let currDate = getCurrDate();
            let beneArr = formattedData.beneficiaries;
            for (let i = 0; i < beneArr.length; i++) {
                let currBene = beneArr[i];

                let beneEmail = currBene.benefeciary_email;
                let beneAddr = currBene.benefeciary_address;
                let beneDOB = currBene.benefeciary_dob;
                let beneName = currBene.benefeciary_name;
                let benePh = currBene.benefeciary_phone;
                let beneRel = currBene.benefeciary_relation;

                try {
                    isValidEmail(beneEmail);
                } catch (e) {
                    errors.push(e);
                }

                try {
                    checkStr(beneAddr, 'Beneficiary Address', 5, 200, true);
                }
                catch (e) {
                    errors.push(e);
                }

                try {
                    if (!beneDOB) throw new Error('Date Of Birth Needed.');
                    let dob = new Date(beneDOB);
                    let startDate = new Date(currDate);
                    if (startDate <= dob) throw new Error('Date of Birth cannot be a current or future dates.');
                } catch (e) {
                    errors.push(e)
                }

                try {
                    checkStrCS(beneName, 'Beneficiary Name', 2, 20, false, false);
                } catch (e) {
                    errors.push(e);
                }

                try {
                    isValidPhoneNumber(benePh);
                }
                catch (e) {
                    errors.push(e);
                }

                try {
                    checkState(beneRel, 'Beneficiary Relation', ['Spouse', 'Daughter', 'Son', 'Mother', 'Father']);
                } catch (e) {
                    errors.push(e);
                }
            }
        }

        if (errors.length > 0) {
            let listE = "";
            for (let i = 0; i < errors.length; i++) {
                let err = `<li>${errors[i]}</li>`;
                listE = listE + err;
            }
            let listEle = $(`${listE}`);

            errorList.append(listEle);
            errorList.show();
            e.preventDefault();
            return;
        } else {
            errorList.hide();
            errorList.empty();
            errorDiv.hide();
            errorDiv.empty();
        }

        $.ajax({
            type: 'POST',
            url: '/hrc/employee/selectBenifitsForm',
            data: formattedData,
            success: function (response) {
                if (response.success) {
                    alert('Benefits saved successfully.');
                    window.location.href = '/hrc/employee/getAllToDoByEmpId';
                } else {
                    alert('An error occurred: ' + response.message);
                }
            }
        });
    });

    const isValidEmail = (email) => {
        email = checkStr(email, 'Email', 5, 35, true);
        if (!(email.includes('@'))) throw new Error('Email id should contain @ in it.');
        let firstIndex = email.indexOf('@');
        let lastIndex = email.lastIndexOf('@');
        if (firstIndex !== lastIndex) throw new Error("Email Id cannot contain more than one '@'.")

        if (!(email.endsWith('.com'))) throw new Error("Email Id should end with '.com'");
        return email
    }

    const checkStr = (str, param, minLen, maxLen, containNum, containSpecialChar) => {
        if (!(typeof (str) === 'string')) throw new Error(`${param} needs to be string type.`)
        if (!str) throw new Error(`${param} cannot be empty or just blank spaces.`);
        str = str.trim()
        str = str.toLowerCase();
        if (str.length === 0) throw new Error(`${param} cannot be empty or be just spaces.`);
        if (containNum === false) {
            if (/\d/.test(str)) throw new Error(`${param} cannot have any numbers in it.`);
        }
        if (containSpecialChar === false) {
            if (/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(str)) throw new Error(`${param} cannot have special characters in it.`);
        }
        if (!(!minLen && !maxLen))
            if (!(minLen <= str.length && str.length <= maxLen)) throw new Error(`${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`);
        return str
    }

    const getCurrDate = () => {
        const currentDate = new Date();

        // Get the current date components
        const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
        const day = currentDate.getDate();
        const year = currentDate.getFullYear();

        // Format the date as desired
        const formattedDate = `${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}/${year}`;

        console.log(formattedDate);
        return formattedDate;
    }

    const checkStrCS = (str, param, minLen, maxLen, containNum, containSpecialChar) => {
        if (!(typeof (str) === 'string')) throw new Error(`${param} needs to be string type.`)
        if (!str) throw new Error(`${param} needed.`);
        str = str.trim()
        if (str.length === 0) throw new Error(`${param} cannot be empty or just spaces.`);
        if (containNum === false) {
            if (/\d/.test(str)) throw new Error(`${param} cannot have any numbers in it.`);
        }
        if (containSpecialChar === false) {
            if (/[!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]/.test(str)) throw new Error(`${param} cannot have special characters in it.`);
        }
        if (!(!minLen && !maxLen))
            if (!(minLen <= str.length && str.length <= maxLen)) throw new Error(`${param} should be atleast ${minLen} characters and max ${maxLen} characters long.`);
        return str
    }

    const isValidPhoneNumber = (phoneNumber) => {
        if (typeof (phoneNumber) !== 'string') throw new Error('Date is not in proper data type.');
        let regex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
        if (!(regex.test(phoneNumber))) throw new Error('Phone Number must be in format 012-345-6789');
        return phoneNumber
    }

    const checkState = (val, param, arr) => {
        if (!(typeof (val) === 'string')) throw new Error(`${param} needs to be string type.`)
        val = val.trim();
        if (!(arr.includes(val))) throw new Error(`${param} should be ${[...arr]} nothing else.`);
        return val

    }

});