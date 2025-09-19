# RBTC Nigeria Database Schema

## Collections Overview

### 1. Users Collection
- **Purpose**: Store student, admin, instructor, and alumni information
- **Key Fields**: 
  - Personal info (name, email, phone, address)
  - Authentication (password, tokens)
  - Role-based access (student, admin, instructor, alumni)
  - Campus assignment
  - Student ID generation
  - Preferences and settings

### 2. Courses Collection
- **Purpose**: Manage course catalog and enrollment
- **Key Fields**:
  - Course details (title, code, description)
  - Instructor assignment
  - Schedule and venue information
  - Enrollment management
  - Learning materials
  - Live streaming integration
  - Prerequisites and fees

### 3. Payments Collection
- **Purpose**: Handle all financial transactions
- **Key Fields**:
  - Payment types (tuition, tithe, donation, offering)
  - Gateway integration (Paystack, Flutterwave)
  - Transaction status tracking
  - Receipt generation
  - Refund management

### 4. Exams Collection
- **Purpose**: Online examination system
- **Key Fields**:
  - Question management (multiple choice, essay, etc.)
  - Time limits and attempts
  - Scoring and grading
  - Results tracking

### 5. ExamResults Collection
- **Purpose**: Store student exam performance
- **Key Fields**:
  - Student answers and scores
  - Time tracking
  - Attempt management
  - Performance analytics

### 6. Notifications Collection
- **Purpose**: Push notifications and alerts
- **Key Fields**:
  - Message content and type
  - Delivery status
  - User targeting
  - Scheduling

### 7. Forums Collection (2023 Q3)
- **Purpose**: Community discussion boards
- **Key Fields**:
  - Topics and categories
  - Posts and replies
  - Moderation features
  - User interactions

### 8. Alumni Collection (2023 Q4)
- **Purpose**: Alumni portal and networking
- **Key Fields**:
  - Graduation information
  - Career tracking
  - Event management
  - Networking features

## Indexes for Performance

```javascript
// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "studentId": 1 }, { unique: true, sparse: true })
db.users.createIndex({ "campus": 1, "role": 1 })

// Course indexes
db.courses.createIndex({ "title": "text", "description": "text" })
db.courses.createIndex({ "category": 1, "level": 1 })
db.courses.createIndex({ "instructor": 1 })

// Payment indexes
db.payments.createIndex({ "student": 1, "status": 1 })
db.payments.createIndex({ "reference": 1 }, { unique: true })
db.payments.createIndex({ "createdAt": -1 })

// Exam indexes
db.exams.createIndex({ "course": 1, "isActive": 1 })
db.examresults.createIndex({ "exam": 1, "student": 1, "attemptNumber": 1 }, { unique: true })
```

## Data Relationships

1. **User → Course**: Many-to-Many (enrollment)
2. **User → Payment**: One-to-Many (student payments)
3. **Course → Exam**: One-to-Many (course exams)
4. **User → ExamResult**: One-to-Many (student results)
5. **User → Notification**: One-to-Many (user notifications)

## Security Considerations

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure file upload handling