// src/utils/validation.js
import * as yup from 'yup';

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .required('Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'),
  
  address: yup.object().shape({
    street: yup.string().required('Street address is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    pincode: yup
      .string()
      .required('Pincode is required')
      .matches(/^[0-9]{5,6}$/, 'Please enter a valid pincode'),
    country: yup.string().default('India')
  }),
  
  acceptTerms: yup
    .boolean()
    .oneOf([true], 'You must accept the terms and conditions')
});

// Usage with react-hook-form:
// const { register, handleSubmit, formState: { errors } } = useForm({
//   resolver: yupResolver(registerSchema)
// });