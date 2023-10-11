// Event listener for showing the add list form, add task form, or add board form
document.addEventListener('click', event => {
    const showButton = event.target;
    const form = showButton.nextElementSibling;

    if (showButton.classList.contains('show-add-form')) {
        if (form.classList.contains('add-list-form') ||
            form.classList.contains('add-task-form') ||
            form.classList.contains('add-board-form')) {

            // Show the form
            form.classList.remove('hidden');
            showButton.classList.add('hidden');

            const firstInput = form.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    } else {
        // Close the form when clicked outside it.
        const forms = document.querySelectorAll('.add-list-form, .add-task-form, .add-board-form');
        forms.forEach(form => {
            if (!form.contains(event.target)) {
                form.classList.add('hidden');
                // Also make the corresponding show button visible again
                const showButton = form.previousElementSibling;
                showButton.classList.remove('hidden');
            }
        });
    }
});

//Event listener for cancelling adding a list, a task or a board.
document.addEventListener('click', event=>{
    if (event.target.classList.contains('cancel-button')){
        const cancelButton = event.target;
        const form = cancelButton.closest('.add-list-form') || cancelButton.closest('.add-task-form') || cancelButton.closest('.add-board-form');
        const showButton = form.previousElementSibling;

        resetForm(form, showButton);
    }
})

// Helper function to reset the add forms
function resetForm(form, showButton) {
    form.classList.add('hidden');
    showButton.classList.remove('hidden');

    const titleInput = form.querySelector('.title');
    titleInput.value = '';
}

// Getting the data input of the chosen wallpaper
const wallpaperButtons = document.querySelectorAll('.wallpaper-button');
const selectedWallpaperInput = document.getElementById('selected-wallpaper');

wallpaperButtons.forEach(button => {
    button.addEventListener('click', function() {
        // console.log("reached");
        const wallpaperValue = this.value;
        // console.log(wallpaperValue);

        wallpaperButtons.forEach(btn => {
            btn.classList.remove('selected');
        });

        this.classList.toggle('selected');

        // Toggle the selection: if the same button is clicked again, clear the selection
        if (selectedWallpaperInput.value === wallpaperValue) {
            // console.log("blank");
            selectedWallpaperInput.value = '';
            button.classList.remove('selected');
        } else {
            selectedWallpaperInput.value = wallpaperValue;
        }
    });
});

// Reset the wallpaper selection when the cancel button is clicked
cancelBoardButton = document.getElementById('cancel-board-button');

if(cancelBoardButton) {
    cancelBoardButton.addEventListener('click', function () {
        // Remove the "selected" class from all wallpaper buttons
        wallpaperButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedWallpaperInput.value = '';
    });
}

// To Select the options dropdown and its elements
const boardDropdown = document.querySelector('.options-section');
if (boardDropdown) {
    const boardDropdownButton = boardDropdown.querySelector('.board-actions');
    const boardDropdownContent = boardDropdown.querySelector('.dropdown-content');

// A click event listener for showing the board dropdown.
    boardDropdownButton.addEventListener('click', () => {
        // console.log("board dropdown clicked");
        boardDropdownContent.classList.toggle('visible');
        adjustDropdownPosition(boardDropdownContent);
    });

// A global click event listener to close the board dropdown when clicking outside of it
    document.addEventListener('click', event => {
        if (!boardDropdown.contains(event.target)) {
            boardDropdownContent.classList.remove('visible');
        }
    });
}

// Function to adjust the position of the dropdown content
function adjustDropdownPosition(content) {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const dropdownWidth = content.offsetWidth;
    const buttonRect = content.previousElementSibling.getBoundingClientRect();

    // To Check if dropdown content is extending beyond the right edge
    if (buttonRect.right + dropdownWidth > viewportWidth) {
        content.style.right = '0';
        content.style.left = 'auto';
    } else {
        content.style.right = 'auto';
        content.style.left = '0';
    }
}

// To delete a board
document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const deleteBoardButton = document.querySelector(".delete-board");
    const confirmationPopup = document.getElementById("confirmation-popup");
    const confirmDeleteButton = document.getElementById("confirm-delete");
    const cancelDeleteButton = document.getElementById("cancel-delete");

    // Show the confirmation popup when the delete button is clicked
    deleteBoardButton.addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default action (e.g., following the href)

        confirmationPopup.style.display = "block";
    });

    // Hide the confirmation popup when the cancel button is clicked
    cancelDeleteButton.addEventListener("click", function () {
        confirmationPopup.style.display = "none";
    });

    // Handle the board deletion when the user confirms
    confirmDeleteButton.addEventListener("click", function () {
        // Perform the actual deletion here by sending a request to the server
        const boardId = deleteBoardButton.dataset.boardId;/* Obtain the board ID you want to delete */;
        fetch(`/delete_board/${boardId}`, {
            method: "POST",
        })
            .then((response) => {
                if (response.status === 200) {
                    // Board deletion was successful
                    console.log("Board deleted successfully.");
                    window.location.href = "/";
                    // You can redirect the user or update the UI as needed here
                } else {
                    // Error handling in case the server returns an error
                    console.error("Error deleting board.");
                }
            })
            .catch((error) => {
                // Handle network errors, if any
                console.error("Network error:", error);
            });

        // Hide the confirmation popup
        confirmationPopup.style.display = "none";
    });
});

