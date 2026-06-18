/*
 * Configuration File
 * This file contains all application configuration and constants
 * Used by: validation.js, submit.js
 * Author: WDR176
 */

// ===========================
// API CONFIGURATION
// ===========================

const API_CONFIG = {
    // Future Azure Function API Endpoint
    // Replace with your actual Azure Function URL when ready
    ENDPOINT: 'https://your-azure-function-url.azurewebsites.net/api/customers',
    
    // API timeout in milliseconds
    TIMEOUT: 5000,
    
    // Enable/Disable API calls (for testing)
    ENABLED: false // Set to true when Azure Functions are ready
};

// ===========================
// FORM CONFIGURATION
// ===========================

const FORM_CONFIG = {
    // Form ID
    FORM_ID: 'registrationForm',
    
    // Customer ID prefix
    CUSTOMER_ID_PREFIX: 'CUST',
    
    // Customer ID padding (e.g., CUST001)
    CUSTOMER_ID_PADDING: 3,
    
    // Maximum comment length
    MAX_COMMENTS: 500
};

// ===========================
// VALIDATION RULES
// ===========================

const VALIDATION_RULES = {
    firstName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        errorMessage: 'First name must be 2-50 characters (letters, spaces, hyphens, and apostrophes only)'
    },
    
    lastName: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s'-]+$/,
        errorMessage: 'Last name must be 2-50 characters (letters, spaces, hyphens, and apostrophes only)'
    },
    
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        errorMessage: 'Please enter a valid email address (e.g., user@example.com)'
    },
    
    mobile: {
        required: true,
        pattern: /^[0-9]{10}$/,
        errorMessage: 'Mobile number must be exactly 10 digits'
    },
    
    gender: {
        required: true,
        errorMessage: 'Please select a gender'
    },
    
    dob: {
        required: true,
        errorMessage: 'Please select a valid date of birth',
        minAge: 18, // Minimum age in years
        maxAge: 100 // Maximum age in years
    },
    
    city: {
        required: true,
        minLength: 2,
        maxLength: 30,
        pattern: /^[a-zA-Z\s'-]+$/,
        errorMessage: 'City must be 2-30 characters (letters, spaces, hyphens, and apostrophes only)'
    },
    
    state: {
        required: true,
        minLength: 2,
        maxLength: 30,
        pattern: /^[a-zA-Z\s'-]+$/,
        errorMessage: 'State must be 2-30 characters (letters, spaces, hyphens, and apostrophes only)'
    },
    
    address: {
        required: true,
        minLength: 5,
        maxLength: 100,
        errorMessage: 'Address must be 5-100 characters'
    },
    
    category: {
        required: true,
        errorMessage: 'Please select a preferred clothing category'
    },
    
    comments: {
        required: false,
        maxLength: 500,
        errorMessage: 'Comments must not exceed 500 characters'
    }
};

// ===========================
// FIELD DEFINITIONS
// ===========================

const FORM_FIELDS = [
    'customerId',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'gender',
    'dob',
    'city',
    'state',
    'address',
    'category',
    'comments'
];

// ===========================
// MESSAGES
// ===========================

const MESSAGES = {
    // Success Messages
    SUCCESS: {
        SUBMIT: 'Registration submitted successfully!',
        VALIDATION: 'All fields are valid!',
        API_CALL: 'Data submitted to server successfully!'
    },
    
    // Error Messages
    ERROR: {
        VALIDATION_FAILED: 'Please fix the errors in the form',
        API_CALL_FAILED: 'Failed to submit registration. Please try again.',
        NETWORK_ERROR: 'Network error. Please check your connection and try again.',
        TIMEOUT_ERROR: 'Request timeout. Please try again.',
        REQUIRED_FIELD: 'This field is required',
        INVALID_FORMAT: 'Invalid format'
    },
    
    // Info Messages
    INFO: {
        PROCESSING: 'Processing your registration...',
        VALIDATING: 'Validating form...'
    }
};

// ===========================
// CLOTHING CATEGORIES
// ===========================

const CLOTHING_CATEGORIES = [
    'Men',
    'Women',
    'Kids',
    'Accessories',
    'All'
];

// ===========================
// GENDER OPTIONS
// ===========================

const GENDER_OPTIONS = [
    'Male',
    'Female',
    'Other',
    'Prefer not to say'
];

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Generate a unique Customer ID
 * Format: CUST + 3-digit number (e.g., CUST001)
 * @returns {string} Generated Customer ID
 */
function generateCustomerId() {
    // Get timestamp and convert to a number
    const timestamp = Date.now();
    // Use modulo to get a reasonably unique 3-digit number
    const uniqueNumber = (timestamp % 1000).toString().padStart(FORM_CONFIG.CUSTOMER_ID_PADDING, '0');
    return `${FORM_CONFIG.CUSTOMER_ID_PREFIX}${uniqueNumber}`;
}

/**
 * Get current date in ISO format (YYYY-MM-DD)
 * @returns {string} Current date in ISO format
 */
function getCurrentDate() {
    return new Date().toISOString();
}

/**
 * Format date from YYYY-MM-DD to readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', options);
}

/**
 * Calculate age from date of birth
 * @param {string} dobString - Date of birth in YYYY-MM-DD format
 * @returns {number} Age in years
 */
function calculateAge(dobString) {
    const dob = new Date(dobString + 'T00:00:00');
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    return age;
}

/**
 * Log information for debugging (can be disabled in production)
 * @param {string} message - Log message
 * @param {*} data - Data to log
 */
function log(message, data = null) {
    if (typeof DEVELOPMENT !== 'undefined' && DEVELOPMENT) {
        console.log(`[CUT APP] ${message}`, data || '');
    }
}

/**
 * Log errors for debugging
 * @param {string} message - Error message
 * @param {*} error - Error object or data
 */
function logError(message, error = null) {
    console.error(`[CUT APP ERROR] ${message}`, error || '');
}

// ===========================
// DEVELOPMENT MODE FLAG
// ===========================
// Set to true for development/debugging, false for production
const DEVELOPMENT = false;

// ===========================
// EXPORT FOR USE IN OTHER FILES
// ===========================
// These variables and functions can be used in validation.js and submit.js
