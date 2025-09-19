const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['tuition', 'tithe', 'donation', 'offering', 'registration', 'materials'],
    required: true 
  },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'NGN' },
  description: String,
  reference: { type: String, required: true, unique: true },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'bank_transfer', 'ussd', 'qr', 'mobile_money'],
    required: true 
  },
  gateway: { 
    type: String, 
    enum: ['paystack', 'flutterwave', 'stripe'],
    default: 'paystack' 
  },
  gatewayReference: String,
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending' 
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course' 
  },
  semester: String,
  academicYear: String,
  dueDate: Date,
  paidDate: Date,
  metadata: {
    channel: String,
    cardType: String,
    bank: String,
    authorizationCode: String
  },
  receipt: {
    number: String,
    url: String
  },
  refund: {
    amount: Number,
    reason: String,
    date: Date,
    reference: String
  }
}, {
  timestamps: true
});

// Generate receipt number
paymentSchema.pre('save', async function(next) {
  if (this.status === 'completed' && !this.receipt.number) {
    const year = new Date().getFullYear();
    const count = await this.constructor.countDocuments({ status: 'completed' });
    this.receipt.number = `RBTC${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Index for better query performance
paymentSchema.index({ student: 1, type: 1, status: 1 });
paymentSchema.index({ reference: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);