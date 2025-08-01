import React, { useEffect, useState } from "react";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";
import axios from "axios";
import { Link } from "react-router-dom";

const ExplorePage = () => {
  const [exploreData, setExploreData] = useState({
    newReleases: [],
    newArrival: [],
    comingSoon: [],
    deals: [],
  });

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const response = await axios.get("http://localhost:5053/api/Book/explore");
        setExploreData(response.data);
      } catch (error) {
        console.error("Error fetching explore data:", error);
      }
    };

    fetchExploreData();
  }, []);

  const renderBooks = (books) =>
    books.map((book) => (
      <Link to={`/book/${book.book_Id}`} key={book.book_Id}>
        <div className="group glass rounded-2xl p-6 hover-lift transition-all duration-300 border border-white/20 hover:border-purple-400/50 animate-fade-in-up">
          <div className="relative overflow-hidden rounded-xl mb-4">
            <div className="h-48 bg-gradient-to-br from-purple-400/20 to-pink-400/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
              <i className="fas fa-book text-4xl text-white/40"></i>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors duration-300 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-purple-200/80">{book.author}</p>
            <p className="text-lg font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">${book.price}</p>
          </div>
        </div>
      </Link>
    ))

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
        <h1 className="text-5xl font-bold mb-6 text-center gradient-text animate-fade-in-up">Explore Books</h1>
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

        {exploreData.newReleases.length > 0 && (
          <section className="mb-12 animate-fade-in-up animation-delay-400">
            <h2 className="text-3xl font-bold mb-6 gradient-text">New Releases</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderBooks(exploreData.newReleases)}
            </div>
          </section>
        )}

        {exploreData.newArrival.length > 0 && (
          <section className="mb-12 animate-fade-in-up animation-delay-600">
            <h2 className="text-3xl font-bold mb-6 gradient-text">New Arrivals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderBooks(exploreData.newArrival)}
            </div>
          </section>
        )}

        {/* Coming Soon */}
        {exploreData.comingSoon.length > 0 && (
          <section className="mb-12 animate-fade-in-up animation-delay-800">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Coming Soon</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderBooks(exploreData.comingSoon)}
            </div>
          </section>
        )}

        {exploreData.deals.length > 0 && (
          <section className="mb-12 animate-fade-in-up animation-delay-1000">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Hot Deals</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {renderBooks(exploreData.deals)}
            </div>
          </section>
        )}

        <section className="animate-fade-in-up animation-delay-1200">
          <h2 className="text-3xl font-bold mb-6 gradient-text">Top Categories</h2>
          <div className="flex flex-wrap gap-4">
            {["Fiction", "Non-Fiction", "Mystery", "Sci-Fi"].map((category, i) => (
              <div
                key={i}
                className="group px-8 py-4 glass rounded-2xl cursor-pointer border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover-lift"
              >
                <span className="text-white font-semibold group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {category}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default ExplorePage;
