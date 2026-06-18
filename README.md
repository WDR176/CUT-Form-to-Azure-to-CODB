# CUT Form to Azure to CODB

Customer Registration Web Application for a Clothing Store

## Project Overview

This is a responsive web application that allows customers to submit their details through a professional registration form. The application is designed to be hosted on GitHub Pages and is prepared for future integration with Azure Cosmos DB through Azure Functions API.

## Features

✨ **Current Features:**
- Professional clothing store website with responsive design
- Customer registration form with comprehensive validation
- Auto-generated customer IDs
- Email and phone number validation
- Success confirmation page
- Mobile-friendly layout
- Clean, modern UI design

🔮 **Future Features:**
- Azure Functions API integration
- Azure Cosmos DB NoSQL database backend
- Customer data persistence
- API endpoint: `POST /api/customers`

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla)

### Future Backend
- Azure Functions (Node.js)
- Azure Cosmos DB (NoSQL)

### Hosting
- GitHub Pages
- GitHub Repository (Version Control)

## Folder Structure

```
project/
├── index.html              # Home page
├── form.html               # Customer registration form
├── success.html            # Success/thank you page
├── css/
│   └── style.css           # All styling
├── js/
│   ├── validation.js       # Form validation logic
│   ├── submit.js           # Form submission and data preparation
│   └── config.js           # Configuration and constants
├── assets/
│   ├── logo.png            # Store logo (placeholder)
│   └── banner.jpg          # Store banner (placeholder)
└── README.md               # This file
```

## Pages

### Home Page (index.html)
- Store logo and branding
- Welcome banner
- Store description
- Navigation menu
- Call-to-action registration button

### Registration Form (form.html)
**Fields:**
- Customer ID (Auto-generated)
- First Name
- Last Name
- Mobile Number
- Email Address
- Gender
- Date of Birth
- City
- State
- Address
- Preferred Clothing Category
- Comments

**Validation:**
- Required field validation
- Email format validation
- Mobile number format validation (10 digits)
- Date of birth validation

### Success Page (success.html)
- Success confirmation message
- Registration number display
- Return to home button

## User Flow

1. User opens the website (index.html)
2. User clicks the "Register Now" button
3. User is redirected to the registration form (form.html)
4. User fills in all required fields
5. Form validates all entries in real-time
6. User clicks "Submit"
7. Form data is converted to JSON format
8. Success page displays with registration confirmation (success.html)

## Getting Started

### Local Development
1. Clone the repository
   ```bash
   git clone https://github.com/WDR176/CUT-Form-to-Azure-to-CODB.git
   cd CUT-Form-to-Azure-to-CODB
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   ```

3. Navigate to `http://localhost:8000`

### GitHub Pages Deployment
1. Repository is already configured for GitHub Pages
2. Visit: `https://WDR176.github.io/CUT-Form-to-Azure-to-CODB`

## Future Azure Integration

The application is structured to easily integrate with Azure services:

### Architecture (Future)
```
GitHub Pages (Frontend)
    ↓
Azure Function API
    ↓
Azure Cosmos DB (NoSQL)
```

### API Endpoint (Future)
```
POST /api/customers

Request Body:
{
  "customerId": "CUST001",
  "firstName": "John",
  "lastName": "Doe",
  "mobile": "9876543210",
  "email": "john@example.com",
  "gender": "Male",
  "dateOfBirth": "1990-01-15",
  "city": "Mumbai",
  "state": "Maharashtra",
  "address": "123 Main Street",
  "category": "Men",
  "comments": "Interested in seasonal offers",
  "createdDate": "2026-06-18T10:00:00Z"
}

Response:
{
  "success": true,
  "customerId": "CUST001",
  "message": "Customer registered successfully"
}
```

### Implementation Steps (When Ready)
1. Create Azure Function (Node.js runtime)
2. Configure Cosmos DB connection
3. Update `submit.js` to call Azure Function API
4. Add error handling and loading states
5. Implement data persistence

## Code Structure

### config.js
- Application configuration
- API endpoint constants (to be updated with Azure Function URL)
- Form field definitions
- Validation rules

### validation.js
- Real-time field validation
- Error message display
- Validation helper functions
- Custom validation rules

### submit.js
- Form submission handling
- Data conversion to JSON
- API call preparation (Future: Azure Function integration)
- Success/error handling
- Redirect to success page

## Design Features

✨ **UI/UX Highlights:**
- Professional clothing store branding
- Responsive grid layout
- Mobile-first design approach
- Color scheme optimized for clothing retail
- Smooth transitions and animations
- Clear error messages
- Accessible form elements
- Modern card-based design

## Responsive Design

- **Desktop**: Full layout with sidebar navigation
- **Tablet**: Optimized touch targets and spacing
- **Mobile**: Single column layout, touch-friendly buttons

## Validation Rules

| Field | Validation |
|-------|------------|
| First Name | Required, 2-50 characters |
| Last Name | Required, 2-50 characters |
| Email | Required, valid email format |
| Mobile | Required, 10 digits |
| Gender | Required selection |
| Date of Birth | Required, valid date |
| City | Required, 2-30 characters |
| State | Required, 2-30 characters |
| Address | Required, 5-100 characters |
| Category | Required selection |
| Comments | Optional, max 500 characters |

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Azure Functions backend integration
- [ ] Azure Cosmos DB integration
- [ ] Customer login/authentication
- [ ] Order history tracking
- [ ] Payment gateway integration
- [ ] Email confirmation notifications
- [ ] Admin dashboard for managing customers
- [ ] Analytics tracking
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## Contributing

Contributions are welcome! Please follow these steps:
1. Create a new branch from `develop`
2. Make your changes
3. Test thoroughly
4. Create a pull request

## License

MIT License - Feel free to use this project for commercial and personal purposes.

## Author

WDR176

## Contact & Support

For issues or questions, please create an issue in the GitHub repository.

---

**Last Updated**: June 18, 2026
**Status**: In Development
