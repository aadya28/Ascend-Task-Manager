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

function adjustDropdown(dropdownContent) {
    if (dropdownContent) {
        const content = dropdownContent[0];
        const dropdownWidth = content.offsetWidth;
        const windowWidth = window.innerWidth;
        const buttonRect = content.previousElementSibling.getBoundingClientRect();
        // Check if the dropdown goes out of the viewport and adjust if needed
        if (buttonRect.right + dropdownWidth > windowWidth) {
            content.style.right = '0';
            content.style.left = 'auto';
        } else {
            content.style.right = 'auto';
            content.style.left = '0';
        }
    } else {
        // The element does not exist
        console.log("Element not found.");
    }
}

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

$(document).ready(function () {
    // To Select the options dropdown and its elements
    const boardDropdown = document.querySelector('.options-section');
    if (boardDropdown) {
        // Function to show the board dropdown
        function showBoardActionsDropdown(boardId) {
            // console.log("show board actions");
            $('.dropdown-content').hide(); // Hide other dropdowns

            const $boardActionsContent = $('#board-actions-content[data-board-id="' + boardId + '"]');
            console.log('BoardActionsContent data-board-id:', $boardActionsContent);

            $boardActionsContent.show();
            adjustDropdown($boardActionsContent);
        }

        // Event listener to show the board actions dropdown
        $('.board-actions').click(function (e) {
            e.stopPropagation(); // Prevent the click from propagating to the document click event.
            const boardId = $(this).data('board-id');
            showBoardActionsDropdown(boardId);
        });

        // Function to rename the board
        function renameBoard(inputField, boardId, boardTitle) {
            const newBoardName = inputField.val().trim();
            if (newBoardName !== '') {
                // Making an AJAX request to update the board name
                $.ajax({
                    url: '/rename_board/' + boardId,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({ newBoardName }),
                    success: function (data, textStatus, jqXHR) {
                        if (jqXHR.status === 200) {
                            // Board renamed successfully, update the displayed name
                            boardTitle.text(newBoardName);
                            location.reload();
                        } else {
                            // Handle the case where the rename request fails
                            console.error('Failed to rename the board.');
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        // Handle network errors, if any
                        console.error('Network error:', errorThrown);
                    }
                });
            } else {
                // Restore the original board name if the input is empty
                boardTitle.text(renameLink.data('board-name'));
            }
            inputField.remove(); // Remove the input field after editing
        }

        // Event listener to rename a board
        $(document).on('click', '.rename-board', function (e) {
            e.preventDefault(); // Prevent the link from navigating
            const renameLink = $(this);
            const boardId = renameLink.data('board-id');

            // Finding the board title element
            const boardTitle = $('#board-title-' + boardId);

            // Creating an input field
            const inputField = $('<input>', {
                type: 'text',
                value: boardTitle.text(),
                style: 'width: 10vw; padding: 5px; font-size: 2.5vh;',
            });

            // Replace the board title with the input field
            boardTitle.text('');
            boardTitle.append(inputField);

            // Move the cursor to the end of the input value
            inputField.focus();
            const inputValue = inputField.val();
            inputField[0].selectionEnd = inputValue.length;

            inputField.on('blur', function () {
                renameBoard(inputField, boardId, boardTitle);
            });

            inputField.on('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    renameBoard(inputField, boardId, boardTitle);
                }
            });
        });

        // Function to delete a board
        function deleteBoard(boardId) {
            $.ajax({
                url: '/delete_board/' + boardId,
                method: 'POST',
                success: function (data, textStatus, jqXHR) {
                    if (jqXHR.status === 200) {
                        // Board deletion was successful
                        console.log('Board deleted successfully.');
                        window.location.href = '/';
                        // You can redirect the user or update the UI as needed here
                    } else {
                        // Error handling in case the server returns an error
                        console.error('Error deleting board.');
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    // Handle network errors, if any
                    console.error('Network error:', errorThrown);
                }
            });
        }

        // Event listener to delete a board
        $(document).on('click', '.delete-board', function (e) {
            e.preventDefault(); // Prevent the link from navigating
            const boardId = $(this).data('board-id');
            const confirmationPopup = $('#confirmation-popup');
            confirmationPopup.show();

            // Handle the board deletion when the user confirms
            $('#confirm-delete').click(function () {
                deleteBoard(boardId);

                // Hide the confirmation popup
                confirmationPopup.hide();
            });

            // Hide the confirmation popup when the cancel button is clicked
            $('#cancel-delete').click(function () {
                confirmationPopup.hide();
            });
        });

        // Global click event listener to close the board dropdown when clicking outside of it
        $(document).click(function (event) {
            if (!$(event.target).closest('.board-actions, #board-dropdown-content').length) {
                // Clicked outside both board actions and board dropdown elements
                $('#board-dropdown-content').hide();
            }
        });
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

    // Function to show the list actions dropdown
    function showListActionsDropdown(listActionsContent) {
        // console.log("show list actions");
        listActionsContent.show(); // Show the list actions dropdown
        adjustDropdown(listActionsContent);
    }

    // Event listener to show the list actions dropdown
    $('.Lists').on('click', '.list-actions', function(e) {
        const listId = $(this).data('list-id');
        const listActionsContent = $('#list-actions-content[data-list-id="' + listId + '"]');

        // console.log('ListActionsContent data-list-id:', listActionsContent.data('list-id'));
        showListActionsDropdown(listActionsContent);
    });

    // To hide the dropdowns
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.list-actions, .move-list, #move-list-content').length) {
            // Clicked outside both list actions and move list elements
            $('.dropdown-content').hide();
        }
    });

    // Use event delegation for "Rename List" link
    $('.Lists').on('click', '.rename-list', function () {
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
        // Close all dropdowns before copying the list
        $('.dropdown-content').removeClass('visible');

        // Send an AJAX request to copy the list
        $.ajax({
            type: 'POST',
            url: '/copy_list/' + listId,
            success: function(response) {
                if (response && response.message === 'List copied successfully') {
                    // Create a new list element with the copied data
                    var copiedListHTML = listElement.clone();
                    copiedListHTML.find('.list-actions').remove(); // Remove actions dropdown button
                    listElement.after(copiedListHTML);
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

    // Function to Show the Move list dropdown
    function showMoveListDropdown(listActionsContent, moveListContent) {        // Hide the list actions dropdown
        // console.log("reached show-move-list-dropdown");
        listActionsContent.hide(); // Hide the list actions dropdown
        moveListContent.show();
        adjustDropdown(moveListContent);
    }

    // Function to Hide the Move list dropdown
    function hideMoveListDropdown(moveListContent) {        // Hide the list actions dropdown
        // console.log("reached hide-move-list-dropdown");
        moveListContent.hide();
    }

    // Event delegation for "Move List" button
    $('.Lists').on('click', '.move-list', function(e) {
        e.preventDefault();
        const listId = $(this).data('list-id');
        // console.log(listId);
        const listActionsContent = $('#list-actions-content[data-list-id="' + listId + '"]');
        const moveListContent = $('#move-list-content[data-list-id="' + listId + '"]');

        // console.log('ListActionsContent data-list-id:', listActionsContent.data('list-id'));
        // console.log('MoveListContent data-list-id:', moveListContent.data('list-id'));

        showMoveListDropdown(listActionsContent, moveListContent);
    });

    // Event delegation for "Cancel Move List" button
    $('.Lists').on('click', '.cancel-move-list', function(e) {
        e.preventDefault();
        console.log("clicked");
        const listId = $(this).data('list-id');
        const moveListContent = $('#move-list-content[data-list-id="' + listId + '"]');
        hideMoveListDropdown(moveListContent);
    });

    // // Event delegation for "Move List" form submission
    // $('.Lists').on('click', '.move-list-button', function(e) {
    //     e.preventDefault();
    //     const listId = $(this).data('list-id');
    //     console.log(listId);
    //     const moveListContent = $('#move-list-content[data-list-id="' + listId + '"]');
    //     console.log(moveListContent);
    //     const newBoardId = moveListContent.find('#move-to-board').val();
    //     const newPosition = moveListContent.find('#move-to-position').val();
    //     console.log(newBoardId, newPosition);
    //
    //     // Send the form data to the server using AJAX
    //     $.ajax({
    //         type: 'POST',
    //         url: '/move_list/' + listId,
    //         data: { new_board_id: newBoardId, new_position: newPosition },
    //         dataType: 'json',
    //         success: function(data) {
    //             console.log(data.message); // Log the server response message
    //             hideMoveListDropdown(moveListContent); // Hide the move list dropdown
    //         },
    //         error: function(error) {
    //             console.error('Error moving list:', error);
    //         }
    //     });
    // });
});