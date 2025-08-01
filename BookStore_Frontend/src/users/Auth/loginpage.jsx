import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import useToast from '../../hooks/useToast';
import ToastContainer from '../../components/ToastContainer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loginData = { email, password };

    try {
      const response = await axios.post('http://localhost:5053/api/Auth/login', loginData);

      if (response.status === 200) {
        const token = response.data;
        localStorage.setItem('token', token);

        // Decode the token to check the user's role
        const decoded = jwtDecode(token);
        const role = decoded.role || decoded.Role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const cartID = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid"]
        localStorage.setItem('cartID', cartID);
        const userId = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        localStorage.setItem('userId', userId);

        showSuccess('Login successful! Welcome back!');
        
        setTimeout(() => {
          if (role === 'Admin') {
            navigate('/admin/dashboard');
          } else if (email === 'staff@gmail.com') {
            navigate('/staff/dashboard');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMsg = 'Incorrect password. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      } else if (error.response?.status === 404) {
        const errorMsg = 'Email not found. Please check your email or sign up.';
        setError(errorMsg);
        showError(errorMsg);
      } else {
        const errorMsg = 'An unexpected error occurred. Please try again.';
        setError(errorMsg);
        showError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Left side - Enhanced Design */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-pink-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
          </div>
        </div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 relative z-10">
          <div className="max-w-md text-center animate-fade-in-up">
            <div className="mb-8">
              <div className="w-24 h-24 glass rounded-3xl flex items-center justify-center mx-auto mb-8 animate-float">
                <i className="fas fa-book-open text-4xl text-white"></i>
              </div>
              <h1 className="text-6xl font-bold mb-6 font-serif gradient-text">Welcome Back</h1>
              <p className="text-xl opacity-90 leading-relaxed">Sign in to continue your reading journey and explore endless possibilities</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center p-6 glass rounded-2xl hover-lift animate-fade-in-up animation-delay-200">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mr-5 animate-pulse-glow">
                  <i className="fas fa-book text-2xl text-purple-300"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">Access Your Library</h3>
                  <p className="text-sm opacity-80 leading-relaxed">Browse thousands of books across all genres and discover new worlds</p>
                </div>
              </div>
              
              <div className="flex items-center p-6 glass rounded-2xl hover-lift animate-fade-in-up animation-delay-400">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mr-5 animate-pulse-glow">
                  <i className="fas fa-bookmark text-2xl text-indigo-300"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">Save Favorites</h3>
                  <p className="text-sm opacity-80 leading-relaxed">Create personalized reading lists and track your literary journey</p>
                </div>
              </div>
              
              <div className="flex items-center p-6 glass rounded-2xl hover-lift animate-fade-in-up animation-delay-600">
                <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center mr-5 animate-pulse-glow">
                  <i className="fas fa-truck text-2xl text-pink-300"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg text-white">Fast Delivery</h3>
                  <p className="text-sm opacity-80 leading-relaxed">Get your books delivered to your doorstep with lightning speed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Background for form side */}
        <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm"></div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in-up">
            <div className="lg:hidden mb-6">
              <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                <i className="fas fa-book-open text-3xl text-purple-400"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 gradient-text">Welcome Back</h1>
              <p className="text-gray-300">Sign in to your account</p>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3 gradient-text">Sign In</h2>
            <p className="text-gray-300 leading-relaxed">Enter your credentials to access your account and continue your journey</p>
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
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="animate-fade-in-up animation-delay-200">
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
                  className="w-full pl-12 pr-4 py-4 glass border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="animate-fade-in-up animation-delay-400">
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
                  className="w-full pl-12 pr-12 py-4 glass border border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400 transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter your password"
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
            </div>
            
            <div className="flex items-center justify-between animate-fade-in-up animation-delay-600">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-purple-500 focus:ring-purple-500/30 border-white/20 rounded bg-transparent"
                />
                <span className="ml-3 text-sm text-gray-300 group-hover:text-white transition-colors duration-200">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] animate-fade-in-up animation-delay-800 shadow-lg hover:shadow-purple-500/25"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Sign In</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </div>
              )}
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative my-8 animate-fade-in-up animation-delay-1000">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/80 text-gray-400">Or continue with</span>
            </div>
          </div>
            
          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up animation-delay-1200">
            <button className="flex items-center justify-center px-4 py-3 glass border border-white/20 rounded-2xl hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 group hover:scale-[1.02]">
              <i className="fab fa-google text-red-400 mr-2"></i>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Google</span>
              </button>
            <button className="flex items-center justify-center px-4 py-3 glass border border-white/20 rounded-2xl hover:border-white/30 focus:outline-none focus:ring-4 focus:ring-purple-500/30 transition-all duration-300 group hover:scale-[1.02]">
              <i className="fab fa-facebook text-blue-400 mr-2"></i>
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-200">Facebook</span>
              </button>
          </div>
          
          {/* Sign Up Link */}
          <div className="text-center mt-8 animate-fade-in-up animation-delay-1400">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign up here
            </Link>
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
