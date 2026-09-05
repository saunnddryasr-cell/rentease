// src/components/auth/Register.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaPhone, 
  FaEye, 
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaHome,
  FaCity,
  FaMapMarkerAlt,
  FaBuilding
} from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    acceptTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: 'Weak',
    color: 'red',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false
    }
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  // Password strength checker
  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password);
    }
  }, [formData.password]);

  const checkPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    
    let label, color;
    if (passedChecks <= 1) { label = 'Weak'; color = 'red'; }
    else if (passedChecks <= 3) { label = 'Fair'; color = 'orange'; }
    else if (passedChecks <= 4) { label = 'Good'; color = 'blue'; }
    else { label = 'Strong'; color = 'green'; }

    setPasswordStrength({
      score: passedChecks,
      label,
      color,
      checks
    });
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch(name) {
      case 'name':
        if (!value.trim()) error = 'Full name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 8) error = 'Password must be at least 8 characters';
        else if (!/[A-Z]/.test(value)) error = 'Password must contain at least one uppercase letter';
        else if (!/[a-z]/.test(value)) error = 'Password must contain at least one lowercase letter';
        else if (!/[0-9]/.test(value)) error = 'Password must contain at least one number';
        break;
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
      case 'phone':
        if (!value) error = 'Phone number is required';
        else if (!/^[0-9+\-\s()]{10,15}$/.test(value)) error = 'Please enter a valid phone number';
        break;
      case 'street':
        if (step === 2 && !value.trim()) error = 'Street address is required';
        break;
      case 'city':
        if (step === 2 && !value.trim()) error = 'City is required';
        break;
      case 'state':
        if (step === 2 && !value.trim()) error = 'State is required';
        break;
      case 'pincode':
        if (step === 2 && !value.trim()) error = 'Pincode is required';
        else if (step === 2 && !/^[0-9]{5,6}$/.test(value)) error = 'Please enter a valid pincode';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
      return;
    }

    // Handle nested address fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
      
      // Validate address field
      if (touched[`${parent}.${child}`]) {
        const error = validateField(child, value);
        setErrors(prev => ({
          ...prev,
          [`${parent}.${child}`]: error
        }));
      }
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field on change
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const value = name.includes('.') 
      ? name.split('.').reduce((obj, key) => obj?.[key], formData)
      : formData[name];
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateStep = (stepNumber) => {
    const fields = stepNumber === 1 
      ? ['name', 'email', 'password', 'confirmPassword', 'phone']
      : ['address.street', 'address.city', 'address.state', 'address.pincode'];
    
    let isValid = true;
    const newErrors = {};

    fields.forEach(field => {
      const value = field.includes('.') 
        ? field.split('.').reduce((obj, key) => obj?.[key], formData)
        : formData[field];
      
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));

    return isValid;
  };

  const handleNext = () => {
    if (validateStep(1)) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNext();
      return;
    }

    // Validate step 2
    if (!validateStep(2)) {
      return;
    }

    // Check terms acceptance
    if (!formData.acceptTerms) {
      setErrors(prev => ({
        ...prev,
        acceptTerms: 'You must accept the terms and conditions'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      const { confirmPassword, acceptTerms, ...userData } = formData;
      const result = await dispatch(register(userData));
      
      if (!result.error) {
        toast.success('Registration successful! Welcome to RentEase! 🎉');
        navigate('/');
      } else {
        toast.error(result.payload || 'Registration failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthBar = () => {
    const strengthColors = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500'
    };

    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600">Password Strength:</span>
          <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
            {passwordStrength.label}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                index <= passwordStrength.score 
                  ? strengthColors[passwordStrength.color] 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-1 mt-2">
          {Object.entries(passwordStrength.checks).map(([key, passed]) => (
            <div key={key} className="flex items-center text-xs">
              {passed ? (
                <FaCheckCircle className="text-green-500 mr-1" />
              ) : (
                <FaTimesCircle className="text-gray-300 mr-1" />
              )}
              <span className={passed ? 'text-green-600' : 'text-gray-400'}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Full Name *</label>
        <div className="relative">
          <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur('name')}
            className={`input pl-10 ${errors.name && touched.name ? 'input-error' : ''}`}
            placeholder="John Doe"
            required
          />
        </div>
        {errors.name && touched.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="label">Email Address *</label>
        <div className="relative">
          <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className={`input pl-10 ${errors.email && touched.email ? 'input-error' : ''}`}
            placeholder="you@example.com"
            required
          />
        </div>
        {errors.email && touched.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="label">Phone Number *</label>
        <div className="relative">
          <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={() => handleBlur('phone')}
            className={`input pl-10 ${errors.phone && touched.phone ? 'input-error' : ''}`}
            placeholder="+91 9876543210"
            required
          />
        </div>
        {errors.phone && touched.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      <div>
        <label className="label">Password *</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={() => handleBlur('password')}
            className={`input pl-10 ${errors.password && touched.password ? 'input-error' : ''}`}
            placeholder="Create a strong password"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && touched.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
        {formData.password && getPasswordStrengthBar()}
      </div>

      <div>
        <label className="label">Confirm Password *</label>
        <div className="relative">
          <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={() => handleBlur('confirmPassword')}
            className={`input pl-10 ${errors.confirmPassword && touched.confirmPassword ? 'input-error' : ''}`}
            placeholder="Confirm your password"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && touched.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
        {formData.confirmPassword && formData.password && formData.confirmPassword !== formData.password && (
          <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="btn-primary w-full py-3 text-base"
      >
        Continue to Address
        <span className="ml-2">→</span>
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <label className="label">Street Address *</label>
        <div className="relative">
          <FaHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            onBlur={() => handleBlur('address.street')}
            className={`input pl-10 ${errors['address.street'] && touched['address.street'] ? 'input-error' : ''}`}
            placeholder="123 Main Street, Apartment 4B"
            required
          />
        </div>
        {errors['address.street'] && touched['address.street'] && (
          <p className="text-red-500 text-xs mt-1">{errors['address.street']}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">City *</label>
          <div className="relative">
            <FaCity className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address.city"
              value={formData.address.city}
              onChange={handleChange}
              onBlur={() => handleBlur('address.city')}
              className={`input pl-10 ${errors['address.city'] && touched['address.city'] ? 'input-error' : ''}`}
              placeholder="Mumbai"
              required
            />
          </div>
          {errors['address.city'] && touched['address.city'] && (
            <p className="text-red-500 text-xs mt-1">{errors['address.city']}</p>
          )}
        </div>

        <div>
          <label className="label">State *</label>
          <div className="relative">
            <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address.state"
              value={formData.address.state}
              onChange={handleChange}
              onBlur={() => handleBlur('address.state')}
              className={`input pl-10 ${errors['address.state'] && touched['address.state'] ? 'input-error' : ''}`}
              placeholder="Maharashtra"
              required
            />
          </div>
          {errors['address.state'] && touched['address.state'] && (
            <p className="text-red-500 text-xs mt-1">{errors['address.state']}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Pincode *</label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              onBlur={() => handleBlur('address.pincode')}
              className={`input pl-10 ${errors['address.pincode'] && touched['address.pincode'] ? 'input-error' : ''}`}
              placeholder="400001"
              required
            />
          </div>
          {errors['address.pincode'] && touched['address.pincode'] && (
            <p className="text-red-500 text-xs mt-1">{errors['address.pincode']}</p>
          )}
        </div>

        <div>
          <label className="label">Country</label>
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            className="input bg-gray-100"
            disabled
          />
        </div>
      </div>

      <div className="flex items-start space-x-3 pt-4">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <div>
          <label className="text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </Link>
          </label>
          {errors.acceptTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.acceptTerms}</p>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={handlePrevious}
          className="btn-secondary flex-1 py-3 text-base"
        >
          ← Back
        </button>
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="btn-primary flex-1 py-3 text-base flex items-center justify-center"
        >
          {loading || isSubmitting ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account 🚀'
          )}
        </button>
      </div>
    </div>
  );

  const progressPercentage = (step / 2) * 100;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-primary-100 rounded-full p-3 mb-4">
            <FaUser className="text-primary-600 text-2xl" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="text-gray-600 mt-1">Join RentEase and start renting today!</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span className={step >= 1 ? 'text-primary-600 font-semibold' : ''}>Step 1: Profile</span>
            <span className={step >= 2 ? 'text-primary-600 font-semibold' : ''}>Step 2: Address</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 ? renderStep1() : renderStep2()}
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
              Sign In
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or continue with</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <img src="https://github.com/favicon.ico" alt="GitHub" className="w-5 h-5" />
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;