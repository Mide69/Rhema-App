const express = require('express');
const { body, validationResult } = require('express-validator');
const Course = require('../models/Course');
const { authenticate, isStaff } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/courses
// @desc    Get all available courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { campus, category, level, search, page = 1, limit = 10 } = req.query;
    
    let query = { isActive: true };
    
    // Apply filters
    if (campus) query.campus = { $in: [campus] };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$text = { $search: search };
    }

    const courses = await Course.find(query)
      .populate('instructor', 'firstName lastName email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course details by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName email profileImage')
      .populate('enrolledStudents', 'firstName lastName studentId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Admin/Instructor)
router.post('/', [
  authenticate,
  isStaff,
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('code').trim().notEmpty().withMessage('Course code is required'),
  body('description').trim().notEmpty().withMessage('Course description is required'),
  body('category').isIn(['Theology', 'Biblical Studies', 'Ministry', 'Leadership', 'Evangelism', 'Pastoral Care']),
  body('credits').isInt({ min: 1, max: 6 }).withMessage('Credits must be between 1 and 6'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 week'),
  body('campus').isArray().withMessage('Campus must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const courseData = {
      ...req.body,
      instructor: req.user.id
    };

    const course = new Course(courseData);
    await course.save();

    await course.populate('instructor', 'firstName lastName email');

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Course code already exists' });
    }
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course details
// @access  Private (Admin/Instructor)
router.put('/:id', [
  authenticate,
  isStaff,
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('category').optional().isIn(['Theology', 'Biblical Studies', 'Ministry', 'Leadership', 'Evangelism', 'Pastoral Care']),
  body('credits').optional().isInt({ min: 1, max: 6 }),
  body('duration').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('instructor', 'firstName lastName email');

    res.json({
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete/deactivate a course
// @access  Private (Admin only)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deactivated successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/courses/categories/list
// @desc    Get all course categories
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = ['Theology', 'Biblical Studies', 'Ministry', 'Leadership', 'Evangelism', 'Pastoral Care'];
  res.json({ categories });
});

module.exports = router;