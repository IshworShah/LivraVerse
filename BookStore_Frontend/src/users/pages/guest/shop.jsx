import React, { useState, useEffect } from 'react';
import Navbar from '../../headers/header';
import Footer from '../../footers/footer';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useToast from '../../../hooks/useToast';
import ToastContainer from '../../../components/ToastContainer';

const Shop = () => {
  const [sort, setSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000]); // Increased max price to handle your book prices
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [addingToCart, setAddingToCart] = useState({}); // Track which book is being added
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Book cover placeholder for books without images
  const bookCoverPlaceholder = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=830&q=80";

  const categories = [
    { name: "Fiction", count: 2450 },
    { name: "Non-Fiction", count: 1890 },
    { name: "Science Fiction", count: 680 },
    { name: "Self-Help", count: 420 },
    { name: "Business", count: 320 },
    { name: "Children's Books", count: 950 },
    { name: "Academic", count: 780 },
    { name: "Biography", count: 560 }
  ];

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        console.log("Fetching books from API...");
        const response = await axios.get("http://localhost:5053/api/Book/books");
        
        console.log("API Response:", response.data);
        
        // Extract books from the API response - try multiple possible structures
        let apiBooks = [];
        if (response.data.items?.$values) {
          apiBooks = response.data.items.$values;
        } else if (response.data.items) {
          apiBooks = response.data.items;
        } else if (Array.isArray(response.data)) {
          apiBooks = response.data;
        } else if (response.data.$values) {
          apiBooks = response.data.$values;
        }
        
        console.log("Extracted books:", apiBooks);
        console.log("Books array length:", apiBooks.length);
        
        // Transform API data to match our frontend format
        const transformedBooks = apiBooks.map(book => ({
          id: book.book_Id,
          title: book.title,
          author: book.author,
          price: book.price,
          originalPrice: book.price, // No original price in API, using same as price
          image: book.coverImage ? `http://localhost:5053/images/${book.coverImage}` : bookCoverPlaceholder,
          rating: 4.5, // Default rating since API doesn't provide it
          discount: book.discountPercent || 0,
          category: "Fiction", // Default category since API doesn't provide it
          inStock: book.stockQuantity > 0,
          stockQuantity: book.stockQuantity,
          description: book.description,
          isbn: book.isbn,
          publicationDate: book.publicationDate,
          isOnSale: book.isOnSale
        }));
        
        console.log("Transformed books:", transformedBooks);
        setBooks(transformedBooks);
        setTotalPages(response.data.totalPage || 1);
        
      } catch (error) {
        console.error("Error fetching books:", error);
        console.error("Error details:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          code: error.code
        });
        
        // If API is not available, show a message
        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          console.log("Backend API not available - showing empty state");
        }
        
        // Fallback to empty array if API fails
        setBooks([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page]); // Only refetch when page changes

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (categoryName) => {
    setCategory(prev => 
      prev.includes(categoryName) 
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
    setPage(1);
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e.target.value)]);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const addToCart = async (bookId) => {
    try {
      setAddingToCart(prev => ({ ...prev, [bookId]: true }));
      
      const cartId = localStorage.getItem("cartID");
      
      if (!cartId) {
        showError("Please log in to add books to your cart.");
        setAddingToCart(prev => ({ ...prev, [bookId]: false }));
        return;
      }
      
      // Check if backend is available first
      try {
        const response = await axios.post("http://localhost:5053/api/Cart", {
          bookId: bookId,
          cartId: cartId
        });
        
        // Show success message
        showSuccess("Book added to cart successfully!");
        
        // Dispatch cart update event to refresh cart count in header
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        
      } catch (apiError) {
        console.error("API Error:", apiError);
        
        // Handle different error scenarios
        if (apiError.code === 'ERR_NETWORK' || apiError.message.includes('Network Error')) {
          // Backend is not running - simulate success for demo
          showSuccess("Book added to cart successfully! (Demo mode - backend not available)");
          
          // Store in localStorage for demo purposes
          const demoCart = JSON.parse(localStorage.getItem('demoCart') || '[]');
          const existingItem = demoCart.find(item => item.bookId === bookId);
          
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            const book = books.find(b => b.id === bookId);
            if (book) {
              demoCart.push({
                bookId: bookId,
                title: book.title,
                author: book.author,
                price: book.price,
                quantity: 1,
                image: book.image
              });
            }
          }
          
          localStorage.setItem('demoCart', JSON.stringify(demoCart));
          
        } else if (apiError.response?.status === 400) {
          showError("Invalid book ID or cart ID. Please try again.");
        } else if (apiError.response?.status === 404) {
          showError("Book not found. Please try again.");
        } else if (apiError.response?.status === 500) {
          showError("Server error. Please try again later or check if backend is running.");
        } else {
          showError("Failed to add book to cart. Please try again.");
        }
      }
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      showError("Failed to add book to cart. Please try again.");
    } finally {
      setAddingToCart(prev => ({ ...prev, [bookId]: false }));
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category.length === 0 || category.includes(book.category);
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1];
    
    const isIncluded = matchesSearch && matchesCategory && matchesPrice;
    
    // Debug logging for first few books
    if (books.indexOf(book) < 3) {
      console.log(`Book "${book.title}":`, {
        matchesSearch,
        matchesCategory,
        matchesPrice,
        isIncluded,
        searchQuery,
        category,
        priceRange: [priceRange[0], priceRange[1]],
        bookPrice: book.price
      });
    }
    
    return isIncluded;
  });
  
  console.log("Total books:", books.length);
  console.log("Filtered books:", filteredBooks.length);
  console.log("Search query:", searchQuery);
  console.log("Category filter:", category);
  console.log("Price range:", priceRange);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="text-white py-16 lg:py-20 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-fade-in">
                Discover Your Next <span className="bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">Favorite</span> Book
              </h1>
              <p className="text-xl mb-12 opacity-90 leading-relaxed text-gray-200 animate-fade-in-delay">
                Browse our extensive collection of books across all genres. From timeless classics to contemporary bestsellers.
              </p>
              
              {/* Enhanced Search Bar */}
              <div className="max-w-2xl mx-auto animate-fade-in-delay-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <i className="fas fa-search text-purple-300 text-lg group-focus-within:text-yellow-400 transition-colors duration-300"></i>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search for books, authors, or categories..."
                    className="w-full pl-16 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-300 shadow-lg bg-white/10 backdrop-blur-md text-white placeholder-purple-200/70 hover:bg-white/15 hover:border-white/30"
                  />
                  <button className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                    <span>Search</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar */}
              <aside className="lg:w-80">
                <div className="sticky top-24 space-y-6">
                  {/* Categories Filter */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <i className="fas fa-tags mr-3 text-purple-400"></i>
                        Categories
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <label key={cat.name} className="flex items-center justify-between cursor-pointer group hover:bg-white/5 p-3 rounded-lg transition-all duration-200">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={category.includes(cat.name)}
                                onChange={() => handleCategoryChange(cat.name)}
                                className="w-4 h-4 text-purple-500 bg-white/10 border-white/30 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                              />
                              <span className="ml-3 text-gray-200 group-hover:text-white transition-colors duration-200">
                                {cat.name}
                              </span>
                            </div>
                            <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded-full border border-purple-400/30">
                              {cat.count}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <i className="fas fa-dollar-sign mr-3 text-green-400"></i>
                        Price Range
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="0"
                          max="2000"
                          value={priceRange[1]}
                          onChange={handlePriceChange}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider-thumb"
                          style={{
                            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(priceRange[1] / 2000) * 100}%, rgba(255,255,255,0.2) ${(priceRange[1] / 2000) * 100}%, rgba(255,255,255,0.2) 100%)`
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-300">
                          <span className="bg-purple-500/20 px-2 py-1 rounded border border-purple-400/30">$0</span>
                          <span className="bg-purple-500/20 px-2 py-1 rounded border border-purple-400/30">${priceRange[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300">
                    <div className="p-6 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white flex items-center">
                        <i className="fas fa-sort mr-3 text-blue-400"></i>
                        Sort By
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        {[
                          { value: 'popular', label: 'Most Popular' },
                          { value: 'newest', label: 'Newest First' },
                          { value: 'price-low', label: 'Price: Low to High' },
                          { value: 'price-high', label: 'Price: High to Low' },
                          { value: 'rating', label: 'Highest Rated' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center cursor-pointer group hover:bg-white/5 p-3 rounded-lg transition-all duration-200">
                            <input
                              type="radio"
                              name="sort"
                              value={option.value}
                              checked={sort === option.value}
                              onChange={(e) => setSort(e.target.value)}
                              className="w-4 h-4 text-purple-500 bg-white/10 border-white/30 focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                            />
                            <span className="ml-3 text-gray-200 group-hover:text-white transition-colors duration-200">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Books Grid */}
              <div className="flex-1">
                {/* Header with results and view toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-2xl font-bold text-white">
                      {loading ? 'Loading...' : `${filteredBooks.length} Books Found`}
                    </h2>
                    <p className="text-gray-300 mt-1">
                      Showing results for your search
                    </p>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-lg border border-white/20">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <i className="fas fa-th-large"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all duration-200 ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl animate-pulse">
                        <div className="h-64 bg-white/20 rounded-t-2xl"></div>
                        <div className="p-6">
                          <div className="h-4 bg-white/20 rounded mb-2"></div>
                          <div className="h-3 bg-white/20 rounded mb-4"></div>
                          <div className="h-6 bg-white/20 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Books Grid */}
                {!loading && (
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}>
                    {filteredBooks.map((book) => (
                      <Link to={`/book/${book.id}`} key={book.id} className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 hover:shadow-2xl hover:scale-105 transition-all duration-300 group ${viewMode === 'list' ? 'flex' : ''} block`}>
                        <div className={`relative overflow-hidden rounded-t-2xl ${viewMode === 'list' ? 'w-32 h-48 flex-shrink-0 rounded-l-2xl rounded-t-none' : ''}`}>
                          <img 
                            src={book.image} 
                            alt={book.title}
                            className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                              viewMode === 'list' ? 'h-full rounded-l-2xl' : 'h-64 rounded-t-2xl'
                            }`}
                          />
                          {book.discount > 0 && (
                            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                              -{book.discount}%
                            </div>
                          )}
                          {!book.inStock && (
                            <div className="absolute top-4 right-4 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold">
                              Out of Stock
                            </div>
                          )}
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-sm font-medium text-white border border-white/30">
                            <i className="fas fa-star text-yellow-400 mr-1"></i>
                            {book.rating}
                          </div>
                        </div>
                        
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <div className="mb-2">
                            <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-medium rounded-full border border-purple-400/30">
                              {book.category}
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors duration-200 line-clamp-2 text-white">
                            {book.title}
                          </h3>
                          <p className="text-gray-300 mb-4">{book.author}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {book.discount > 0 ? (
                                <>
                                  <span className="text-lg font-bold text-green-400">${book.price}</span>
                                  <span className="text-gray-400 line-through">${book.originalPrice}</span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-green-400">${book.price}</span>
                              )}
                            </div>
                            
                            <button 
                              onClick={() => addToCart(book.id)}
                              disabled={!book.inStock || addingToCart[book.id]}
                              className={`bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium ${!book.inStock ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}`}
                            >
                              {addingToCart[book.id] ? (
                                <>
                                  <i className="fas fa-spinner fa-spin mr-2"></i>
                                  Adding...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-shopping-cart mr-2"></i>
                                  {book.inStock ? 'Add to Cart' : 'Out of Stock'}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* No Results */}
                {!loading && filteredBooks.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                      <i className="fas fa-search text-purple-400 text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No books found</h3>
                    <p className="text-gray-300 mb-6">Try adjusting your search criteria or filters</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setCategory([]);
                        setPriceRange([0, 100]);
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {!loading && filteredBooks.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <nav className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-xl">
                      <button 
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            page === index + 1 
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      
                      <button 
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                      >
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Shop;
