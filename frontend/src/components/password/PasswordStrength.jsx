// src/components/common/PasswordStrength.jsx
import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PasswordStrength = ({ password }) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const passedChecks = Object.values(checks).filter(Boolean).length;
  
  let label, color, barColor;
  if (passedChecks <= 1) { label = 'Weak'; color = 'text-red-500'; barColor = 'bg-red-500'; }
  else if (passedChecks <= 3) { label = 'Fair'; color = 'text-orange-500'; barColor = 'bg-orange-500'; }
  else if (passedChecks <= 4) { label = 'Good'; color = 'text-blue-500'; barColor = 'bg-blue-500'; }
  else { label = 'Strong'; color = 'text-green-500'; barColor = 'bg-green-500'; }

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-600">Password Strength:</span>
        <span className={`text-xs font-semibold ${color}`}>{label}</span>
      </div>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              index <= passedChecks ? barColor : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {Object.entries(checks).map(([key, passed]) => (
          <div key={key} className="flex items-center text-xs">
            {passed ? (
              <FaCheckCircle className="text-green-500 mr-1" size={12} />
            ) : (
              <FaTimesCircle className="text-gray-300 mr-1" size={12} />
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

export default PasswordStrength;