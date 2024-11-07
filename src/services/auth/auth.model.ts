import mongoose from 'mongoose'

const UserRole = {
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT'
};

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userType: {
      type: String,
      required: true,
    },
    otp: {
      type: Number || null
    },
    number: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
    },
    password: {
      type: String,
    },
    updatedAt: {
      type: Date,
    },
  },
  { timestamps: true, versionKey: false },
);

UserSchema.set('toJSON', {
  virtuals: true,
});


const User = mongoose.model('User', UserSchema);

export {
  UserSchema,
  User,
  UserRole,
};
