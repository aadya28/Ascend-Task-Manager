// ========================================
// BOARD OPERATIONS
// Handles board rename, delete, and dropdown actions
// ========================================

$(document).ready(function () {
    // To Select the options dropdown and its elements
    const boardDropdown = document.querySelector('.options-section');
    if (boardDropdown) {
        // Function to show the board dropdown
        function showBoardActionsDropdown(boardId) {
            // console.log("show board actions");
            // $('.dropdown-content').hide(); // Hide other dropdowns

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
