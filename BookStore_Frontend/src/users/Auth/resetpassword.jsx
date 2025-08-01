import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

// Background image for reset password page
const resetPasswordBackgroundImage = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState('');

  useEffect(() => {
    // Validate token on component mount
    // This is a placeholder - in a real app, you would verify the token with your backend
    const validateToken = async () => {
      try {
        // Simulate API call for demo purposes
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo, we'll assume the token is valid if it's at least 10 characters
        if (!token || token.length < 10) {
          setTokenValid(false);
          setMessage('Invalid or expired password reset link.');
        }
      } catch {
        setTokenValid(false);
        setMessage('Error validating reset link. Please try again.');
      }
    };

    validateToken();
  }, [token]);

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      setPasswordFeedback('');
      return;
    }

    let strength = 0;
    let feedback = '';

    // Length check
    if (password.length >= 8) {
      strength += 1;
    } else {
      feedback = 'Password should be at least 8 characters';
    }

    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength === 5) {
      feedback = 'Strong password';
    } else if (strength >= 3) {
      feedback = 'Good password';
    } else if (strength >= 2) {
      feedback = 'Moderate password';
    } else {
      feedback = 'Weak password';
    }

    setPasswordStrength(strength);
    setPasswordFeedback(feedback);
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setIsSuccess(false);
      setMessage('Passwords do not match.');
      return;
    }

    // Validate password strength
    if (passwordStrength < 3) {
      setIsSuccess(false);
      setMessage('Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // This is a placeholder - in a real app, you would connect to your backend API
      // const response = await axios.post('https://localhost:7120/api/Auth/reset-password', {
      //   token,
      //   newPassword: password
      // });
      
      // Simulate API call for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      setMessage('Your password has been reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch {
      setIsSuccess(false);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render invalid token message
  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center"
        >
          <div className="text-red-500 mb-4">
            <i className="fas fa-exclamation-circle text-5xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <Link 
            to="/forgot-password"
            className="inline-block bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Request New Reset Link
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Create a new secure password for your account</p>
          </div>
          
          {message && (
            <div className={`mb-6 p-4 ${isSuccess ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'} rounded`}>
              <div className="flex items-center">
                <i className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2`}></i>
                <p>{message}</p>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  required
                  minLength="8"
                />
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                      <div 
                        className={`h-full rounded-full ${passwordStrength <= 2 ? 'bg-red-500' : passwordStrength <= 3 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{passwordFeedback}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords do not match</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-primary font-medium hover:underline">
                Back to login
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img 
          src={resetPasswordBackgroundImage} 
          alt="Books on desk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 to-primary/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md text-center"
          >
            <h1 className="text-4xl font-bold mb-6 font-serif">Create a Strong Password</h1>
            <p className="text-xl mb-8">Protect your account with these password tips:</p>
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <i className="fas fa-check text-xl"></i>
                </div>
                <p className="text-left">Use at least 8 characters</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <i className="fas fa-check text-xl"></i>
                </div>
                <p className="text-left">Mix uppercase and lowercase letters</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <i className="fas fa-check text-xl"></i>
                </div>
                <p className="text-left">Include numbers and special characters</p>
              </div>
              <div className="flex items-center">
                <div className="bg-white/20 p-2 rounded-full mr-4">
                  <i className="fas fa-check text-xl"></i>
                </div>
                <p className="text-left">Avoid using personal information</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
