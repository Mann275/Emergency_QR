const express = require('express');
const QRCode = require('qrcode');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/users/create
// @desc    Create a new user and generate QR code
// @access  Public
router.post('/create', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    const {
      name,
      dateOfBirth,
      bloodGroup,
      gender,
      phone,
      alternatePhone,
      emergencyContact,
      disease,
      diseaseDetails,
      allergies,
      medications,
      address,
      notes
    } = req.body;

    console.log('Extracted fields:', {
      name,
      bloodGroup,
      phone,
      emergencyContact,
      disease
    });

    if (!name || !bloodGroup || !phone || !emergencyContact?.phone) {
      console.error('Missing required fields:', {
        name: !!name,
        bloodGroup: !!bloodGroup,
        phone: !!phone,
        emergencyContactPhone: !!emergencyContact?.phone
      });

      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'bloodGroup', 'phone', 'emergencyContact.phone']
      });
    }

    // Create new user
    const userData = {
      name,
      bloodGroup,
      phone,
      emergencyContact,
      disease: disease || false
    };

    // Add optional fields if provided
    if (dateOfBirth) userData.dateOfBirth = dateOfBirth;
    if (gender) userData.gender = gender;
    if (alternatePhone) userData.alternatePhone = alternatePhone;
    if (diseaseDetails) userData.diseaseDetails = diseaseDetails;
    if (allergies) userData.allergies = allergies;
    if (medications) userData.medications = medications;
    if (address) userData.address = address;
    if (notes) userData.notes = notes;

    const user = new User(userData);
    await user.save();

    // Generate QR code URL
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const profileUrl = `${frontendUrl}/emergency/${user.uniqueId}`;

    // Generate QR code as base64 image
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 256
    });

    // Update user with QR code URL
    user.qrCodeUrl = qrCodeDataUrl;
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Emergency profile created successfully',
      data: {
        uniqueId: user.uniqueId,
        profileUrl,
        qrCode: qrCodeDataUrl,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      console.error('Validation errors:', validationErrors);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors,
        fields: Object.keys(error.errors)
      });
    }

    if (error.code === 11000) {
      console.error('Duplicate key error:', error.keyPattern);
      return res.status(409).json({
        error: 'Profile already exists',
        message: 'A profile with this information already exists'
      });
    }

    console.error('Unexpected error:', error.message);
    res.status(500).json({
      error: 'Failed to create emergency profile',
      message: 'Please try again later',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get public emergency information by unique ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      uniqueId: id,
      isActive: true
    });

    if (!user) {
      return res.status(404).json({
        error: 'Emergency profile not found',
        message: 'The requested emergency profile does not exist or has been deactivated'
      });
    }

    // Return only public emergency data
    const emergencyData = user.getEmergencyData();

    res.json({
      success: true,
      data: {
        ...emergencyData,
        lastUpdated: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      error: 'Failed to fetch emergency profile',
      message: 'Please try again later'
    });
  }
});

// @route   PUT /api/users/update/:id
// @desc    Update user emergency information
// @access  Public (but could be protected with authentication)
router.put('/update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findOne({
      uniqueId: id,
      isActive: true
    });

    if (!user) {
      return res.status(404).json({
        error: 'Emergency profile not found',
        message: 'The requested emergency profile does not exist or has been deactivated'
      });
    }

    // List of fields that can be updated
    const allowedUpdates = [
      'name', 'dateOfBirth', 'bloodGroup', 'gender', 'phone', 'alternatePhone',
      'emergencyContact', 'disease', 'diseaseDetails', 'allergies',
      'medications', 'address', 'notes'
    ];

    // Filter out any fields that aren't allowed to be updated
    const validUpdates = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        validUpdates[field] = updates[field];
      }
    });

    // Apply updates
    Object.assign(user, validUpdates);
    await user.save();

    res.json({
      success: true,
      message: 'Emergency profile updated successfully',
      data: {
        uniqueId: user.uniqueId,
        lastUpdated: user.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating user:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        error: 'Validation failed',
        details: validationErrors
      });
    }

    res.status(500).json({
      error: 'Failed to update emergency profile',
      message: 'Please try again later'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (for admin purposes - remove in production)
// @access  Public (should be protected in production)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({ isActive: true })
      .select('name phone bloodGroup createdAt uniqueId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      error: 'Failed to fetch users',
      message: 'Please try again later'
    });
  }
});

module.exports = router;