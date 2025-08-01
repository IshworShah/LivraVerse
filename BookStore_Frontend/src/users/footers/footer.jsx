import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    "Shop": [
      { name: "All Books", href: "/books" },
      { name: "New Arrivals", href: "/books?category=new" },
      { name: "Best Sellers", href: "/books?category=bestsellers" },
      { name: "On Sale", href: "/offers" },
      { name: "Gift Cards", href: "/gift-cards" }
    ],
    "Categories": [
      { name: "Fiction", href: "/books?category=fiction" },
      { name: "Non-Fiction", href: "/books?category=non-fiction" },
      { name: "Science Fiction", href: "/books?category=sci-fi" },
      { name: "Children's Books", href: "/books?category=children" },
      { name: "Academic", href: "/books?category=academic" }
    ],
    "Support": [
      { name: "Help Center", href: "/help" },
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Returns", href: "/returns" },
      { name: "Size Guide", href: "/size-guide" }
    ],
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" },
      { name: "Privacy Policy", href: "/privacy" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: "fab fa-facebook", href: "#" },
    { name: "Twitter", icon: "fab fa-twitter", href: "#" },
    { name: "Instagram", icon: "fab fa-instagram", href: "#" },
    { name: "YouTube", icon: "fab fa-youtube", href: "#" },
    { name: "LinkedIn", icon: "fab fa-linkedin", href: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/home" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-book-open text-white text-xl"></i>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-serif leading-none">
                  LibraVerse
                </span>
                <span className="text-sm text-gray-400">Your Literary Haven</span>
            </div>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Discover your next favorite book with our curated collection of titles across all genres. 
              From timeless classics to contemporary bestsellers, we're here to fuel your reading journey.
            </p>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-white mb-3">Stay Updated</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-white placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-primary hover:bg-primary-dark rounded-r-lg transition-colors duration-200">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors duration-200"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-gray-400 hover:text-white transition-colors duration-200`}></i>
              </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.name}
                </Link>
              </li>
                ))}
            </ul>
          </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} LibraVerse. All rights reserved.
            </div>

            {/* Additional Links */}
            <div className="flex flex-wrap items-center space-x-6 text-sm">
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Terms of Service
                </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Privacy Policy
                </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200">
                Cookie Policy
                </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-200">
                Sitemap
                </Link>
          </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm mr-2">We accept:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <i className="fab fa-cc-visa text-gray-400 text-xs"></i>
                </div>
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <i className="fab fa-cc-mastercard text-gray-400 text-xs"></i>
                </div>
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <i className="fab fa-cc-paypal text-gray-400 text-xs"></i>
                </div>
                <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                  <i className="fab fa-cc-apple-pay text-gray-400 text-xs"></i>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
        aria-label="Back to top"
      >
        <i className="fas fa-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;
