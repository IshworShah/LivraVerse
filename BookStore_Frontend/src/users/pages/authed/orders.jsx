import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingOrderId, setDeletingOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("No userId found");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5053/api/Order/personal/${userId}`
        );

        console.log("Orders response:", response.data);
        
        if (response.data && response.data.$values) {
          setOrders(response.data.$values);
        } else if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    try {
      setDeletingOrderId(orderId);
      const response = await axios.delete(
        `http://localhost:5053/api/Order/${orderId}`
      );
      console.log("Order deleted successfully:", response.data);
      // Remove the deleted order from the orders list
      setOrders(orders.filter(order => (order.order_Id || order.orderId) !== orderId));
      alert("Order cancelled successfully!");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to cancel order");
    } finally {
      setDeletingOrderId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const getOrderStatus = (status) => {
    switch (status) {
      case 0:
        return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
      case 1:
        return { text: "Confirmed", color: "bg-blue-100 text-blue-800" };
      case 2:
        return { text: "Shipped", color: "bg-purple-100 text-purple-800" };
      case 3:
        return { text: "Delivered", color: "bg-green-100 text-green-800" };
      case 4:
        return { text: "Cancelled", color: "bg-red-100 text-red-800" };
      default:
        return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
          <p className="text-xl font-medium text-white">Loading orders...</p>
          <p className="text-gray-400 mt-2">Please wait while we fetch your order history</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20 rounded-3xl"></div>
        <motion.div 
          className="glass p-8 rounded-3xl border border-white/10 backdrop-blur-xl relative z-10"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <i className="fas fa-shopping-bag text-white text-xl"></i>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">My Orders</h2>
          </div>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, index) => {
                const status = getOrderStatus(order.orderStatus);
                return (
                  <motion.div 
                    key={order.order_Id || order.orderId} 
                    className="glass border border-white/10 rounded-2xl p-6 backdrop-blur-xl hover:bg-white/5 transition-all duration-300 group"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <i className="fas fa-receipt text-white"></i>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            Order #{order.order_Id || order.orderId || "Unknown"}
                          </h3>
                          <p className="text-gray-400 flex items-center gap-2 mt-1">
                            <i className="fas fa-calendar text-sm"></i>
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                        status.text === 'Delivered' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        status.text === 'Pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                        status.text === 'Cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                        'bg-blue-500/20 text-blue-400 border-blue-500/30'
                      }`}>
                        <i className={`fas ${
                          status.text === 'Delivered' ? 'fa-check-circle' :
                          status.text === 'Pending' ? 'fa-clock' :
                          status.text === 'Cancelled' ? 'fa-times-circle' :
                          'fa-shipping-fast'
                        } mr-2`}></i>
                        {status.text}
                      </span>
                    </div>
                    
                    {/* Order Items */}
                    {order.orderItems && order.orderItems.length > 0 && (
                      <div className="border-t border-white/10 pt-6">
                        <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                          <i className="fas fa-list text-purple-400"></i>
                          Order Items:
                        </h4>
                        <div className="space-y-3">
                          {order.orderItems.map((item, itemIndex) => (
                            <motion.div 
                              key={itemIndex} 
                              className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.4, delay: itemIndex * 0.1 }}
                            >
                              <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <i className="fas fa-book text-white text-sm"></i>
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-white">
                                    {item.book?.title || item.title || "Unknown Book"}
                                  </p>
                                  <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                    <i className="fas fa-hashtag text-xs"></i>
                                    Quantity: {item.quantity || 1}
                                  </p>
                                </div>
                              </div>
                              <p className="font-bold text-green-400 text-lg">
                                ${(item.price || 0).toFixed(2)}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Order Total */}
                    {order.totalAmount && (
                      <div className="border-t border-white/10 pt-6 mt-6">
                        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
                          <span className="text-lg font-bold text-white flex items-center gap-2">
                            <i className="fas fa-calculator text-green-400"></i>
                            Total Amount:
                          </span>
                          <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                            ${(order.totalAmount || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {/* Cancel Order Button - Only show if status is pending (0) */}
                    {(order.orderStatus === 0 || order.orderStatus === 1) && (
                      <div className="border-t border-white/10 pt-6 mt-6">
                        <motion.button
                          className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => deleteOrder(order.order_Id || order.orderId)}
                          disabled={deletingOrderId === (order.order_Id || order.orderId)}
                        >
                          {deletingOrderId === (order.order_Id || order.orderId) ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Cancelling Order...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-times mr-2"></i>
                              Cancel Order
                            </>
                          )}
                        </motion.button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-shopping-cart text-white text-3xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Orders Found
              </h3>
              <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/books'}
              >
                <i className="fas fa-shopping-bag mr-2"></i>
                Start Shopping
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default OrdersPage;
