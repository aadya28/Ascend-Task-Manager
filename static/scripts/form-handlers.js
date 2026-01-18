// ========================================
// FORM HANDLERS
// Handles showing/hiding forms and wallpaper selection
// ========================================

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
