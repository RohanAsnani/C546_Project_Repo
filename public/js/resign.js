(function ($) {

    let resignForm = $('#resign-form'),
        resignReason = $('#resignReason'),
        errorList = $('#errorList'),
        errorDiv = $('#error');

    errorList.hide();
    errorList.empty();
    errorDiv.hide();
    errorDiv.empty();

    resignForm.submit(function (event) {

        let errors = [];
        let inputsArr = [resignReason];
        let inputNamesArr = ['Resignation Reason'];
        errorDiv.hide();
        errorDiv.textContent = "";
        for (let i = 0; i < inputsArr.length; i++) {
            try {
                checkUndefinedOrNull(inputsArr[i], inputNamesArr[i]);
                inputsArr[i] = checkisValidString(inputsArr[i], inputNamesArr[i]);

            } catch (e) {
                errors.push(e);
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
            event.preventDefault();
            //return;
        } else {
            errorList.hide();
            errorList.empty();
            errorDiv.hide();
            errorDiv.empty();
        }
        //event.preventDefault();

    });

    const checkUndefinedOrNull = (obj, variable) => {
        if (obj === undefined || obj === null) throw `All fields need to have valid values. Input for '${variable || 'provided variable'}' param is undefined or null.`;
    };

    const checkisValidString = (str, variable) => {
        str = str.val().trim();
        if ((str.length) === 0) throw new Error(`Input '${variable || 'provided'}' has just spaces or is an empty string.`);
    };

})(window.jQuery);