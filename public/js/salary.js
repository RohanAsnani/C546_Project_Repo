(function ($) {

    let salaryForm = $('#salary-form'),
        ssn = $('#ssn'),
        accountNo = $('#accountNo'),
        routingNo = $('#routingNo'),
        dueDate = $('#dueDate'),
        //taskType = $('input[name="taskType"]'),
        billingAddress = $('#billingAddress'),
        paymentType = $('#paymentType'),
        errorList = $('#errorList'),
        errorDiv = $('#error');

    errorList.hide();
    errorList.empty();
    errorDiv.hide();
    errorDiv.empty();

    salaryForm.submit(function (event) {

        let errors = [];
        errorList.hide();
        errorList.empty();
        errorDiv.hide();
        errorDiv.empty();
        errorDiv.textContent = "";

        try {
            let ssnVal = ssn.val().trim();
            checkStrCS(ssnVal, 'SSN', 9, 9, true);
        } catch (e) {
            errors.push(e);
        }

        try {
            let accountNoVal = accountNo.val().trim();
            checkStrCS(accountNoVal, 'Account Number', 8, 12, true);
        } catch (e) {
            errors.push(e);
        }

        try {
            let routingNoVal = routingNo.val().trim();
            checkStrCS(routingNoVal, 'Routing Number', 9, 9, true);
        } catch (e) {
            errors.push(e);
        }

        try {
            let billingAddressVal = billingAddress.val().trim();
            checkStrCS(billingAddressVal, 'Billing Address', 10, 100, true);
        } catch (e) {
            errors.push(e);
        }

        try {
            let paymentTypeVal;
            if (paymentType) {
                paymentTypeVal = paymentType.val().trim();
            } else {
                paymentTypeVal = '';
            }
            if (!(paymentTypeVal === 'direct deposit' || paymentTypeVal === 'check')) {
                throw new Error('Invalid Payment Type');
            }
        } catch (e) {
            errors.push(e);
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
            event.preventDefault();
            return;
        } else {
            errorList.hide();
            errorList.empty();
            errorDiv.hide();
            errorDiv.empty();
        }

    });

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

    const checkisValidString = (str, variable) => {
        str = str.val().trim();
        if ((str.length) === 0) throw new Error(`Input '${variable || 'provided'}' has just spaces or is an empty string.`);
        return str;
    };

})(window.jQuery);