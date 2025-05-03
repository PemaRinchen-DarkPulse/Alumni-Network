Sign Up
Create a responsive sign-up form using React and Bootstrap with the following tech stack:

Frontend:
- React
- Bootstrap
- Font Awesome (for icons)
- Reactstrap
- React Toastify (for notifications)
- React Router Dom (for navigation)
- Data fetching with Fetch API or Axios

Backend:
- Express.js
- Node.js
- MongoDB (for database storage)

Form Requirements:
1. Name (text input)
2. Email (email input)
3. Password (password input with toggle visibility option using Font Awesome icons)
4. Role (dropdown selection with options: "Alumni with batch", "Student with batch", and "Teacher")

The form should have the following functionality:
- User data must be saved in MongoDB database
- When a user signs up, send a verification link to their registered email
- If the email already exists in the system, display "Email already exists" toast notification
- If registration is successful, display "Verification link sent to email" toast and redirect to the login page using React Router
- Include proper password validation with requirements display
- Add a conditional batch selection field that appears when "Alumni" or "Student" is selected
- Include terms and privacy policy agreement checkbox
- Add a "Sign up with Google" option
- Include a link to the login page for existing users

Please provide both frontend React components and backend Express routes needed to implement this functionality. Include explanations of how to set up the MongoDB schema and how the API endpoints should interact with the database.


2. Sign In
Create a responsive sign-in system with password reset functionality using the following tech stack:

Frontend:
- React
- Bootstrap
- Font Awesome (for icons)
- Reactstrap
- React Toastify (for notifications)
- React Router Dom (for navigation)
- Data fetching with Fetch API or Axios

Backend:
- Express.js
- Node.js
- MongoDB (for database storage)

Sign In Form Requirements:
1. Email (email input)
2. Password (password input with toggle visibility option using Font Awesome icons)
3. "Forgot Password" link
4. "Remember Me" checkbox option (optional)
5. Sign In button

Password Reset Flow:
1. When "Forgot Password" is clicked, redirect to a password reset page
2. Password reset page should have an email input field and submit button
3. After submitting valid email, send a password reset link to that email
4. When user clicks the link in email, direct them to a page to enter new password
5. After successful password reset, update the password in MongoDB database
6. Display success message and redirect to login page

Authentication Features:
- Implement JWT (JSON Web Token) for session management
- After successful login, redirect users to appropriate dashboard based on role:
  * Student Dashboard
  * Alumni Dashboard
  * Teacher Dashboard
- Display appropriate toast notifications for:
  * "Email doesn't exist" when email not found in database
  * "Incorrect password" when password doesn't match
  * "Password reset link sent" after reset request
  * "Password updated successfully" after reset completion
  * "Login successful" after successful authentication

Security Requirements:
- Store passwords as hashed values in the database (using bcrypt)
- Implement proper validation on both client and server side
- Ensure password reset tokens are secure and time-limited
- Protect routes to require authentication

Please provide both frontend React components and backend Express routes needed to implement this functionality. Include explanations of how to set up the MongoDB schema, authentication middleware, and how the API endpoints should interact with the database for user authentication and password reset.

side bar
Create a reusable sidebar component in React that changes its content based on user roles (Alumni, Student, Teacher). The component should:

1. Use the following tech stack:
   - Frontend: React, Bootstrap, Font Awesome (for icons), Reactstrap, React Toastify, React Router Dom
   - Backend: Express, Node, MongoDB
   - Data fetching: Fetch API and Axios

2. Have a collapsible behavior that shows only icons when collapsed and expands to show text labels when the hamburger icon is clicked

3. Follow this layout structure:
   - Fixed navbar at the top that spans the full width
   - Vertical sidebar that starts below the navbar and extends to the bottom of the screen
   - When expanded, sidebar should show icons with text labels
   - When collapsed, sidebar should only show icons
   - The sidebar should have the same visual design regardless of role, only the menu items change

4. Implement the following role-based menu items:

   For Alumni:
   - Alumni Directory
   - Alumni Blog
   - Mentorship (conditionally shown only if they signed up as a mentor)
   - Events
   - Photos/video uploads
   - Discussion Forum
   - Tribute to teacher
   - Collaboration

   For Student:
   - Alumni Directory
   - Alumni Blog Session
   - Mentorship
   - Events
   - Photos/videos
   - Collaboration

   For Teacher:
   - Alumni Directory
   - Events
   - Alumni Feedback
   - Blog Post
   - Photos/video Upload
   - Tribute
   - Collaboration

5. Include a navbar that has:
   - Left side: Hamburger menu icon and "Alumni Connect" text
   - Right side: Profile icon (dropdown with options: profile, settings, become mentor (if alumni), and logout), notification icon, settings icon, and message icon

6. Ensure the component is reusable and checks for existing components before creating new ones

7. Make sure the positioning and layout match exactly the reference image I provided, with the navbar at the top and sidebar extending vertically along the left side of the screen

Please provide the complete React component code with appropriate styling to achieve this specific layout. Include necessary context providers or hooks for role-based rendering and authentication.