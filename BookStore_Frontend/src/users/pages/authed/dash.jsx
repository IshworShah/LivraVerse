import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";

const UserDash = () => {
  // Simulate a logged-in user (you can replace this with actual authentication logic)
  const [user] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  });

  // Example of user data (fetch or context would normally handle this)
  useEffect(() => {
    // Logic to fetch user data from an API or context
    // setUser(fetchedUser);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white min-h-screen">
        <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
          <motion.div 
            className="max-w-5xl relative z-10 glass rounded-3xl p-12 border border-white/10 backdrop-blur-xl"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {user.name.charAt(0)}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Find more books to enjoy, discover personalized recommendations, and start shopping.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <motion.button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-user mr-2"></i>
                My Account
              </motion.button>
              <Link to="/profile">
                <motion.button 
                  className="glass border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 backdrop-blur-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className="fas fa-eye mr-2"></i>
                  View Profile
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </section>

        <section className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10"></div>
          <div className="max-w-6xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Personalized Recommendations
            </motion.h2>
            <p className="text-gray-400 mb-12 max-w-2xl mx-auto">Discover books tailored just for you based on your reading preferences</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {/* Example list of recommended books */}
              {["Book 1", "Book 2", "Book 3", "Book 4", "Book 5"].map((book, index) => (
                <motion.div
                  key={index}
                  className="glass border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <i className="fas fa-book text-4xl text-purple-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{book}</h3>
                  <p className="text-sm text-gray-400 mb-4">A brief description of {book}.</p>
                  <Link to={`/book/${index}`} className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors group-hover:translate-x-1 transform duration-300">
                    View Details <i className="fas fa-arrow-right text-sm"></i>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/10 to-blue-900/10"></div>
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <motion.h2 
              className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Your Recent Orders
            </motion.h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              Check out your recent orders and track their status.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {["Order 1", "Order 2", "Order 3"].map((order, index) => (
                <motion.div
                  key={index}
                  className="glass border border-white/10 p-6 rounded-2xl backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-full h-32 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-xl mb-4 flex items-center justify-center">
                    <i className="fas fa-shopping-bag text-3xl text-pink-400"></i>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{order}</h3>
                  <p className="text-sm text-gray-400 mb-4">Details of {order}.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">
                      Delivered
                    </span>
                    <Link to={`/orders/${index}`} className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium transition-colors group-hover:translate-x-1 transform duration-300">
                      View Order <i className="fas fa-arrow-right text-sm"></i>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </motion.div>
  );
};

export default UserDash;
