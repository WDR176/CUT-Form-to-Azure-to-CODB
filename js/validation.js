/*
 * Form Validation Module
 * Handles real-time and pre-submission form validation
 * Used by: form.html, submit.js
 * Author: WDR176
 * Dependencies: config.js
 */

/**
 * Initialize form validation when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    log('Initializing form validation...');
    
    // Generate and set Customer ID
    const customerId = generateCustomerId();
    document.getElementById('customerId').value = customerId;
    
    // Setup validation event listeners
    setupValidationListeners();
    
    // Setup character counter for comments
    setupCommentCounter();
});

/**
 * Setup real-time validation listeners for all form fields
 */
function setupValidationListeners() {
    const form = document.getElementById(FORM_CONFIG.FORM_ID);
    
    if (!form) {
        logError('Form not found with ID: ' + FORM_CONFIG.FORM_ID);
        return;
    }
    
    // Add event listeners to all form inputs
    const inputs = form.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Validate on change
        input.addEventListener('change', function() {
            validateField(this);
        });
        
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Real-time validation as user types (debounced)
        let timeoutId;
        input.addEventListener('input', function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                validateField(this);
            }, 300);
        });
    });
    
    log('Validation listeners setup complete');
}

/**
 * Validate a single form field
 * @param {HTMLElement} field - The form field to validate
 * @returns {boolean} True if field is valid, false otherwise
 */
function validateField(field) {
    const fieldName = field.name;
    const fieldValue = field.value.trim();
    const rules = VALIDATION_RULES[fieldName];
    
    if (!rules) {
        log(`No validation rules found for field: ${fieldName}`);
        return true;
    }
    
    // Get error message element
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    // Check if field is required and empty
    if (rules.required && !fieldValue) {
        showFieldError(field, 'This field is required', errorElement);
        return false;
    }
    
    // If field is empty and not required, it's valid
    if (!fieldValue && !rules.required) {
        clearFieldError(field, errorElement);
        return true;
    }
    
    // Validate based on field type
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
        case 'email':
            isValid = validateEmail(fieldValue);
            errorMessage = isValid ? '' : 'Please enter a valid email address';
            break;
            
        case 'mobile':
            isValid = validateMobile(fieldValue);
            errorMessage = isValid ? '' : 'Mobile number must be exactly 10 digits';
            break;
            
        case 'dob':
            isValid = validateDateOfBirth(fieldValue);
            errorMessage = isValid ? '' : 'Please enter a valid date of birth (age 18-100)';
            break;
            
        case 'firstName':
        case 'lastName':
        case 'city':
        case 'state':
            isValid = validateName(fieldValue, rules.minLength, rules.maxLength);
            errorMessage = isValid ? '' : rules.errorMessage;
            break;
            
        case 'address':
            isValid = validateAddress(fieldValue, rules.minLength, rules.maxLength);
            errorMessage = isValid ? '' : rules.errorMessage;
            break;
            
        case 'comments':
            isValid = validateComments(fieldValue, rules.maxLength);
            errorMessage = isValid ? '' : rules.errorMessage;
            break;
            
        default:
            isValid = true;
    }
    
    if (isValid) {
        clearFieldError(field, errorElement);
    } else {
        showFieldError(field, errorMessage, errorElement);
    }
    
    return isValid;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate mobile number (10 digits)
 * @param {string} mobile - Mobile number to validate
 * @returns {boolean} True if valid
 */
function validateMobile(mobile) {
    const mobileRegex = /^[0-9]{10}$/;
    return mobileRegex.test(mobile);
}

/**
 * Validate date of birth
 * Checks if date is valid and age is between 18-100 years
 * @param {string} dob - Date of birth in YYYY-MM-DD format
 * @returns {boolean} True if valid
 */
function validateDateOfBirth(dob) {
    // Check if date is valid
    const date = new Date(dob + 'T00:00:00');
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Check if date is not in the future
    if (date > new Date()) {
        return false;
    }
    
    // Calculate age
    const age = calculateAge(dob);
    
    // Check if age is between min and max
    const minAge = VALIDATION_RULES.dob.minAge;
    const maxAge = VALIDATION_RULES.dob.maxAge;
    
    return age >= minAge && age <= maxAge;
}

/**
 * Validate name fields (firstName, lastName, city, state)
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if valid
 */
function validateName(value, minLength, maxLength) {
    if (value.length < minLength || value.length > maxLength) {
        return false;
    }
    
    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(value);
}

/**
 * Validate address
 * @param {string} value - Address to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if valid
 */
function validateAddress(value, minLength, maxLength) {
    if (value.length < minLength || value.length > maxLength) {
        return false;
    }
    return true;
}

/**
 * Validate comments
 * @param {string} value - Comments to validate
 * @param {number} maxLength - Maximum length
 * @returns {boolean} True if valid
 */
function validateComments(value, maxLength) {
    return value.length <= maxLength;
}

/**
 * Show field error message and apply error styling
 * @param {HTMLElement} field - The form field
 * @param {string} message - Error message to display
 * @param {HTMLElement} errorElement - Element to display error in
 */
function showFieldError(field, message, errorElement) {
    field.classList.add('error');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    log(`Field error: ${field.name} - ${message}`);
}

/**
 * Clear field error message and remove error styling
 * @param {HTMLElement} field - The form field
 * @param {HTMLElement} errorElement - Element displaying error
 */
function clearFieldError(field, errorElement) {
    field.classList.remove('error');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
}

/**
 * Validate entire form
 * @returns {boolean} True if all fields are valid
 */
function validateForm() {
    log('Validating entire form...');
    
    const form = document.getElementById(FORM_CONFIG.FORM_ID);
    const inputs = form.querySelectorAll('.form-control:not(.readonly)');
    
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    if (isFormValid) {
        log('Form validation passed');
    } else {
        log('Form validation failed');
    }
    
    return isFormValid;
}

/**
 * Setup character counter for comments field
 */
function setupCommentCounter() {
    const commentsField = document.getElementById('comments');
    const commentCount = document.getElementById('commentCount');
    
    if (!commentsField || !commentCount) {
        return;
    }
    
    // Update counter on input
    commentsField.addEventListener('input', function() {
        commentCount.textContent = this.value.length;
    });
    
    // Initialize counter
    commentCount.textContent = '0';
}

/**
 * Get all form data as an object
 * @returns {Object} Form data object
 */
function getFormData() {
    const form = document.getElementById(FORM_CONFIG.FORM_ID);
    const formData = {};
    
    FORM_FIELDS.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            formData[fieldName] = field.value;
        }
    });
    
    return formData;
}

/**
 * Reset form to initial state
 */
function resetForm() {
    const form = document.getElementById(FORM_CONFIG.FORM_ID);
    
    // Reset form fields
    form.reset();
    
    // Generate new Customer ID
    const customerId = generateCustomerId();
    document.getElementById('customerId').value = customerId;
    
    // Clear all error messages
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
        const errorElement = document.getElementById(`${input.name}-error`);
        clearFieldError(input, errorElement);
    });
    
    // Reset comment counter
    const commentCount = document.getElementById('commentCount');
    if (commentCount) {
        commentCount.textContent = '0';
    }
    
    log('Form reset complete');
}
