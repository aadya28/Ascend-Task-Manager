// ========================================
// LIST OPERATIONS
// Handles list create, rename, delete, copy, and dropdown actions
// ========================================

$(document).ready(function() {
    // Handle the form submission for creating a new list
    $(document).on('submit', '.add-list-form', function(e)  {
        e.preventDefault();
        var listTitle = $('[name="list_title"]').val();
        var submitListButton = document.querySelector(".add-list-button");
        var showAddFormButton = document.querySelector(".show-add-form");
        var addListForm = document.querySelector(".add-list-form");
        var boardId = submitListButton.getAttribute("data-board-id");

        // Send an AJAX request to create a new list
        $.ajax({
            type: 'POST',
            url: "/create_list/" + boardId,
            data: { list_title: listTitle, board_id: boardId },
            success: function(response) {
                const listId = response.list_id;
                // Handle success - add the new list to the page
                var newListHTML = '<div class="list">' +
                    '<div class="list-title-bar">' +
                    '<h2 class="title">' + listTitle + '</h2>' +
                    '<button class="list-actions" data-list-id="' + listId + '">&#8226; &#8226; &#8226;</button>' +
                    '</div>' +
                    '<div class="list-content">' +
                    '</div>' +
                    '<div class="add-task">' +
                    '<button class="show-add-form">&#65291; Add Task</button>' +
                    '<div class="add-task-form hidden">' +
                    '<input type="text" class="title" placeholder="Enter Task Title">' +
                    '<div class="button-group">' +
                    '<button class="add-task-button">Add Task</button>' +
                    '<button class="cancel-button">Cancel</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                // Insert the new list element before the "Create new List" button
                $('.add-list').before(newListHTML);
                // Reset the form and reload the site
                addListForm.classList.add('hidden');
                showAddFormButton.classList.remove('hidden');
                location.reload();
            },
            error: function(error) {
                console.error('Error creating list:', error);
            }
        });
    });

    // Function to show the list actions dropdown
    function showListDropdown(listActionsContent) {
        // console.log("show list actions");
        listActionsContent.show(); // Show the list actions dropdown
        adjustDropdown(listActionsContent);
    }

    // Event listener to show the list actions dropdown
    $('.Lists').on('click', '.list-actions', function(e) {
        const listId = $(this).data('list-id');
        // console.log(listId);
        const listActionsContent = $('#list-actions-content-' + listId);
        showListDropdown(listActionsContent);
    });

    // Global click event listener to close the board dropdown when clicking outside of it
    $(document).click(function (event) {
        if (!$(event.target).closest('.list-actions, .dropdown-content').length) {
            // Clicked outside both board actions and board dropdown elements
            $('.dropdown-content').hide();
        }
    });

    // Use event delegation for "Rename List" link
    $('.Lists').on('click', '.rename-list', function () {
        const renameListLink = $(this);
        const listId = renameListLink.data('list-id');
        var listTitleElement = $(this).closest(".list-title-bar").find(".title");
        var currentListTitle = listTitleElement.text();

        // Creating an input field
        const inputField = $('<input>', {
            type: 'text',
            value: currentListTitle,
            style: 'font-size: 2.5vh; width: 100%; padding: 5px;',
        });

        // Replace the board title with the input field
        listTitleElement.text('');
        listTitleElement.append(inputField);

        // Move the cursor to the end of the input value
        inputField.focus();
        const inputValue = inputField.val();
        inputField[0].selectionEnd = inputValue.length;

        // Close the dropdown menu
        $('.dropdown-content').hide();

        inputField.on('blur', function () {
            renameList(listId, currentListTitle);
        });

        // Handle saving the new title on blur or Enter key press
        inputField.on("blur keydown", function (event) {
            var listId = $(this).closest(".list").find(".rename-list").data("list-id");

            if (event.type === "keydown" && event.key === "Enter") {
                // Prevent line breaks in the input field
                event.preventDefault();
                // Trigger the same behavior as when the input field loses focus
                inputField.blur();
            } else if (event.type === "blur") {
                var newTitle = inputField.val();
                renameList(listId, newTitle);
            }
        });
    });

    // Function to Rename a list
    function renameList(listId, newTitle) {
        // Send an AJAX request to update the list title
        $.ajax({
            type: "POST",
            url: "/rename_list/" + listId,
            data: JSON.stringify({ "newListTitle": newTitle }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response && response.message === "List renamed successfully") {
                    // Update the displayed list title
                    var listTitleElement = $('.rename-list[data-list-id="' + listId + '"]').closest(".list-title-bar").find(".title");
                    listTitleElement.text(newTitle);
                } else {
                    console.error("Error renaming list: " + response.message);
                }
            },
            error: function (error) {
                // Handle the error if necessary
                console.error("Error renaming list: " + error.responseText);
            }
        });
    }

    // Use event delegation for "Delete List" button
    $('.Lists').on('click', '.delete-list', function(e) {
        e.preventDefault();
        var listId = $(this).data('list-id');
        var listElement = $(this).closest('.list');
        deleteList(listId, listElement);
    });

    // Function to delete a list
    function deleteList(listId, listElement) {
        // Send an AJAX request to delete the list
        $.ajax({
            type: 'POST',
            url: '/delete_list/' + listId,
            success: function(response) {
                if (response && response.message === 'List deleted successfully') {
                    // Remove the deleted list element from the UI
                    listElement.remove();
                } else {
                    console.error('Error deleting list:', response.message);
                }
            },
            error: function(error) {
                console.error('Error deleting list:', error);
            }
        });
    }

    // Use event delegation for "Copy List" button
    $('.Lists').on('click', '.copy-list', function(e) {
        e.preventDefault();
        var listId = $(this).data('list-id');
        var listElement = $(this).closest('.list');
        copyList(listId, listElement);
    });

    // Function to copy a list
    function copyList(listId, listElement) {
        $.ajax({
            type: 'POST',
            url: '/copy_list/' + listId,
            success: function(response) {
                if (response && response.message === 'List copied successfully') {
                    // Clone the list element and remove actions dropdown button
                    var copiedListHTML = listElement.clone();
                    copiedListHTML.find('.list-actions').remove();

                    // Insert the copied list element before the "Create new List" button
                    $('.add-list').before(copiedListHTML);
                    window.location.reload();
                } else {
                    console.error('Error copying list:', response.message);
                }
            },
            error: function(error) {
                console.error('Error copying list:', error);
            }
        });
    }
});
