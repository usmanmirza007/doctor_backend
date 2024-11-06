import mongoose from 'mongoose'

const AuthRole = {
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT'
};

const AuthSchema = new mongoose.Schema(
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

AuthSchema.set('toJSON', {
  virtuals: true,
});


const Auth = mongoose.model('Auth', AuthSchema);

export {
  AuthSchema,
  Auth,
  AuthRole,
};
