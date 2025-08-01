import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";
import useToast from "../../../hooks/useToast";
import ToastContainer from "../../../components/ToastContainer";

// Book cover placeholder
const bookCoverPlaceholder = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80";

const BookDetail = () => {
  const { id } = useParams(); // bookId
  const [book, setBook] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:5053/api/Book/book/${id}`);
        setBook(response.data);
        
        // Check if book is in user's wishlist
        const userId = localStorage.getItem("userId");
        if (userId) {
          try {
            const wishlistResponse = await axios.get(`http://localhost:5053/api/Wishlist/wishlist?UserId=${userId}`);
            const wishlistItems = wishlistResponse.data;
            // Ensure wishlistItems is an array before using .some()
            if (Array.isArray(wishlistItems)) {
              const isInWishlist = wishlistItems.some(item => item.book && item.book.id === response.data.book_Id);
              setIsBookmarked(isInWishlist);
            } else {
              console.warn("Wishlist response is not an array:", wishlistItems);
              setIsBookmarked(false);
            }
          } catch (wishlistError) {
            console.error("Error checking wishlist:", wishlistError);
            setIsBookmarked(false);
          }
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const addToCart = async () => {
    try {
      const cartId = localStorage.getItem("cartID");
      
      if (!cartId) {
        showError("Please log in to add books to your cart.");
        return;
      }

      const payload = {
        bookId: book.book_Id,
        cartId: cartId
      };

      await axios.post("http://localhost:5053/api/Cart", payload);
      showSuccess("Book added to cart successfully!");
      
      // Dispatch cart update event to refresh cart count in header
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Failed to add book to cart. Please try again.");
    }
  };

  const handleBookmark = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        showError("Please log in to add books to your wishlist.");
        return;
      }

      if (isBookmarked) {
        // Remove from wishlist - need to find the wishlist item ID first
        try {
          const wishlistResponse = await axios.get(`http://localhost:5053/api/Wishlist/wishlist?UserId=${userId}`);
          const wishlistItems = wishlistResponse.data;
          
          if (Array.isArray(wishlistItems)) {
            const wishlistItem = wishlistItems.find(item => item.book && item.book.id === book.book_Id);
            
            if (wishlistItem) {
              await axios.delete(`http://localhost:5053/api/Wishlist/wishlist/${wishlistItem.bookmark_Id}`);
              setIsBookmarked(false);
              showSuccess("Book removed from wishlist!");
            } else {
              showError("Book not found in wishlist.");
            }
          } else {
            console.warn("Wishlist response is not an array:", wishlistItems);
            showError("Failed to remove from wishlist.");
          }
        } catch (error) {
          console.error("Error removing from wishlist:", error);
          if (error.response && error.response.data) {
            showError(error.response.data);
          } else {
            showError("Failed to remove from wishlist.");
          }
        }
      } else {
        // Add to wishlist
        const payload = {
          bookId: book.book_Id,
          userId: userId
        };
        const response = await axios.post("http://localhost:5053/api/Wishlist/wishlist", payload);
        setIsBookmarked(true);
        showSuccess("Book added to wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      if (error.response && error.response.data) {
        showError(error.response.data);
      } else {
        showError("Failed to update wishlist. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500 mb-6"></div>
            <p className="text-xl font-medium text-white">Loading book details...</p>
            <p className="text-gray-400 mt-2">Please wait while we fetch the information</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
          <div className="text-center max-w-md glass rounded-2xl p-8 border border-white/10 backdrop-blur-xl">
            <div className="text-6xl mb-6 text-red-400">
              <i className="fas fa-book-dead"></i>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Book Not Found</h1>
            <p className="text-gray-300 mb-8">We couldn't find the book you're looking for. It might have been removed or the URL might be incorrect.</p>
            <Link to="/books" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-6 rounded-xl inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg border border-white/20">
              <i className="fas fa-arrow-left"></i> Back to Books
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Navbar />
      
      {/* Breadcrumb */}
      <div className="glass border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex text-sm">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">
              Home
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <Link to="/books" className="text-gray-300 hover:text-white transition-colors duration-300">
              Books
            </Link>
            <span className="mx-2 text-gray-500">/</span>
            <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-medium truncate">{book.title}</span>
          </nav>
        </div>
      </div>
      
      {/* Book Details */}
      <div className="container mx-auto px-6 py-12">
        <div className="glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row">
            {/* Book Cover */}
            <div className="lg:w-2/5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <img 
                  src={book.coverImageUrl || bookCoverPlaceholder} 
                  alt={book.title}
                  className="w-full max-w-sm rounded-2xl shadow-2xl border border-white/20 hover:scale-105 transition-transform duration-500"
                />
                {book.discountPercent > 0 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full transform rotate-3 shadow-lg border border-white/20 backdrop-blur-sm">
                    {book.discountPercent}% OFF
                  </div>
                )}
              </motion.div>
            </div>
            
            {/* Book Info */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-gradient-to-br from-gray-800/30 to-gray-900/30">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {book.genre && (
                    <span className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs font-medium px-3 py-1 rounded-full border border-indigo-400/30 backdrop-blur-sm">
                      {book.genre}
                    </span>
                  )}
                  {book.stockQuantity > 0 ? (
                    <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 text-xs font-medium px-3 py-1 rounded-full border border-green-400/30 backdrop-blur-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 text-xs font-medium px-3 py-1 rounded-full border border-red-400/30 backdrop-blur-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{book.title}</h1>
                
                <div className="flex items-center mb-4">
                  <p className="text-lg text-gray-300">by <span className="font-medium text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text hover:from-purple-300 hover:to-pink-300 cursor-pointer transition-all duration-300">{book.author}</span></p>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                    <span className="text-gray-300 ml-2">(4.5)</span>
                  </div>
                  <span className="mx-2 text-gray-500">|</span>
                  <span className="text-gray-300">{book.reviews ? book.reviews.length : 0} Reviews</span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">${book.price}</span>
                    {book.discountPercent > 0 && book.originalPrice && (
                      <span className="text-lg text-gray-400 line-through ml-2">${book.originalPrice}</span>
                    )}
                  </div>
                  {book.discountPercent > 0 && (
                    <p className="text-sm text-green-400 font-medium">You save: ${(book.originalPrice - book.price).toFixed(2)} ({book.discountPercent}%)</p>
                  )}
                </div>
                
                <div className="prose prose-lg max-w-none mb-8 text-gray-300 leading-relaxed">
                  <p>{book.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <i className="fas fa-book text-purple-400 mr-3"></i>
                    <span className="text-sm text-gray-300">Format: <span className="font-medium text-white">{book.format || 'Paperback'}</span></span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <i className="fas fa-calendar-alt text-blue-400 mr-3"></i>
                    <span className="text-sm text-gray-300">Published: <span className="font-medium text-white">{new Date(book.publicationDate).toLocaleDateString()}</span></span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <i className="fas fa-barcode text-green-400 mr-3"></i>
                    <span className="text-sm text-gray-300">ISBN: <span className="font-medium text-white">{book.isbn}</span></span>
                  </div>
                  <div className="flex items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <i className="fas fa-layer-group text-orange-400 mr-3"></i>
                    <span className="text-sm text-gray-300">Stock: <span className="font-medium text-white">{book.stockQuantity} available</span></span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={addToCart}
                    disabled={book.stockQuantity <= 0}
                    className="flex-1 py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border border-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <i className="fas fa-shopping-cart text-lg"></i>
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBookmark}
                    className={`flex-1 py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg border backdrop-blur-sm font-semibold ${
                      isBookmarked 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-white/20 hover:shadow-2xl' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border-white/20 hover:shadow-xl'
                    }`}
                  >
                    <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark text-lg`}></i>
                    <span>{isBookmarked ? 'Bookmarked' : 'Add to Bookmark'}</span>
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 hover:text-blue-300 transition-all duration-300 flex items-center justify-center border border-blue-500/30 hover:scale-110">
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 hover:text-sky-300 transition-all duration-300 flex items-center justify-center border border-sky-500/30 hover:scale-110">
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all duration-300 flex items-center justify-center border border-red-500/30 hover:scale-110">
                    <i className="fab fa-pinterest-p"></i>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-pink-600/20 text-pink-400 hover:bg-pink-600/30 hover:text-pink-300 transition-all duration-300 flex items-center justify-center border border-pink-500/30 hover:scale-110">
                    <i className="fab fa-instagram"></i>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12 glass rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="border-b border-white/10">
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold text-white">Customer Reviews</h2>
            </div>
          </div>
          
          <div className="p-6">
            {book.reviews && book.reviews.length > 0 ? (
              <div className="space-y-6">
                {book.reviews.map((review, index) => (
                  <div key={index} className="border-b border-white/10 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center text-indigo-400 mr-3 border border-indigo-400/30">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <p className="font-bold text-white">{review.user}</p>
                        <p className="text-xs text-gray-400">{new Date(review.date || Date.now()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg 
                          key={star} 
                          className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl text-gray-500 mb-4">
                  <i className="far fa-comment-dots"></i>
                </div>
                <h3 className="text-lg font-medium text-white mb-1">No Reviews Yet</h3>
                <p className="text-gray-400">Be the first to review this book</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Related Books Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-white">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass rounded-2xl border border-white/10 group hover:shadow-2xl transition-all duration-300 overflow-hidden backdrop-blur-xl hover:scale-105">
                <div className="relative overflow-hidden">
                  <img 
                    src={bookCoverPlaceholder} 
                    alt="Related Book"
                    className="h-56 w-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">Similar Book Title</h3>
                  <p className="text-sm text-gray-400 mb-2">Author Name</p>
                  <p className="font-bold text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text">$19.99</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default BookDetail;
