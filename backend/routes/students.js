const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const { authenticate, isStudent } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/students/profile
// @desc    Get current student profile
// @access  Private (Student)
router.get('/profile', authenticate, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    res.json({ student });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private (Student)
router.put('/profile', [
  authenticate,
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().isMobilePhone(),
  body('dateOfBirth').optional().isISO8601(),
  body('gender').optional().isIn(['male', 'female'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const student = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', student });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/courses
// @desc    Get enrolled courses for current student
// @access  Private (Student)
router.get('/courses', authenticate, async (req, res) => {
  try {
    const courses = await Course.find({
      enrolledStudents: req.user.id,
      isActive: true
    }).populate('instructor', 'firstName lastName email');

    res.json({ courses });
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/students/enroll/:courseId
// @desc    Enroll in a course
// @access  Private (Student)
router.post('/enroll/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.isActive) {
      return res.status(400).json({ message: 'Course is not active' });
    }

    if (course.enrolledStudents.length >= course.capacity) {
      return res.status(400).json({ message: 'Course is full' });
    }

    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Check if student's campus matches course campus
    const student = await User.findById(req.user.id);
    if (!course.campus.includes(student.campus)) {
      return res.status(400).json({ message: 'Course not available for your campus' });
    }

    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json({ message: 'Successfully enrolled in course', course });
  } catch (error) {
    console.error('Course enrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/students/unenroll/:courseId
// @desc    Unenroll from a course
// @access  Private (Student)
router.delete('/unenroll/:courseId', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (!course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({ message: 'Not enrolled in this course' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(
      studentId => studentId.toString() !== req.user.id
    );
    await course.save();

    res.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Course unenrollment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/students/dashboard
// @desc    Get student dashboard data
// @access  Private (Student)
router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    
    // Get enrolled courses
    const enrolledCourses = await Course.find({
      enrolledStudents: req.user.id,
      isActive: true
    }).populate('instructor', 'firstName lastName');

    // Get upcoming assignments/exams (placeholder)
    const upcomingEvents = [];

    // Get recent notifications (placeholder)
    const notifications = [];

    res.json({
      student,
      enrolledCourses,
      upcomingEvents,
      notifications,
      stats: {
        totalCourses: enrolledCourses.length,
        completedAssignments: 0,
        pendingPayments: 0
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;