const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['quiz', 'midterm', 'final', 'assignment'],
    required: true 
  },
  questions: [{
    question: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
      required: true 
    },
    options: [String], // For multiple choice
    correctAnswer: String,
    points: { type: Number, default: 1 },
    explanation: String
  }],
  duration: { type: Number, required: true }, // in minutes
  totalPoints: { type: Number, required: true },
  passingScore: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  attempts: { type: Number, default: 1 },
  shuffleQuestions: { type: Boolean, default: false },
  showResults: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  instructions: String
}, {
  timestamps: true
});

const examResultSchema = new mongoose.Schema({
  exam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Exam', 
    required: true 
  },
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: String,
    isCorrect: Boolean,
    points: Number
  }],
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  timeSpent: Number, // in minutes
  attemptNumber: { type: Number, default: 1 },
  feedback: String
}, {
  timestamps: true
});

// Ensure one result per attempt per student
examResultSchema.index({ exam: 1, student: 1, attemptNumber: 1 }, { unique: true });

const Exam = mongoose.model('Exam', examSchema);
const ExamResult = mongoose.model('ExamResult', examResultSchema);

module.exports = { Exam, ExamResult };