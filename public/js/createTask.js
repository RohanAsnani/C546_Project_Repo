(function ($) {

    let createTaskForm = $('#createTask-form'),
        employeeId = $('#employeeId'),
        taskName = $('#taskName'),
        taskDesc = $('#taskDesc'),
        dueDate = $('#dueDate'),
        //taskType = $('input[name="taskType"]'),
        taskType = $('#taskType'),
        errorList = $('#errorList'),
        errorDiv = $('#error');

    errorList.hide();
    errorList.empty();
    errorDiv.hide();
    errorDiv.empty();

    createTaskForm.submit(function (event) {


        let errors = [];
        let inputsArr = [employeeId, taskName, taskDesc, dueDate, taskType];
        let inputNamesArr = ['Employee Id', 'Task Name', 'Task Description', 'Due Date', 'Task Type'];
        errorDiv.hide();
        errorDiv.textContent = "";
        for (let i = 0; i < inputsArr.length; i++) {
            try {
                checkUndefinedOrNull(inputsArr[i], inputNamesArr[i]);
                if (inputNamesArr[i] !== 'Due Date') {
                    inputsArr[i] = checkisValidString(inputsArr[i], inputNamesArr[i]);
                }
                if (inputNamesArr[i] === 'Due Date') {
                    let check = dateFormat(inputsArr[i].val().trim(), 'Due Date');
                    let year = check[0];
                    let month = check[1];
                    let date = check[2];
                    isValidDate(month, date, year, 'Due Date');
                }
                // if (inputNamesArr[i] === 'Task Type') {
                //     if (!(inputsArr[i][0].checked || inputsArr[i][1].checked)) {
                //         throw new Error(`Please select an option for task type`);
                //     }
                // }
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
    const dateFormat = (dateReleased, param) => {
        if (dateReleased.length !== 10) {
            throw new Error(`${(param)} is not in proper date format`)
        }
        let date = dateReleased.split('-').map(x => x)
        if (date.length !== 3) {
            throw new Error(`${(param)} is not in proper date format`)
        }
        return date
    };
    const checkisValidString = (str, variable) => {
        str = str.val().trim();
        if ((str.length) === 0) throw new Error(`Input '${variable || 'provided'}' has just spaces or is an empty string.`);
    };
    const isValidDate = (month, date, year, param) => {
        let Today = new Date()
        if (month.length !== 2 || date.length !== 2 || year.length !== 4) {
            throw new Error(`Parameter ${(param)} is not in proper date format`)
        }
        if (isNaN(month) || isNaN(date) || isNaN(year)) {
            throw new Error(`Parameter ${(param)} is not in proper date format`)
        }
        if (Number(year) < 0) {
            throw new Error(`parameter ${(param)} has an invalid ${year}`)
        }
        if (Number(month) < 1 || Number(month) > 12) {
            throw new Error(`Parameter ${(param)} has an invalid month ${month}`)
        }
        if (Number(date) < 1 || Number(date) > 31) {
            throw new Error(`Parameter ${(param)} has an invalid day ${date}`)
        }

        if (Number(month) == 2) {
            if (Number(date) > 28) {
                throw new Error(`Parameter ${(param)} has an invalid day value ${date} for February`)
            }
        } else {
            if (['04', '06', '09', '11'].includes(month)) {
                if (Number(date) > 30) {
                    throw new Error(`Parameter ${(param)} has an invalid day value ${date} for the month ${month}`)
                }
            }
        }

        if (Number(year) < Today.getFullYear()) {
            throw new Error(`Parameter ${(param)} cannot have a past date.`)
        }
        if (Number(year) === Today.getFullYear() && (Today.getMonth() + 1) > Number(month)) {
            throw new Error(`Parameter ${(param)} cannot have a past date.`)
        }
        if (Number(year) === Today.getFullYear() && (Today.getMonth() + 1) === Number(month) && Today.getDate() > Number(date)) {
            throw new Error(`Parameter ${(param)} cannot have a past date.`)
        }
    };
})(window.jQuery);