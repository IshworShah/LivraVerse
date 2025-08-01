import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";

const AdminDash = () => {
  // Stats are currently not displayed but kept for future use
  const [, setUserStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    bannedUsers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserStats(res.data);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow px-6 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-lg text-gray-500 mt-2">Welcome back, Admin! Here's a quick overview.</p>
          </div>

          {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { title: "Total Users", value: userStats.totalUsers, color: "blue" },
                { title: "Active Users", value: userStats.activeUsers, color: "green" },
                { title: "Pending Users", value: userStats.pendingUsers, color: "yellow" }
              ].map((stat) => (
                <div
                  key={stat.title}
                  className={`bg-${stat.color}-100 border-l-4 border-${stat.color}-500 p-5 rounded-xl shadow hover:shadow-lg transition`}
                >
                  <h3 className="text-md text-gray-600">{stat.title}</h3>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
              ))}
            </div> */}
          <p className="text-lg text-gray-500 mt-2 mb-4">For Users</p>
          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              to="/admin/users"
              className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Users</h3>
              <p className="text-gray-600">View and control user accounts and access levels.</p>
            </Link>

            <Link
              to="/admin/reports"
              className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports & Analytics</h3>
              <p className="text-gray-600">Review usage metrics, feedback, and activity logs.</p>
            </Link>

            <Link
              to="/admin/settings"
              className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Site Settings</h3>
              <p className="text-gray-600">Adjust global configurations and platform settings.</p>
            </Link>
          </div>
          <p className="text-lg text-gray-500 mt-4 ">Books and Orders</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
  {/* Manage Books */}
  <Link
    to="/admin/books"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Books</h3>
    <p className="text-gray-600">Add, update, or delete books in the store.</p>
  </Link>

  {/* Manage Categories */}
  <Link
    to="/admin/categories"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Book Categories</h3>
    <p className="text-gray-600">Organize books into categories and genres.</p>
  </Link>

  {/* Manage Orders */}
  <Link
    to="/admin/orders"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Orders & Shipping</h3>
    <p className="text-gray-600">View customer orders and update their status.</p>
  </Link>

  {/* Manage Users */}
  <Link
    to="/admin/users"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Users</h3>
    <p className="text-gray-600">Control user roles and access.</p>
  </Link>

  {/* Reports */}
  <Link
    to="/admin/reports"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Reports & Feedback</h3>
    <p className="text-gray-600">View analytics, feedback, and user activity logs.</p>
  </Link>

  {/* Site Settings */}
  <Link
    to="/admin/settings"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Site Settings</h3>
    <p className="text-gray-600">Adjust platform configurations and preferences.</p>
  </Link>

  {/* Manage Announcements */}
  <Link
    to="/admin/announcements"
    className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
  >
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Manage Announcements</h3>
    <p className="text-gray-600">Create and manage announcements for the offers page.</p>
  </Link>
</div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDash;
