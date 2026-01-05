# Alumni Network Backend - User Registration API

## Overview
This is a Spring Boot backend application with MySQL database integration for the Alumni Network platform. It provides user registration functionality with email verification.

## Technology Stack
- Java 21
- Spring Boot 4.0.1
- MySQL 8.0+
- Spring Data JPA
- Spring Security
- Lombok
- Maven

## Features
- ✅ User registration with validation
- ✅ Password encryption (BCrypt)
- ✅ Email verification system
- ✅ Role-based user types (Student, Alumni, Teacher)
- ✅ MySQL database integration
- ✅ CORS configuration for frontend integration
- ✅ Error handling and validation

## Prerequisites
1. **Java 21** - [Download](https://www.oracle.com/java/technologies/downloads/)
2. **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
3. **Maven** (included with Spring Boot)

## Database Setup

### 1. Install and Start MySQL
Make sure MySQL is running on your machine.

### 2. Create Database (Optional)
The application will automatically create the database if it doesn't exist. However, you can manually create it:

```sql
CREATE DATABASE alumni_network;
```

### 3. Configure Database Credentials
Update the database credentials in `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

**Note:** Change `YOUR_MYSQL_PASSWORD` to your actual MySQL root password.

## Running the Application

### Option 1: Using Maven Wrapper (Recommended)
```bash
cd server
./mvnw spring-boot:run
```

On Windows:
```bash
cd server
mvnw.cmd spring-boot:run
```

### Option 2: Using Maven
```bash
cd server
mvn spring-boot:run
```

### Option 3: Using IDE
Open the project in IntelliJ IDEA or Eclipse and run `ServerApplication.java`

The server will start on: **http://localhost:8080**

## API Endpoints

### 1. User Registration
**POST** `/api/auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT",
  "batch": "2020"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "batch": "2020"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Email already registered",
  "data": null
}
```

### 2. Email Verification
**GET** `/api/auth/verify-email?token={verification_token}`

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

## User Roles
- `STUDENT` - Current students (requires batch)
- `ALUMNI` - Graduated students (requires batch)
- `TEACHER` - Faculty members (batch optional)

## Validation Rules
- **Name:** 2-100 characters, required
- **Email:** Valid email format, required, unique
- **Password:** Minimum 8 characters, required
- **Role:** Must be one of: STUDENT, ALUMNI, TEACHER
- **Batch:** Required for STUDENT and ALUMNI roles

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    batch VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    token_expiry DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Development Notes

### Email Verification
Currently, verification tokens are printed to the console for development purposes:
```
Verification token for john@example.com: abc123-xyz789-...
Verification link: http://localhost:5173/verify-email?token=abc123-xyz789-...
```

In production, you should integrate an email service (e.g., SendGrid, AWS SES) to send actual verification emails.

### Security
- Passwords are encrypted using BCrypt
- CSRF protection is disabled for API endpoints (enable for production)
- CORS is configured for `localhost:5173` and `localhost:3000`

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, change it in `application.properties`:
```properties
server.port=8081
```

### MySQL Connection Issues
1. Verify MySQL is running: `mysql -u root -p`
2. Check username/password in `application.properties`
3. Ensure database exists or `createDatabaseIfNotExist=true` is set

### Dependency Issues
Clean and rebuild:
```bash
./mvnw clean install
```

## Testing the API

### Using cURL
```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT",
    "batch": "2020"
  }'

# Verify email
curl http://localhost:8080/api/auth/verify-email?token=YOUR_TOKEN
```

### Using Postman
1. Import the endpoints
2. Set method to POST/GET
3. Set Content-Type to `application/json`
4. Add request body for registration

## Frontend Integration
The frontend is already configured to use this API. Make sure:
1. Backend is running on port 8080
2. Frontend is running on port 5173 (Vite default)
3. CORS is properly configured

## Next Steps
- [ ] Implement login endpoint
- [ ] Add JWT authentication
- [ ] Integrate email service
- [ ] Add password reset functionality
- [ ] Implement refresh tokens
- [ ] Add rate limiting

## License
This project is part of the Alumni Network application.
