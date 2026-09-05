import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FaTools, FaArrowLeft, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MaintenanceRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const rentalId = searchParams.get('rentalId');
  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.issueType || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/maintenance`,
        { ...formData, rentalId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSubmitted(true);
      toast.success('Maintenance request submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Request Submitted! ✅</h3>
          <p className="text-gray-600 mt-2">Your maintenance request has been submitted successfully.</p>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
            Our team will contact you within 24 hours
          </div>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={() => { setSubmitted(false); setFormData({ issueType: '', description: '', priority: 'medium' }); }} className="btn-secondary">
              Submit Another Request
            </button>
            <Link to="/my-rentals" className="btn-primary">
              View My Rentals
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
          <FaArrowLeft className="text-xl" />
        </button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FaTools className="text-primary-600" />
            Maintenance Request
          </h1>
          <p className="text-gray-500 text-sm">Submit a request for maintenance or repair</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type */}
          <div>
            <label className="label">Issue Type *</label>
            <select
              name="issueType"
              value={formData.issueType}
              onChange={handleChange}
              className="select"
              required
            >
              <option value="">Select issue type...</option>
              <option value="damage">Physical Damage</option>
              <option value="breakdown">Breakdown / Not Working</option>
              <option value="maintenance">Regular Maintenance</option>
              <option value="installation">Installation Issue</option>
              <option value="cleaning">Deep Cleaning Required</option>
              <option value="replacement">Part Replacement</option>
              <option value="other">Other Issue</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="label">Priority Level</label>
            <div className="flex flex-wrap gap-2">
              {['low', 'medium', 'high', 'urgent'].map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, priority }))}
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    formData.priority === priority
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Issue Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea"
              rows="4"
              placeholder="Please describe the issue in detail..."
              required
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Min 10 characters</span>
              <span>{formData.description.length} characters</span>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Phone</label>
              <input type="tel" className="input" placeholder="+91 9876543210" />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input type="email" className="input" placeholder="you@example.com" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-3 text-base flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
        <h4 className="font-semibold text-blue-800">Quick Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1 mt-2">
          <li>• Provide clear and detailed description of the issue</li>
          <li>• Upload clear photos if possible (coming soon)</li>
          <li>• Emergency requests will be prioritized</li>
          <li>• Our team will contact you within 24 hours</li>
        </ul>
      </div>
    </div>
  );
};

export default MaintenanceRequest;
