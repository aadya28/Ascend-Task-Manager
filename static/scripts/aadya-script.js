// const dropdown = document.querySelector('.options-section');
//
// const button = dropdown.querySelector('.board-actions')
// const content = dropdown.querySelector('.dropdown-content');
//
// button.addEventListener('click', () => {
//     // console.log("dropdown clicked");
//     content.classList.toggle('visible');
//     adjustDropdownPosition(content);
// });
//
// document.addEventListener('click', event => {
//     if (!dropdown.contains(event.target)) {
//         content.classList.remove('visible');
//     }
// });
//
// // Function to adjust the position of the dropdown content
// function adjustDropdownPosition(content) {
//     const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
//     const dropdownWidth = content.offsetWidth;
//     const buttonRect = content.previousElementSibling.getBoundingClientRect();
//
//     // To Check if dropdown content is extending beyond the right edge
//     if (buttonRect.right + dropdownWidth > viewportWidth) {
//         content.style.right = '0';
//         content.style.left = 'auto';
//     } else {
//         content.style.right = 'auto';
//         content.style.left = '0';
//     }
// }

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
        } else {
            selectedWallpaperInput.value = wallpaperValue;
        }
    });
});

// Reset the wallpaper selection when the cancel button is clicked
document.getElementById('cancel-board-button').addEventListener('click', function() {
    // Remove the "selected" class from all wallpaper buttons
    wallpaperButtons.forEach(btn => {
        btn.classList.remove('selected');
    });
    selectedWallpaperInput.value = '';
});

// Event listener for showing the add list form or the add task form
document.addEventListener('click', event => {
    if (event.target.classList.contains('show-add-form')) {
        const showButton = event.target;
        const form = showButton.nextElementSibling;

        if (form.classList.contains('add-list-form')) {
            form.classList.remove('hidden');
        } else if (form.classList.contains('add-task-form')) {
            form.classList.remove('hidden');
        } else if (form.classList.contains('add-board-form')) {
            form.classList.remove('hidden');
        }
        showButton.classList.add('hidden');
    }
});

//Event listener for cancelling adding a list or a task.
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

// Adding a new list
const addListButton = document.querySelector('.add-list-button');

addListButton.addEventListener('click', () => {
    // console.log('Add list button clicked');

    const addListForm = addListButton.closest('.add-list-form');
    const showButton = addListForm.previousElementSibling;
    const titleInput = addListForm.querySelector('.title');
    const listTitle = titleInput.value.trim();

    // If the list title is empty, set it to "Untitled"
    const finalListTitle = listTitle !== '' ? listTitle : 'Untitled';

    const newList = document.createElement('div');
    newList.innerHTML = `
        <div class="list-title-bar">
            <h2 class="title">${finalListTitle}</h2>
            <div class="dropdown">
                <button class="list-actions">&#8226; &#8226; &#8226;</button>
                <div class="dropdown-content">
                    <a href="#rename">Rename List</a>
                    <a href="#delete">Delete List</a>
                    <a href="#copy">Copy List</a>
                    <a href="#move">Move List</a>
                </div>
            </div>
        </div>

        <div class="list-content">
        </div>

        <div class="add-task">
            <button class="show-add-form">&#65291; Add Task</button>
            <div class="add-task-form hidden">
                <input type="text" class="title" placeholder="Enter Task Title">
                <div class="button-group">
                    <button class="add-task-button">Add Task</button>
                    <button class="cancel-button">Cancel</button>
                </div>
            </div>
        </div>` ;
    newList.classList.add('list');

    const addListContainer = document.querySelector('.add-list');
    const parentContainer = addListContainer.parentNode;

    parentContainer.insertBefore(newList, addListContainer);

    resetForm(addListForm, showButton);

    // Initialize the dropdown functionality
    initializeDropdown(newList);
});

// Function to initialize dropdown functionality
function initializeDropdown(listElement) {
    const dropdownButton = listElement.querySelector('.list-actions');
    const dropdownContent = listElement.querySelector('.dropdown-content');

    // Event Listener to open the dropdown
    dropdownButton.addEventListener('click', () => {
        dropdownContent.classList.toggle('visible');
    });

    // Event Listener to close the dropdown
    document.addEventListener('click', event => {
        if (!dropdownButton.contains(event.target)) {
            dropdownContent.classList.remove('visible');
        }
    });

    const options = dropdownContent.querySelectorAll('a[href^="#"]');
    options.forEach(option => {
        option.addEventListener('click', event => {
            event.preventDefault(); // Prevent the default behavior of the anchor tag
            const list = listElement;
            const optionValue = option.getAttribute('href');

            if (optionValue === '#rename') {
                // console.log("rename");
                renameElement(list);
            } else if (optionValue === '#delete') {
                // console.log("delete");
                deleteElement(list);
            } else if (optionValue === '#copy') {
                console.log("copy");
                copyElement(list);
            } else if (optionValue === '#move') {
                console.log("move");
                moveElement(list);
            }

            dropdownContent.classList.remove('visible');
        });
    });

    adjustDropdownPosition(dropdownContent)
}

// Helper function to rename an element.
function renameElement(targetElement) {
    const titleElement = targetElement.querySelector('.title');
    const currentTitle = titleElement.textContent;

    const inputBox = document.createElement('input');
    inputBox.type = 'text';
    inputBox.value = currentTitle;
    inputBox.classList.add('rename-input');

    titleElement.textContent = ''; // Removes the current title
    titleElement.appendChild(inputBox); // Adds the input box

    inputBox.addEventListener('blur', () => {
        const newTitle = inputBox.value.trim();
        titleElement.removeChild(inputBox);

        if (newTitle !== '') {
            titleElement.textContent = newTitle;
        } else {
            titleElement.textContent = currentTitle; // Restores the original title
        }
    });

    inputBox.focus();
}

// Helper function to delete an element.
function deleteElement(targetElement) {
    targetElement.remove();
}

// Helper function to copy an element.
function copyElement(targetElement) {
    const newList = targetElement.cloneNode(true);
    const nextSibling = targetElement.nextElementSibling;
    const parentContainer = targetElement.parentNode;
    parentContainer.insertBefore(newList, nextSibling);

    // Initialize dropdown functionality for the copied list
    initializeDropdown(newList);
}

// Helper function to move an element.
function moveElement(targetElement) {
    const targetIndex = prompt('Enter the position you want to move the element to:');
    if (targetIndex !== null) {
        const addListContainer = document.querySelector('.add-list');
        const parentContainer = addListContainer.parentNode;
        parentContainer.removeChild(targetElement);
        parentContainer.insertBefore(targetElement, parentContainer.children[targetIndex - 1]);
    }
}

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