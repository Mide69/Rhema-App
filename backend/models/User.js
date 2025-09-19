const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  role: { 
    type: String, 
    enum: ['student', 'admin', 'instructor', 'alumni'], 
    default: 'student' 
  },
  profileImage: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female'] },
  address: {
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'Nigeria' }
  },
  campus: { 
    type: String, 
    enum: ['Lagos', 'Ibadan', 'Abuja', 'Port Harcourt'], 
    default: 'Lagos' 
  },
  studentId: { type: String, unique: true, sparse: true },
  enrollmentDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  fcmToken: String, // For push notifications
  lastLogin: Date,
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    language: { type: String, default: 'en' }
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ email: 1, studentId: 1, campus: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate student ID
userSchema.pre('save', async function(next) {
  if (this.role === 'student' && !this.studentId) {
    const year = new Date().getFullYear();
    const campus = this.campus.substring(0, 3).toUpperCase();
    const count = await this.constructor.countDocuments({ role: 'student', campus: this.campus });
    this.studentId = `RBTC${year}${campus}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);