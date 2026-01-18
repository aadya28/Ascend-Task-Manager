// ========================================
// TASK OPERATIONS
// Handles task create, rename, delete, copy, status update, and dropdown actions
// ========================================

$(document).ready(function() {

    // Function to create a Task.
    $(document).on('submit', '.add-task-form', function(e) {
        e.preventDefault();
        var taskTitle = $(this).find('[name="task_title"]').val();
        console.log(taskTitle);
        var submitTaskButton = $(this).find('.add-task-button');
        var listId = submitTaskButton.data("list-id");
        var showTaskFormButton = $(".show-add-form[data-list-id='" + listId + "']");

        if (!taskTitle) {
            console.error('Task name cannot be empty');
            return;
        }

        $.ajax({
            type: 'POST',
            url: "/create_task/" + listId,
            data: { task_title: taskTitle, list_id: listId },
            success: function(response) {
                const task_id = response.task_id;

                // Create a new task element with an unchecked checkbox
                const newTask = $('<div>').addClass('task');
                const taskSection = $('<div>').addClass('task-section');
                const checkbox = $('<input>').attr({
                    type: 'checkbox',
                    id: 'task-check-' + task_id,
                    class: 'task-checkbox',
                });
                const label = $('<label>').attr('for', 'task-check-' + task_id).text(taskTitle);

                // Append the taskSection to the new task
                newTask.append(taskSection);

                // Append the checkbox and label to the task section
                taskSection.append(checkbox).append(label);

                // Create the task dropdown HTML
                const taskDropdown = $('<div>').addClass('task-dropdown');
                const taskActionsButton = $('<button>').addClass('task-actions').attr('data-task-id', task_id).html('<i class="fa-solid fa-pen"></i>');
                const taskActionsContent = $('<div>').addClass('task-dropdown-content').attr('id', 'task-actions-content-' + task_id).attr('data-task-id', task_id);
                const renameTaskLink = $('<a>').addClass('rename-task').attr({
                    href: 'javascript:void(0)',
                    'data-task-id': task_id,
                    'data-task-title': taskTitle,
                }).text('Rename Task');
                const deleteTaskLink = $('<a>').addClass('delete-task').attr({
                    href: 'javascript:void(0)',
                    'data-task-id': task_id,
                }).text('Delete Task');
                const copyTaskLink = $('<a>').addClass('copy-task').attr({
                    href: 'javascript:void(0)',
                    'data-task-id': task_id,
                }).text('Copy Task');

                // Append links to the task dropdown content
                taskActionsContent.append(renameTaskLink, deleteTaskLink, copyTaskLink);

                // Append the task dropdown button and content to the task element
                taskDropdown.append(taskActionsButton).append(taskActionsContent);
                newTask.append(taskDropdown);

                // Append the new task element to the list content
                $('#list-content-' + listId).append(newTask);

                // Reset the task title input
                $(this).find('[name="task_title"]').val('');

                // Hide the add task form and show the add task button
                var addTaskForm = $('#add-task-form-' + listId);
                addTaskForm.addClass('hidden');
                showTaskFormButton.removeClass('hidden');

                window.location.reload();
            },
            error: function(xhr, status, error) {
                console.error('Error adding task:', error);
            }
        });
    });

    // Event listener for updating the task status when the checkbox is clicked
    $('.Lists').on('change', '.task-checkbox', function() {
        var checkbox = $(this);
        var task_id = checkbox.attr('id').split('-')[2];
        var is_completed = checkbox.prop('checked');

        // Send an AJAX request to update the task status
        $.ajax({
            type: 'POST',
            url: "/update_task_status/" + task_id,
            data: { is_completed: is_completed },
            success: function(response) {
                console.log('Task status updated successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error updating task status:', error);
            }
        });
    });

    // Function to show the task dropdown
    function showTaskDropdown(taskActionsContent) {
        taskActionsContent.show();
    }

    // Function to hide the task dropdown
    function hideTaskDropdown() {
        $('.task-dropdown-content').hide();
    }

    // Event listener to show the task actions dropdown
    $('.Lists').on('click', '.task-actions', function(e) {
        const taskId = $(this).data('task-id');
        // console.log(taskId);
        const taskActionsContent = $('#task-actions-content-' + taskId);
        showTaskDropdown(taskActionsContent);
    });

    // Global click event listener to close the task dropdown when clicking outside of it
    $(document).click(function (event) {
        if (!$(event.target).closest('.task-actions, .task-dropdown-content').length) {
            // Clicked outside both board actions and board dropdown elements
            $('.task-dropdown-content').hide();
        }
    });

    // Use event delegation for "Rename Task" link
    $('.Lists').on('click', '.rename-task', function () {
        const renameTaskLink = $(this);
        const taskId = renameTaskLink.data('task-id');
        var taskTitleElement = $(this).closest(".task").find(".task-section label");
        const taskTitle = taskTitleElement.text();

        // Creating an input field
        const inputField = $('<input>', {
            type: 'text',
            value: taskTitle,
            style: 'outline: none; border: none; font-size: 2.3vh; width: auto; height: 3vh;',
        });

        // Replace the board title with the input field
        taskTitleElement.text('');
        taskTitleElement.append(inputField);

        // Move the cursor to the end of the input value
        inputField.focus();
        const inputValue = inputField.val();
        inputField[0].selectionEnd = inputValue.length;

        inputField.on('blur', function () {
            renameTask(inputField, taskId, taskTitle);
        });

        hideTaskDropdown();
        // Handle saving the new title on blur or Enter key press
        inputField.on("blur keydown", function (event) {
            var taskId = $(this).closest(".task").find(".rename-task").data("task-id");

            if (event.type === "keydown" && event.key === "Enter") {
                // Prevent line breaks in the input field
                event.preventDefault();
                // Trigger the same behavior as when the input field loses focus
                inputField.blur();
            } else if (event.type === "blur") {
                var newTitle = inputField.val();
                renameTask(taskId, newTitle);
            }
        });
    });

    // Function to Rename a task
    function renameTask(taskId, newTitle) {
        // Send an AJAX request to update the task title
        $.ajax({
            type: "POST",
            url: "/rename_task/" + taskId,
            data: JSON.stringify({ "newTaskTitle": newTitle }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response && response.message === "Task renamed successfully") {
                    // Update the displayed task title
                    var taskTitleElement = $('.rename-task[data-task-id="' + taskId + '"]').closest(".task").find(".task-section label");
                    taskTitleElement.text(newTitle);
                } else {
                    console.error("Error renaming task: " + response.message);
                }
            },
            error: function (error) {
                // Handle the error if necessary
                console.error("Error renaming task: " + error.responseText);
            }
        });
    }

    // Function to delete a task
    function deleteTask(taskId) {
        $.ajax({
            type: 'POST',
            url: "/delete_task/" + taskId,
            success: function(response) {
                // Remove the deleted task from the UI
                $('#task-check-' + taskId).closest('.task').remove();
                console.log('Task deleted successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error deleting task:', error);
            }
        });
    }

    // Event listener for deleting a task
    $('.Lists').on('click', '.delete-task', function(e) {
        e.preventDefault();
        var taskId = $(this).data('task-id');
        deleteTask(taskId);
    });

    // Function to copy a task
    function copyTask(taskId, listId) {
        $.ajax({
            type: 'POST',
            url: "/copy_task/" + taskId,
            success: function(response) {
                var clonedTask = $('#task-check-' + taskId).closest('.task').clone();
                $('#list-content-' + listId).append(clonedTask);
                window.location.reload();
                console.log('Task copied successfully');
            },
            error: function(xhr, status, error) {
                console.error('Error copying task:', error);
            }
        });
    }

    // Event listener for copying a task
    $('.Lists').on('click', '.copy-task', function(e) {
        e.preventDefault();
        hideTaskDropdown();

        var taskId = $(this).data('task-id');
        var listId = $(this).data('list-id');
        copyTask(taskId, listId);
    });

});
