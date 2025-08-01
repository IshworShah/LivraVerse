// src/pages/admin/ReportsPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:5000/api/reports", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReports(res.data))
      .catch((err) => console.error("Failed to load reports", err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Reports & Feedback</h1>
      <ul className="space-y-4">
        {reports.map((report, index) => (
          <li key={index} className="bg-white p-4 border rounded-lg shadow">
            <p><strong>User:</strong> {report.userEmail}</p>
            <p><strong>Message:</strong> {report.message}</p>
            <p className="text-sm text-gray-500">Date: {new Date(report.date).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportsPage;
