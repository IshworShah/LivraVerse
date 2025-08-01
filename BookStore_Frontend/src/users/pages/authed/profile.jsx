import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = "3AC0974B-46AA-40FB-8913-B8790377509F"; // Replace with localStorage/session if needed

  useEffect(() => {
    const fetchProfileAndWishlist = async () => {
      try {
        // Get user profile
        const userRes = await axios.get(`http://localhost:5053/api/Auth/UserData/${userId}`);
        setUser(userRes.data);

        // Get wishlist with proper error handling
        const wishlistRes = await axios.get("http://localhost:5053/api/Wishlist/wishlist");
        
        // Debug: Log the response structure
        console.log("Wishlist API response:", wishlistRes.data);
        console.log("Is array:", Array.isArray(wishlistRes.data));
        
        // Handle different response structures
        let wishlistData = [];
        if (Array.isArray(wishlistRes.data)) {
          wishlistData = wishlistRes.data;
        } else if (wishlistRes.data && Array.isArray(wishlistRes.data.items)) {
          // Handle case where data is nested: { data: { items: [...] } }
          wishlistData = wishlistRes.data.items;
        } else if (wishlistRes.data && Array.isArray(wishlistRes.data.wishlist)) {
          // Handle case where data is nested: { data: { wishlist: [...] } }
          wishlistData = wishlistRes.data.wishlist;
        } else {
          console.warn("Unexpected wishlist data structure:", wishlistRes.data);
          wishlistData = [];
        }

        // Filter for current user's wishlist items
        const userWishlist = wishlistData.filter((item) => item.userId === userId);

        // Fetch book details for each wishlist item
        const detailedBooks = await Promise.all(
          userWishlist.map(async (item) => {
            try {
              const bookRes = await axios.get(`http://localhost:5053/api/Book/book/${item.bookId}`);
              return {
                ...bookRes.data,
                bookmarkId: item.bookmark, // Include Bookmark ID if needed
              };
            } catch (bookError) {
              console.error(`Error fetching book ${item.bookId}:`, bookError);
              // Return a fallback object if book fetch fails
              return {
                bookId: item.bookId,
                title: "Book not found",
                author: "Unknown",
                price: 0,
                bookmarkId: item.bookmark,
              };
            }
          })
        );

        setWishlist(detailedBooks);
      } catch (error) {
        console.error("Error loading profile or wishlist:", error);
        // Set empty wishlist on error
        setWishlist([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndWishlist();
  }, [userId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <Navbar />
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
        <p className="text-xl font-medium text-white">Loading profile...</p>
      </div>
    </div>
  );
  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
      <Navbar />
      <div className="text-center glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
        <div className="text-6xl mb-4 text-red-400">
          <i className="fas fa-user-slash"></i>
        </div>
        <p className="text-xl font-medium text-white">Profile not found</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 rounded-3xl"></div>
        <motion.div 
          className="glass p-8 rounded-3xl border border-white/10 backdrop-blur-xl relative z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover border-4 border-white/20"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                <i className="fas fa-check text-white text-xs"></i>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">{user.username}</h2>
              <p className="text-gray-300 text-lg mb-2">{user.email}</p>
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
                <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                  <i className="fas fa-user-tag mr-2"></i>
                  Role: {user.role}
                </span>
                <span className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Orders: {user.orderCount || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Order History */}
          <motion.div 
            className="mt-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <i className="fas fa-history text-blue-400"></i>
              Order History
            </h3>
            {user.userOrderHistory?.length > 0 ? (
              <div className="grid gap-4">
                {user.userOrderHistory.map((order, index) => (
                  <motion.div 
                    key={order.id || index} 
                    className="glass border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-receipt text-white text-sm"></i>
                        </div>
                        <div>
                          <p className="font-semibold text-white">Order #{order.id || `Unknown-${index + 1}`}</p>
                          <p className="text-gray-400 text-sm">Date: {order.date || "Unknown"}</p>
                        </div>
                      </div>
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm border border-green-500/30">
                        {order.status || "Unknown"}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="text-6xl mb-4 text-gray-500">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <p className="text-gray-400 text-lg">No order history available</p>
                <p className="text-gray-500 text-sm mt-2">Your orders will appear here once you make a purchase</p>
              </div>
            )}
          </motion.div>

          {/* Wishlist */}
          <motion.div 
            className="mt-12"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
              <i className="fas fa-heart text-pink-400"></i>
              Wishlist
            </h3>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {wishlist.map((book, index) => (
                  <motion.div 
                    key={book.bookId} 
                    className="glass border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="w-full h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center">
                      <i className="fas fa-book text-3xl text-pink-400"></i>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2">{book.title}</h4>
                    <p className="text-gray-400 mb-2 flex items-center gap-2">
                      <i className="fas fa-user text-sm"></i>
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                        ${book.price}
                      </p>
                      <button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105">
                        <i className="fas fa-shopping-cart mr-1"></i>
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass rounded-2xl border border-white/10 backdrop-blur-xl">
                <div className="text-6xl mb-4 text-gray-500">
                  <i className="fas fa-heart-broken"></i>
                </div>
                <p className="text-gray-400 text-lg">Your wishlist is empty</p>
                <p className="text-gray-500 text-sm mt-2">Start adding books you love to see them here</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default ProfilePage;
