(function ($) {

    let createTaskForm = $('#createTask-form'),
        taskName = $('#taskName'),
        taskDesc = $('#taskDesc'),
        dueDate = $('#dueData'),
        taskType = $('#taskType'),
        errorList = $('#errorList'),
        errorDiv = $('#error');

    errorList.hide();
    errorDiv.hide();

    createTaskForm.submit(function (event) {


        // taskName = taskName.val().trim();
        // taskDesc = taskDesc.val().trim();
        // dueDate = dueDate.val().trim();
        // taskType = taskType.val().trim();

        let errors = [];
        let inputsArr = [taskName, taskDesc, dueDate, taskType];
        let inputNamesArr = ['Task Name', 'Task Description', 'Due Date', 'Task Type'];
        errorDiv.hide();
        errorDiv.textContent = "";
        for (let i = 0; i < inputFieldsArr.length; i++) {
            try {
                checkUndefinedOrNull(inputsArr[i], inputNamesArr[i]);
                inputsArr[i] = checkisValidString(inputFieldsArr[i], inputNamesArr[i]);
                if (inputNamesArr[i] === 'Due Date') {
                    inputsArr[i] = dateFormat(inputsArr[i], 'Due Date');
                }
            } catch (e) {
                errors.push(e);
            }
        }

        if (errors.length > 0) {
            let listEle = $(`${errors.map(function (error) {
                return `< li >
                ${error}                        
                </li > `;
            })}  `);

            errorList.append(listEle);
            errorList.show();
            return;
            //event.preventDefault();
        }

        //set up AJAX request config
        // let requestConfig = {
        //     method: 'POST',
        //     url: '/createTask',
        //     contentType: 'application/json',
        //     body: JSON.stringify({
        //         taskName: taskName,
        //         taskDesc: taskDesc,
        //         dueData: dueDate,
        //         taskType: taskType,
        //     })
        // };
        event.preventDefault();

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
        str = str.trim();
        if ((str.length) === 0) throw `Input '${variable || 'provided'}' has just spaces or is an empty string.`;
    };
})(window.jQuery);