document.addEventListener('click', event => {
    if (event.target.classList.contains('rename-board')) {
        event.preventDefault();

        const renameLink = event.target;
        const boardId = renameLink.dataset.boardId;

        // Finding the board title element
        const boardTitle = document.getElementById(`board-title-${boardId}`);

        // Creating an input field
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = boardTitle.textContent;

        // Styling the input field
        inputField.style.width = '10vw';
        inputField.style.padding = '5px';
        inputField.style.fontSize = '2.5vh'

        // Replacing the board title with the input field
        boardTitle.textContent = '';
        boardTitle.appendChild(inputField);

        // Adding event listener to the input field to handle renaming
        inputField.addEventListener('blur', () => {
            const newBoardName = inputField.value.trim();
            if (newBoardName !== '') {
                // Making an AJAX request to update the board name
                fetch(`/rename_board/${boardId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ newBoardName }),
                })
                    .then(response => {
                        if (response.ok) {
                            // Board renamed successfully, updating the displayed name
                            boardTitle.textContent = newBoardName;
                            window.location.reload();
                        } else {
                            // To handle the case where the rename request fails
                            console.error('Failed to rename the board.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            } else {
                // To restore the original board name if the input is empty
                boardTitle.textContent = renameLink.dataset.boardName;
            }
        });

        inputField.focus();
    }
});

$(document).ready(function() {
    // Handle the form submission for creating a new list
    $('#create-list-form').submit(function(e) {
        e.preventDefault();
        var listTitle = $('#list-title-input').val();

        // Send an AJAX request to create a new list
        $.ajax({
            type: 'POST',
            url: '/create_list',
            data: { list_title: listTitle },
            success: function(response) {
                // Handle success - add the new list to the page
                var newListHTML = '<div class="list-title-bar"><h2 class="title">' + listTitle + '</h2></div>';
                $('.Lists').append(newListHTML);
                $('#list-title-input').val(''); // Clear the input field
            },
            error: function(error) {
                console.error('Error creating list:', error);
            }
        });
    });

    // Function to toggle the visibility of the dropdown content
    function toggleDropdown() {
        // console.log("Toggle Dropdown clicked");
        $(this).siblings('.dropdown-content').toggleClass('visible');
    }

    // A click event listener in all elements with class "list-actions"
    $('.list-actions').click(toggleDropdown);

    // A click event listener in the document to close the dropdown
    $(document).click(function(event) {
        if (!$(event.target).closest('.dropdown').length) {
            // console.log("Document click event");
            $('.dropdown-content').removeClass('visible');
        }
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

    // Handle click events for "Delete List" buttons
    $('.delete-list').click(function(e) {
        e.preventDefault(); // Prevent the default link behavior

        var listId = $(this).data('list-id'); // Get the list ID from the data attribute
        var listElement = $(this).closest('.list'); // Get the list element

        deleteList(listId, listElement);
    });

    // Handler for clicking the "Rename List" link
    $(".rename-list").on("click", function () {
        var listTitleElement = $(this).closest(".list-title-bar").find(".title");
        var currentTitle = listTitleElement.text();

        // Create the input field with the value
        var inputField = $("<input type='text' class='edit-list-title'>");
        inputField.val(currentTitle);

        // Replace the title with the input field
        listTitleElement.html(inputField);

        // Focus on the input field
        inputField.focus();

        // Set the cursor position to the end of the input field
        var inputLength = inputField.val().length;
        inputField[0].setSelectionRange(inputLength, inputLength);

        // Close the dropdown menu
        $('.dropdown-content').removeClass('visible');
    });

    // Handler for saving the new list title
    $(document).on("blur", ".edit-list-title", function () {
    var listId = $(this).closest(".list").find(".rename-list").data("list-id");
    var newTitle = $(this).val();
    var listTitleElement = $(this).closest(".list-title-bar").find(".title");

    // Send an AJAX request to update the list title
    $.ajax({
        type: "POST",
        url: "/rename_list/" + listId,
        data: JSON.stringify({ "newListTitle": newTitle }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
        // Update the displayed list title
        listTitleElement.text(newTitle);
        },
        error: function (error) {
        // Handle the error if necessary
        console.error("Error renaming list: " + error.responseText);
        }
    });
});

    // Handler for pressing Enter key to save the new list title
    $(document).on("keypress", ".edit-list-title", function (event) {
        if (event.keyCode === 13) { // 13 is the Enter key code
        $(this).blur(); // Trigger the blur event to save the new title
        }
    });
});

// Adding a new task
document.addEventListener('click', event=>{
    if (event.target.classList.contains('add-task-button')){
        const addTaskButton = event.target;
        const addTaskForm = addTaskButton.closest('.add-task-form');
        const titleInput = addTaskForm.querySelector('.title');
        const taskTitle = titleInput.value.trim();


        if (taskTitle !== '') {
            const showButton = addTaskForm.previousElementSibling;
            const parentContainer = showButton.parentNode;
            const tasksContainer = parentContainer.previousElementSibling;
            addNewTask(tasksContainer, taskTitle);
            resetForm(addTaskForm, showButton);
        }
    }
})

// Helper function to add a new task.
function addNewTask(tasksContainer, taskTitle) {
    const newTask = createNewTask(taskTitle);
    tasksContainer.appendChild(newTask);
}

// Helper function to create a new task
function createNewTask(taskTitle) {
    const newTask = document.createElement('div');
    newTask.classList.add('task');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    newTask.appendChild(checkbox);

    newTask.appendChild(document.createTextNode(' '));

    const taskLabel = document.createElement('label');
    taskLabel.textContent = taskTitle;
    newTask.appendChild(taskLabel);

    return newTask;
}