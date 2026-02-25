const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  // Personal Information
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required'],
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'Invalid blood group'
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    default: 'Prefer not to say'
  },

  // Contact Information
  phone: {
    type: String,
    required: [true, 'Primary phone number is required'],
    validate: {
      validator: function(phone) {
        // More flexible phone validation - allow various formats
        const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      },
      message: 'Invalid phone number format'
    }
  },
  alternatePhone: {
    type: String,
    validate: {
      validator: function(phone) {
        if (!phone) return true; // Optional field
        const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
      },
      message: 'Invalid alternate phone number format'
    }
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, 'Emergency contact name is required'],
      trim: true,
      maxlength: [100, 'Emergency contact name cannot be more than 100 characters']
    },
    phone: {
      type: String,
      required: [true, 'Emergency contact phone is required'],
      validate: {
        validator: function(phone) {
          const phoneRegex = /^[\+]?[1-9][\d\s\-\(\)]{7,15}$/;
          return phoneRegex.test(phone.replace(/\s/g, ''));
        },
        message: 'Invalid emergency contact phone number format'
      }
    }
  },

  // Medical Information
  disease: {
    type: Boolean,
    default: false
  },
  diseaseDetails: {
    type: String,
    trim: true,
    maxlength: [500, 'Disease details cannot be more than 500 characters']
  },
  allergies: {
    type: String,
    trim: true,
    maxlength: [300, 'Allergies information cannot be more than 300 characters']
  },
  medications: {
    type: String,
    trim: true,
    maxlength: [300, 'Medications information cannot be more than 300 characters']
  },

  // Other Information
  address: {
    type: String,
    trim: true,
    maxlength: [200, 'Address cannot be more than 200 characters']
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },

  // System fields
  uniqueId: {
    type: String
  },
  qrCodeUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate unique ID before saving
userSchema.pre('save', function(next) {
  if (!this.uniqueId) {
    this.uniqueId = this._id.toString();
  }
  next();
});

// Indexes for better performance
userSchema.index({ uniqueId: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ createdAt: -1 });

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (this.dateOfBirth) {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  return null;
});

// Method to get public emergency data (excludes sensitive info)
userSchema.methods.getEmergencyData = function() {
  return {
    uniqueId: this.uniqueId,
    name: this.name,
    age: this.age,
    bloodGroup: this.bloodGroup,
    phone: this.phone,
    alternatePhone: this.alternatePhone,
    emergencyContact: this.emergencyContact,
    disease: this.disease,
    diseaseDetails: this.diseaseDetails,
    allergies: this.allergies,
    medications: this.medications,
    notes: this.notes
  };
};

module.exports = mongoose.model('User', userSchema);