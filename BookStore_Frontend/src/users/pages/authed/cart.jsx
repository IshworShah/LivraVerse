import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";
import { Link } from "react-router-dom";
import useToast from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";

// Book cover placeholder
const bookCoverPlaceholder = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const cartId = localStorage.getItem("cartID");
  const userId = localStorage.getItem("userId");
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5053/api/Cart/${cartId}`);
        // Parse $values array from response
        let items = [];
        if (response.data.$values) {
          items = response.data.$values;
        } else if (Array.isArray(response.data)) {
          items = response.data;
        } else if (Array.isArray(response.data.items)) {
          items = response.data.items;
        }
        setCartItems(items);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [cartId]);

  const handleQuantityChange = (index, quantity) => {
    if (quantity < 1) return;

    const updatedItems = [...cartItems];
    updatedItems[index].quantity = quantity;
    setCartItems(updatedItems);
    
    // Note: Only updating UI state. Backend quantity sync will happen on order placement.
    // This prevents the bug where POST requests add duplicate items to cart.
  };

  const removeItem = async (cartItemId) => {
    console.log("Attempting to remove item with ID:", cartItemId);
    console.log("Cart ID:", cartId);
    console.log("Current cart items:", cartItems);
    
    try {
      // First make the API call to delete from backend
      console.log("Making DELETE request to backend...");
      const response = await axios.delete("http://localhost:5053/api/Cart", {
        data: {
          cartId: cartId,
          cartItemId: cartItemId,
        },
      });
      console.log("Backend response:", response);

      // Only update UI state after successful API call
      setCartItems((prev) => {
        const filtered = prev.filter((item) => item.id !== cartItemId);
        console.log("Items after filtering:", filtered);
        return filtered;
      });
      console.log("Item removed successfully from cart");
      
      // Show success message
      showSuccess("Item removed from cart successfully!");
      
      // Dispatch cart update event to refresh cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Error removing item:", error);
      console.error("Error details:", error.response?.data);
      // Show user-friendly error message
      showError("Failed to remove item from cart. Please try again.");
    }
  };

  const getTotal = () => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return "0.00";
    }
    return cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0).toFixed(2);
  };

  const handleOrderNow = async () => {
    if (!cartItems.length) return;
    setOrdering(true);
    try {
      const orderData = {
        OrderDate: new Date().toISOString(),
        TotalCost: cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
        UserId: userId,
        OrderItems: cartItems.map(item => ({
          BookId: item.book.id,
          Quantity: item.quantity
        })),
        DiscountPercentage: 0
      };
      console.log("Order payload being sent:", orderData);
      await axios.post("http://localhost:5053/api/Order", orderData, {
        headers: { "Content-Type": "application/json" }
      });
      showSuccess("Order placed successfully! Thank you for your purchase!");
    } catch (error) {
      console.error("Order API Error:", error);
      if (error.response) {
        console.error("Backend error response data:", error.response.data);
        showError("Failed to place order: " + JSON.stringify(error.response.data));
      } else {
        showError("Failed to place order. Please try again.");
      }
    } finally {
      setOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-6 py-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <h2 className="text-xl font-medium text-gray-700">Loading your cart...</h2>
            <p className="text-gray-500 mt-2">Please wait while we fetch your items</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20 relative z-10">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-300 hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-white font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 text-white text-center gradient-text animate-fade-in-up">Your Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center min-h-[40vh] flex flex-col items-center justify-center border border-white/20 animate-fade-in-up">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full flex items-center justify-center mb-8 border border-white/10">
              <i className="fas fa-shopping-cart text-6xl text-white/60"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-6 gradient-text">Your cart is empty</h2>
            <p className="text-purple-200/80 mb-10 max-w-md mx-auto text-lg">Looks like you haven't added any books to your cart yet. Browse our collection and find your next favorite read!</p>
            <Link to="/books">
              <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3">
                <i className="fas fa-book"></i>
                <span>Browse Books</span>
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up animation-delay-200">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl overflow-hidden border border-white/20">
                <div className="border-b border-white/20 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white gradient-text">Cart Items ({cartItems.length})</h2>
                </div>
                <div className="divide-y divide-white/10">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6 hover:bg-white/5 transition-all duration-300">
                      {/* Book Image */}
                      <div className="sm:w-24 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                        <img 
                          src={item.book?.coverImageUrl ? `http://localhost:5053/images/${item.book.coverImageUrl}` : bookCoverPlaceholder} 
                          alt={item.book?.title || "Book Cover"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Book Details */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white hover:text-transparent hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 hover:bg-clip-text transition-all duration-300 mb-2">
                          {item.book?.title}
                        </h3>
                        <p className="text-purple-200/80 mb-3">{item.book?.authorName}</p>
                        <div className="text-xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                          ${item.unitPrice}
                        </div>
                      </div>
                      {/* Quantity and Actions */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-4 sm:gap-2">
                        <div className="flex items-center border border-white/20 rounded-lg bg-white/5 backdrop-blur-sm">
                          <button 
                            onClick={() => handleQuantityChange(cartItems.indexOf(item), item.quantity - 1)}
                            className="px-3 py-2 text-white hover:bg-white/10 transition-colors rounded-l-lg"
                            disabled={item.quantity <= 1}
                          >
                            <i className="fas fa-minus text-sm"></i>
                          </button>
                          <span className="px-4 py-2 text-white font-medium border-x border-white/20">Qty: {item.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange(cartItems.indexOf(item), item.quantity + 1)}
                            className="px-3 py-2 text-white hover:bg-white/10 transition-colors rounded-r-lg"
                          >
                            <i className="fas fa-plus text-sm"></i>
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 font-semibold transition-colors duration-300 flex items-center space-x-1 px-3 py-1 rounded-lg hover:bg-red-500/10"
                        >
                          <i className="fas fa-trash text-sm"></i>
                          <span>Remove</span>
                        </button>
                      </div>
                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          ${(item.unitPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl border border-white/20 sticky top-24">
                <div className="border-b border-white/20 px-6 py-4">
                  <h2 className="text-2xl font-bold text-white gradient-text">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-purple-200/80">Subtotal</span>
                      <span className="font-bold text-white">${getTotal()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200/80">Shipping</span>
                      <span className="font-bold text-green-400">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-200/80">Tax</span>
                      <span className="font-medium text-white">Calculated at checkout</span>
                    </div>
                    <div className="border-t border-white/20 pt-4 mt-4">
                      <div className="flex justify-between">
                        <span className="font-bold text-white text-lg">Total</span>
                        <span className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-2xl">${getTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-4 mb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                    <i className="fas fa-credit-card"></i>
                    <span>Proceed to Checkout</span>
                  </button>
                  <button 
                    className="w-full py-4 border border-white/20 text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 backdrop-blur-sm"
                    onClick={handleOrderNow}
                    disabled={ordering}
                  >
                    {ordering ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Ordering...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-bag"></i>
                        <span>Order Now</span>
                      </>
                    )}
                  </button>
                  <div className="mt-6 text-center">
                    <Link to="/books" className="text-purple-300 hover:text-white transition-colors duration-300 inline-flex items-center gap-2 font-medium">
                      <i className="fas fa-arrow-left"></i>
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* You might also like section */}
      {Array.isArray(cartItems) && cartItems.length > 0 && (
        <div className="container mx-auto px-6 py-12 relative z-10">
          <h2 className="text-4xl font-bold mb-8 text-white text-center gradient-text">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass rounded-2xl border border-white/20 group hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={bookCoverPlaceholder} 
                    alt="Related Book"
                    className="h-56 w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300 mb-2">Recommended Book Title</h3>
                  <p className="text-purple-200/80 mb-3">Author Name</p>
                  <p className="font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-lg">$19.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default CartPage;
