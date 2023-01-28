
jQuery.validator.addMethod("notOnlyZero", function (value, element, param) {
    return this.optional(element) || parseInt(value) > 0;
});

$("#post-task-form").validate({
    rules: {
        task_name: {
            required: true,
        },
        location: {
            required: true,
        },
        min_budget: {
            required: true,
            notOnlyZero: '0'

        },
        max_budget: {
            required: true,
            notOnlyZero: '0'
        },
        description: {
            required: true,
        },
    },
    messages: {
        task_name: {
            required: 'Task name is Required',
        },
        category: {
            required: 'Category is required',
        },
        location: {
            required: 'Location is required',
        },
        min_budget: {
            required: 'Minimum is required',
            notOnlyZero: 'Value should not be 0',
        },
        max_budget: {
            required: 'Maximum is required',
            notOnlyZero: 'Value should not be 0',
        },
        description: {
            required: 'Description is required',
        }

    }
});