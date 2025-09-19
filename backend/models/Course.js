const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String, required: true },
  instructor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Theology', 'Biblical Studies', 'Ministry', 'Leadership', 'Evangelism', 'Pastoral Care'],
    required: true 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    default: 'Beginner' 
  },
  credits: { type: Number, required: true, min: 1, max: 6 },
  duration: { type: Number, required: true }, // in weeks
  campus: [{ 
    type: String, 
    enum: ['Lagos', 'Ibadan', 'Abuja', 'Port Harcourt'] 
  }],
  schedule: {
    days: [{ type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }],
    startTime: String,
    endTime: String,
    venue: String
  },
  capacity: { type: Number, default: 50 },
  enrolledStudents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  materials: [{
    title: String,
    type: { type: String, enum: ['pdf', 'video', 'audio', 'link'] },
    url: String,
    size: Number,
    uploadDate: { type: Date, default: Date.now }
  }],
  assignments: [{
    title: String,
    description: String,
    dueDate: Date,
    maxScore: { type: Number, default: 100 },
    isActive: { type: Boolean, default: true }
  }],
  liveStreams: [{
    title: String,
    scheduledDate: Date,
    streamUrl: String,
    platform: { type: String, enum: ['YouTube', 'Vimeo', 'Custom'] },
    isLive: { type: Boolean, default: false }
  }],
  prerequisites: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  }],
  fee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  startDate: Date,
  endDate: Date,
  thumbnail: String,
  tags: [String]
}, {
  timestamps: true
});

// Index for better search performance
courseSchema.index({ title: 'text', description: 'text', tags: 'text' });
courseSchema.index({ category: 1, level: 1, campus: 1 });

// Virtual for enrollment count
courseSchema.virtual('enrollmentCount').get(function() {
  return this.enrolledStudents.length;
});

// Virtual for availability
courseSchema.virtual('isAvailable').get(function() {
  return this.isActive && this.enrolledStudents.length < this.capacity;
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);