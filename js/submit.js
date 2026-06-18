/*
 * Form Submission Module
 * Handles form submission, data preparation, and API integration
 * Used by: form.html
 * Author: WDR176
 * Dependencies: config.js, validation.js
 */

/**
 * Initialize form submission when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    log('Initializing form submission module...');
    
    const form = document.getElementById(FORM_CONFIG.FORM_ID);
    
    if (form) {
        // Setup form submit event
        form.addEventListener('submit', handleFormSubmit);
        
        // Setup form reset event
        form.addEventListener('reset', function(e) {
            // Delay reset to allow form to reset first
            setTimeout(() => {
                resetForm();
            }, 0);
        });
        
        log('Form submission handlers attached');
    } else {
        logError('Form not found');
    }
});

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    log('Form submit event triggered');
    
    // Validate form
    if (!validateForm()) {
        logError('Form validation failed');
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    log('Form validation passed');
    
    // Get form data
    const formData = getFormData();
    
    // Add timestamp
    formData.createdDate = getCurrentDate();
    
    log('Form data prepared', formData);
    
    // Show processing message
    showNotification('Processing your registration...', 'info');
    
    // Disable submit button
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
    }
    
    // Process submission
    submitFormData(formData);
}

/**
 * Submit form data
 * @param {Object} formData - Form data to submit
 */
function submitFormData(formData) {
    // If API is enabled, send to Azure Functions
    if (API_CONFIG.ENABLED) {
        submitToAPI(formData);
    } else {
        // For local development, just store and redirect
        handleLocalSubmission(formData);
    }
}

/**
 * Handle local submission (for development/testing without backend)
 * @param {Object} formData - Form data to submit
 */
function handleLocalSubmission(formData) {
    log('Handling local submission (backend not enabled)', formData);
    
    // Simulate processing delay
    setTimeout(() => {
        // Store form data in sessionStorage for success page
        sessionStorage.setItem('registrationData', JSON.stringify(formData));
        
        // Log submission
        log('Registration submitted locally', formData);
        
        // Show success message
        showNotification('Registration submitted successfully!', 'success');
        
        // Redirect to success page
        setTimeout(() => {
            window.location.href = 'success.html';
        }, 1000);
    }, 500);
}

/**
 * Submit form data to Azure Functions API
 * @param {Object} formData - Form data to submit
 */
function submitToAPI(formData) {
    log('Submitting data to Azure Functions API...');
    
    // Prepare request
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
    };
    
    // Set timeout for API call
    const timeoutId = setTimeout(() => {
        logError('API request timeout');
        handleAPIError(new Error('Request timeout'));
    }, API_CONFIG.TIMEOUT);
    
    // Make API call
    fetch(API_CONFIG.ENDPOINT, requestOptions)
        .then(response => {
            clearTimeout(timeoutId);
            
            // Check if response is OK
            if (!response.ok) {
                throw new Error(`API responded with status ${response.status}`);
            }
            
            return response.json();
        })
        .then(data => {
            log('API submission successful', data);
            handleAPISuccess(formData, data);
        })
        .catch(error => {
            clearTimeout(timeoutId);
            logError('API submission failed', error);
            handleAPIError(error);
        });
}

/**
 * Handle successful API submission
 * @param {Object} formData - Original form data
 * @param {Object} apiResponse - Response from API
 */
function handleAPISuccess(formData, apiResponse) {
    log('API submission successful');
    
    // Store data in sessionStorage
    sessionStorage.setItem('registrationData', JSON.stringify(formData));
    
    // Show success message
    showNotification('Registration submitted successfully!', 'success');
    
    // Re-enable submit button
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Registration';
    }
    
    // Redirect to success page
    setTimeout(() => {
        window.location.href = 'success.html';
    }, 1000);
}

/**
 * Handle API submission error
 * @param {Error} error - Error object
 */
function handleAPIError(error) {
    logError('API submission error', error);
    
    // Determine error type and message
    let errorMessage = 'Failed to submit registration. Please try again.';
    
    if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please check your connection and try again.';
    } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
    }
    
    // Show error message
    showNotification(errorMessage, 'error');
    
    // Re-enable submit button
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Registration';
    }
}

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Type: 'success', 'error', 'info', 'warning'
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        background-color: ${
            type === 'success' ? '#27ae60' :
            type === 'error' ? '#e74c3c' :
            type === 'warning' ? '#f39c12' :
            '#3498db'
        };
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
    
    // Log notification
    log(`Notification [${type}]: ${message}`);
}

/**
 * Format form data for API submission
 * Converts form data to the format expected by Azure Cosmos DB
 * @param {Object} formData - Raw form data
 * @returns {Object} Formatted data
 */
function formatDataForAPI(formData) {
    return {
        customerId: formData.customerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        email: formData.email,
        gender: formData.gender,
        dateOfBirth: formData.dob,
        city: formData.city,
        state: formData.state,
        address: formData.address,
        category: formData.category,
        comments: formData.comments,
        createdDate: formData.createdDate
    };
}

// ===========================
// CSS ANIMATIONS FOR NOTIFICATIONS
// ===========================
// These animations are injected dynamically

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            left: 20px !important;
            right: 20px !important;
            max-width: none !important;
        }
    }
`;
document.head.appendChild(style);
