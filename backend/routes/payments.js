const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/initialize
// @desc    Initialize a payment transaction
// @access  Private
router.post('/initialize', [
  authenticate,
  body('type').isIn(['tuition', 'tithe', 'donation', 'offering', 'registration', 'materials']),
  body('amount').isFloat({ min: 100 }).withMessage('Minimum amount is ₦100'),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, amount, description, courseId } = req.body;
    
    // Generate unique reference
    const reference = `RBTC_${Date.now()}_${req.user.id}`;

    const payment = new Payment({
      student: req.user.id,
      type,
      amount,
      description,
      reference,
      course: courseId,
      paymentMethod: 'card', // Default, will be updated by gateway
      status: 'pending'
    });

    await payment.save();

    // Initialize payment with Paystack (placeholder)
    const paystackData = {
      email: req.user.email,
      amount: amount * 100, // Convert to kobo
      reference: reference,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      metadata: {
        student_id: req.user.id,
        payment_id: payment._id,
        type: type
      }
    };

    // TODO: Integrate with actual Paystack API
    const authorizationUrl = `https://checkout.paystack.com/pay/${reference}`;

    res.json({
      message: 'Payment initialized successfully',
      payment: {
        id: payment._id,
        reference: payment.reference,
        amount: payment.amount,
        type: payment.type
      },
      authorizationUrl
    });
  } catch (error) {
    console.error('Initialize payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/verify/:reference
// @desc    Verify payment status
// @access  Private
router.get('/verify/:reference', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findOne({ 
      reference: req.params.reference,
      student: req.user.id 
    });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // TODO: Verify with Paystack API
    // For now, simulate verification
    if (payment.status === 'pending') {
      payment.status = 'completed';
      payment.paidDate = new Date();
      await payment.save();
    }

    res.json({
      message: 'Payment verified successfully',
      payment: {
        reference: payment.reference,
        status: payment.status,
        amount: payment.amount,
        type: payment.type,
        paidDate: payment.paidDate
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for current user
// @access  Private
router.get('/history', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    let query = { student: req.user.id };
    if (type) query.type = type;
    if (status) query.status = status;

    const payments = await Payment.find(query)
      .populate('course', 'title code')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/payments/summary
// @desc    Get payment summary for current user
// @access  Private
router.get('/summary', authenticate, async (req, res) => {
  try {
    const summary = await Payment.aggregate([
      { $match: { student: req.user._id } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const totalPaid = await Payment.aggregate([
      { 
        $match: { 
          student: req.user._id, 
          status: 'completed' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$amount' } 
        } 
      }
    ]);

    res.json({
      summary,
      totalPaid: totalPaid[0]?.total || 0
    });
  } catch (error) {
    console.error('Get payment summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle payment gateway webhooks
// @access  Public (but secured with signature verification)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // TODO: Verify webhook signature from Paystack
    const event = req.body;

    if (event.event === 'charge.success') {
      const { reference, status, amount } = event.data;
      
      const payment = await Payment.findOne({ reference });
      if (payment) {
        payment.status = 'completed';
        payment.paidDate = new Date();
        payment.gatewayReference = event.data.id;
        payment.metadata = {
          channel: event.data.channel,
          cardType: event.data.authorization?.card_type,
          bank: event.data.authorization?.bank
        };
        await payment.save();
      }
    }

    res.status(200).json({ message: 'Webhook processed' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ message: 'Webhook processing failed' });
  }
});

module.exports = router;