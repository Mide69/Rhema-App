# RBTC Nigeria API Documentation

## Base URL
```
Production: https://api.rbtc-nigeria.com
Development: http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /auth/register
Register a new student account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+2348012345678",
  "password": "securepassword",
  "campus": "Lagos",
  "dateOfBirth": "1995-01-15",
  "gender": "male"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "studentId": "RBTC2024LAG0001",
    "campus": "Lagos",
    "role": "student"
  }
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securepassword",
  "fcmToken": "firebase_token_for_notifications"
}
```

### Student Routes (`/api/students`)

#### GET /students/profile
Get current student profile (Protected).

#### PUT /students/profile
Update student profile (Protected).

#### GET /students/courses
Get enrolled courses for current student (Protected).

#### POST /students/enroll/:courseId
Enroll in a course (Protected).

### Course Routes (`/api/courses`)

#### GET /courses
Get all available courses.

**Query Parameters:**
- `campus`: Filter by campus
- `category`: Filter by category
- `level`: Filter by level
- `search`: Search in title and description

#### GET /courses/:id
Get course details by ID.

#### POST /courses (Admin/Instructor only)
Create a new course.

#### PUT /courses/:id (Admin/Instructor only)
Update course details.

### Payment Routes (`/api/payments`)

#### POST /payments/initialize
Initialize a payment transaction.

**Request Body:**
```json
{
  "type": "tuition",
  "amount": 50000,
  "description": "Semester 1 Tuition Fee",
  "courseId": "course_id_optional"
}
```

#### GET /payments/verify/:reference
Verify payment status.

#### GET /payments/history
Get payment history for current user.

### Exam Routes (`/api/exams`)

#### GET /exams/student
Get available exams for current student.

#### POST /exams/:id/start
Start an exam session.

#### POST /exams/:id/submit
Submit exam answers.

#### GET /exams/:id/result
Get exam result.

### Admin Routes (`/api/admin`)

#### GET /admin/dashboard
Get dashboard statistics (Admin only).

#### GET /admin/students
Get all students with pagination (Admin only).

#### GET /admin/payments
Get all payments with filters (Admin only).

#### POST /admin/notifications
Send notifications to users (Admin only).

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per 15-minute window per IP address.

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Format:**
```json
{
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```