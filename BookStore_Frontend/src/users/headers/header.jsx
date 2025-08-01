import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setIsLoggedIn(true);
      fetchCartCount();
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleCartUpdate = () => {
      fetchCartCount();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const fetchCartCount = async () => {
    try {
      const cartId = localStorage.getItem("cartID");
      if (cartId) {
        const response = await axios.get(`http://localhost:5053/api/Cart/${cartId}`);
        let items = [];
        if (response.data.$values) {
          items = response.data.$values;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else if (Array.isArray(response.data.items)) {
          items = response.data.items;
        }
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalCount);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-gray-800 border-b border-gray-600 shadow-2xl' : 'bg-gray-700 border-b border-gray-500'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                <i className="fas fa-book-open text-white text-xl"></i>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-serif leading-none group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                LibraVerse
                </span>
              <span className="text-xs text-purple-200/80 font-medium">Your Literary Haven</span>
            </div>
          </Link>

            {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link 
              to="/books" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
                Shop
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            <Link 
              to="/explore" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
                Explore
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            <Link 
              to="/offers" 
              className="text-white/90 hover:text-white font-medium transition-all duration-300 relative group px-4 py-2 rounded-lg hover:bg-white/10 backdrop-blur-sm"
            >
                Offers
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {isLoggedIn && (
              <Link to="/cart" className="relative group">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:scale-110 border border-white/20">
                  <i className="fas fa-shopping-cart text-lg"></i>
                  </div>
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg animate-pulse">{cartCount}</span>
                </Link>
              )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
              {!isLoggedIn ? (
              <>
                  <Link to="/login">
                  <button className="px-6 py-2 text-white/90 hover:text-white font-medium transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40">
                    Sign In
                    </button>
                  </Link>
                  <Link to="/signup">
                  <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    Get Started
                    </button>
                  </Link>
              </>
              ) : (
              <div className="relative">
                  <button
                    onClick={toggleDropdown}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    U
                  </div>
                  <span className="text-white font-medium">Account</span>
                  <i className={`fas fa-chevron-down text-white/70 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 glass rounded-2xl shadow-2xl border border-white/20 py-3 z-50 backdrop-blur-md">
                    <Link to="/dashboard" className="block px-4 py-3 text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 flex items-center space-x-3">
                      <i className="fas fa-tachometer-alt text-purple-400"></i>
                      <span>Dashboard</span>
                      </Link>
                    <Link to="/profile" className="block px-4 py-3 text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 flex items-center space-x-3">
                      <i className="fas fa-user text-purple-400"></i>
                      <span>Profile</span>
                      </Link>
                    <Link to="/orders" className="block px-4 py-3 text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 flex items-center space-x-3">
                      <i className="fas fa-box text-purple-400"></i>
                      <span>Orders</span>
                      </Link>
                    <Link to="/profile" className="block px-4 py-3 text-white hover:bg-white/10 transition-all duration-300 rounded-lg mx-2 flex items-center space-x-3">
                      <i className="fas fa-heart text-purple-400"></i>
                      <span>Wishlist</span>
                      </Link>
                    <div className="border-t border-white/20 my-2 mx-2"></div>
                      <button
                        onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-lg mx-2 flex items-center space-x-3"
                      >
                      <i className="fas fa-sign-out-alt"></i>
                      <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-white text-xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={toggleMobileMenu}>
            <div className="absolute top-0 right-0 w-80 h-full glass border-l border-white/20" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Menu</h2>
                  <button onClick={toggleMobileMenu} className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300">
                    <i className="fas fa-times text-white"></i>
                  </button>
                </div>
                <div className="space-y-4">
                  <Link 
                    to="/books" 
                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-shopping-bag mr-3"></i>
                    Shop
                  </Link>
                  <Link 
                    to="/explore" 
                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-compass mr-3"></i>
                    Explore
                  </Link>
                  <Link 
                    to="/offers" 
                    className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="fas fa-tag mr-3"></i>
                    Offers
                  </Link>
                  
                  {isLoggedIn && (
                    <>
                      <Link 
                        to="/cart" 
                        className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="fas fa-shopping-cart mr-3"></i>
                        Cart
                      </Link>
                      <Link 
                        to="/dashboard" 
                        className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="fas fa-tachometer-alt mr-3"></i>
                        Dashboard
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="fas fa-user mr-3"></i>
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="fas fa-box mr-3"></i>
                        Orders
                      </Link>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <i className="fas fa-heart mr-3"></i>
                        Wishlist
                      </Link>
                      <div className="border-t border-white/20 my-4"></div>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                      >
                        <i className="fas fa-sign-out-alt mr-3"></i>
                        Sign Out
                      </button>
                    </>
                  )}

                  {!isLoggedIn && (
                    <div className="space-y-3 mt-6">
                      <Link to="/login">
                        <button className="w-full px-6 py-3 text-white/90 hover:text-white font-medium transition-all duration-300 rounded-lg hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40">
                          Sign In
                        </button>
                      </Link>
                      <Link to="/signup">
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                          Get Started
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
