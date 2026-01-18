// ========================================
// COMMON UTILITIES
// Shared functions used across components
// ========================================

// Helper function to reset the add forms
function resetForm(form, showButton) {
    form.classList.add('hidden');
    showButton.classList.remove('hidden');

    const titleInput = form.querySelector('.title');
    titleInput.value = '';
}

// Function to adjust dropdown position based on viewport
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
