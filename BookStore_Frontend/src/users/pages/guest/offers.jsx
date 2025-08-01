import React, { useEffect, useState } from "react";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";
import axios from "axios";
import { Link } from "react-router-dom";

const OffersPage = () => {
  const [deals, setDeals] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await axios.get("http://localhost:5053/api/Book/books");
        
        // Extract books from the API response - handle various structures
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
        
        setDeals(apiBooks || []);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
        setDeals([]);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get("http://localhost:5053/api/Announcement");
        const currentDate = new Date();
        
        // Extract announcements from the API response - handle $values structure
        let apiAnnouncements = [];
        if (response.data.$values) {
          apiAnnouncements = response.data.$values;
        } else if (Array.isArray(response.data)) {
          apiAnnouncements = response.data;
        }
        
        // Filter announcements that are currently active
        if (Array.isArray(apiAnnouncements)) {
          const activeAnnouncements = apiAnnouncements.filter(announcement => {
            const startDate = new Date(announcement.startDate);
            const endDate = new Date(announcement.endDate);
            return currentDate >= startDate && currentDate <= endDate;
          });
          setAnnouncements(activeAnnouncements);
        } else {
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setAnnouncements([]);
      }
    };

    fetchDeals();
    fetchAnnouncements();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <Navbar />
      <div className="relative z-10 text-white min-h-screen px-8 py-10">
        <h1 className="text-5xl font-bold mb-6 text-center gradient-text animate-fade-in-up">Exclusive Offers</h1>

        <div className="flex justify-center mb-10">
          <div className="relative w-full max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <i className="fas fa-search text-white/60 text-xl"></i>
            </div>
            <input
              type="text"
              placeholder="Search for books, authors, or categories..."
              className="w-full pl-16 pr-6 py-5 text-lg border-2 border-white/20 rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/30 focus:border-purple-400/50 transition-all duration-300 shadow-lg bg-white/10 backdrop-blur-md text-white placeholder-purple-200/70 hover:bg-white/20 animate-fade-in-up animation-delay-200"
            />
          </div>
        </div>

        {/* Announcements Section */}
        {announcements.length > 0 && (
          <section className="mb-12 animate-fade-in-up animation-delay-300">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Latest Announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="glass rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{announcement.title}</h3>
                      <p className="text-purple-200/90 mb-3 leading-relaxed">{announcement.messsage}</p>
                      <div className="flex items-center space-x-4 text-sm text-purple-300/80">
                        <div className="flex items-center">
                          <i className="fas fa-calendar-alt mr-2"></i>
                          <span>Valid until {new Date(announcement.endDate).toLocaleDateString()}</span>
                        </div>
                        {announcement.bookDtos && announcement.bookDtos.length > 0 && (
                          <div className="flex items-center">
                            <i className="fas fa-book mr-2"></i>
                            <span>{announcement.bookDtos.length} featured books</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                        <i className="fas fa-bullhorn mr-2"></i>
                        NEW
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Deals Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-400">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Featured Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.length > 0 ? (
              deals.map((book) => (
                <Link to={`/book/${book.book_Id}`} key={book.book_Id}>
                  <div className="group glass rounded-2xl p-6 hover-lift transition-all duration-300 border border-white/20 hover:border-purple-400/50 animate-fade-in-up">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <div className="h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                        <i className="fas fa-book text-4xl text-white/40"></i>
                      </div>
                      <div className="absolute top-2 right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {book.discountPercent}% OFF
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-purple-200/80">{book.author}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">${book.price}</p>
                        <span className="text-xs text-red-400 font-semibold">DEAL</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-purple-200/80 col-span-full text-center py-8">No deals available at the moment.</p>
            )}
          </div>
        </section>

        {/* Buy More, Save More Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-600">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Buy More, Save More</h2>
          <div className="glass rounded-2xl p-8 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
            <div className="flex items-center mb-4">
              <i className="fas fa-tags text-3xl text-purple-400 mr-4"></i>
              <p className="text-2xl font-bold text-white">Special Bulk Discounts</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass rounded-xl p-4 border border-white/10 hover:border-green-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text mb-2">10%</div>
                  <p className="text-white font-semibold">Buy 3 Books</p>
                  <p className="text-purple-200/80 text-sm">Get 10% off</p>
                </div>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text mb-2">15%</div>
                  <p className="text-white font-semibold">Buy 5 Books</p>
                  <p className="text-purple-200/80 text-sm">Get 15% off</p>
                </div>
              </div>
              <div className="glass rounded-xl p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-2">25%</div>
                  <p className="text-white font-semibold">Buy 10 Books</p>
                  <p className="text-purple-200/80 text-sm">Get 25% off</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Student Specials Section */}
        <section className="mb-12 animate-fade-in-up animation-delay-800">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Student Specials</h2>
          <div className="glass rounded-2xl p-8 border border-white/20 hover:border-yellow-400/50 transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1 mb-6 md:mb-0">
                <div className="flex items-center mb-4">
                  <i className="fas fa-graduation-cap text-3xl text-yellow-400 mr-4"></i>
                  <p className="text-2xl font-bold text-white">Exclusive Student Discounts</p>
                </div>
                <p className="text-purple-200/80 mb-4 text-lg">
                  Students get an extra 15% off on academic and reference books.
                  <br />
                  Use code: <span className="font-semibold text-yellow-400">STUDENT15</span>
                </p>
                <div className="flex items-center space-x-2 text-yellow-400">
                  <i className="fas fa-star"></i>
                  <span className="text-sm font-semibold">Valid for all academic books</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105">
                  <i className="fas fa-arrow-right mr-2"></i>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default OffersPage;
