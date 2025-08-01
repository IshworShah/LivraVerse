import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long.";
    }

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      errors.email = "Email is required.";
    } else if (!emailPattern.test(email)) {
      errors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required.";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number.";
    }

    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      errors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy.";
    }

    return errors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate the form inputs
    const errors = validateForm();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }

    const userData = {
      username: name,
      email: email,
      passwordHash: password
    };

    try {
      const response = await axios.post('http://localhost:5053/api/Auth/register', userData);

      if (response.status === 201) {
        showSuccess('Registration successful! Redirecting to login...');
        
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please sign in with your new account.' 
            } 
          });
        }, 1500);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMsg = error.response.data || 'Email or Username already exists';
        setError(errorMsg);
        showError(errorMsg);
      } else {
        console.error(error);
        const errorMsg = 'An unexpected error occurred. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'gray', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthMap = {
      1: { color: 'red', text: 'Very Weak' },
      2: { color: 'orange', text: 'Weak' },
      3: { color: 'yellow', text: 'Fair' },
      4: { color: 'lightgreen', text: 'Good' },
      5: { color: 'green', text: 'Strong' }
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex relative overflow-hidden">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse animation-delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>
      </div>

      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center justify-center text-white p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform duration-300">
                <i className="fas fa-user-plus text-3xl text-purple-400 group-hover:text-purple-300 transition-colors duration-300"></i>
              </div>
              <h1 className="text-5xl font-bold mb-4 font-serif bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent animate-fade-in-up">Join Our Community</h1>
              <p className="text-xl text-gray-300 animate-fade-in-up animation-delay-200">Become a part of the LibraVerse family today</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center p-4 glass rounded-xl animate-fade-in-up animation-delay-400">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-users text-xl text-purple-400"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Join Thousands</h3>
                  <p className="text-sm text-gray-400">Connect with fellow book lovers</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 glass rounded-xl animate-fade-in-up animation-delay-600">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-gift text-xl text-purple-400"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Exclusive Benefits</h3>
                  <p className="text-sm text-gray-400">Get early access to new releases</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 glass rounded-xl animate-fade-in-up animation-delay-800">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-star text-xl text-purple-400"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-white">Personalized Experience</h3>
                  <p className="text-sm text-gray-400">Get recommendations tailored to you</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="lg:hidden mb-6">
              <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-4 group hover:scale-110 transition-transform duration-300">
                <i className="fas fa-user-plus text-2xl text-purple-400 group-hover:text-purple-300 transition-colors duration-300"></i>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">Join Our Community</h1>
              <p className="text-gray-400">Create your account to get started</p>
            </div>
            
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mx-auto mb-6 group hover:scale-110 transition-transform duration-300 animate-fade-in-up">
              <i className="fas fa-user-plus text-2xl text-purple-400 group-hover:text-purple-300 transition-colors duration-300"></i>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-3 animate-fade-in-up animation-delay-200">
              Create Account
            </h2>
            <p className="text-gray-400 animate-fade-in-up animation-delay-400">Join thousands of readers worldwide</p>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 glass-dark border border-red-400/30 rounded-2xl animate-fade-in-up">
              <div className="flex items-center">
                <i className="fas fa-exclamation-circle text-red-400 mr-3"></i>
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}
          
          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="animate-fade-in-up animation-delay-600">
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-3">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-user text-purple-400"></i>
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 glass border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-white placeholder-gray-400 ${
                    validationErrors.name 
                      ? 'border-red-400/50 focus:ring-red-500/30 focus:border-red-400' 
                      : 'border-white/20 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              {validationErrors.name && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.name}</p>
              )}
            </div>
            
            <div className="animate-fade-in-up animation-delay-800">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-purple-400"></i>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-12 pr-4 py-4 glass border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-white placeholder-gray-400 ${
                    validationErrors.email 
                      ? 'border-red-400/50 focus:ring-red-500/30 focus:border-red-400' 
                      : 'border-white/20 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {validationErrors.email && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.email}</p>
              )}
            </div>
            
            <div className="animate-fade-in-up animation-delay-1000">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-purple-400"></i>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 glass border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-white placeholder-gray-400 ${
                    validationErrors.password 
                      ? 'border-red-400/50 focus:ring-red-500/30 focus:border-red-400' 
                      : 'border-white/20 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-3">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-3 h-1.5 rounded-full transition-colors duration-300 ${
                            level <= passwordStrength.strength 
                              ? passwordStrength.strength <= 2 ? 'bg-red-400' : passwordStrength.strength <= 3 ? 'bg-yellow-400' : 'bg-green-400'
                              : 'bg-gray-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-400' : passwordStrength.strength <= 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Password must contain at least 8 characters, including uppercase, lowercase, and numbers
                  </p>
                </div>
              )}
              
              {validationErrors.password && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.password}</p>
              )}
            </div>
            
            <div className="animate-fade-in-up animation-delay-1200">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-3">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-purple-400"></i>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-12 pr-12 py-4 glass border rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 text-white placeholder-gray-400 ${
                    validationErrors.confirmPassword 
                      ? 'border-red-400/50 focus:ring-red-500/30 focus:border-red-400' 
                      : 'border-white/20 focus:ring-purple-500/30 focus:border-purple-400'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{validationErrors.confirmPassword}</p>
              )}
            </div>
            
            <div className="flex items-start animate-fade-in-up animation-delay-1400">
              <input 
                id="agreeToTerms"
                type="checkbox" 
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-purple-500 focus:ring-purple-500/30 border-white/20 rounded bg-transparent mt-1"
                required 
              />
              <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-400 group cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-purple-400 hover:text-purple-300 font-medium transition-colors duration-200 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="mt-2 text-sm text-red-400">{validationErrors.agreeToTerms}</p>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] animate-fade-in-up animation-delay-1600 shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Create Account</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </div>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8 animate-fade-in-up animation-delay-1800">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-900/80 text-gray-400">Or continue with</span>
            </div>
          </div>
            
          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up animation-delay-2000">
            <button className="flex items-center justify-center px-4 py-3 glass border border-white/20 rounded-2xl hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 group hover:scale-[1.02]">
              <i className="fab fa-google text-red-400 mr-2"></i>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 glass border border-white/20 rounded-2xl hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 group hover:scale-[1.02]">
              <i className="fab fa-facebook text-blue-400 mr-2"></i>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Facebook</span>
            </button>
          </div>
          
          {/* Sign In Link */}
          <div className="text-center mt-8 animate-fade-in-up animation-delay-2200">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
