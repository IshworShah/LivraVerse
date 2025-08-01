import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../headers/header";
import Footer from "../../footers/footer";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [viewingAnnouncement, setViewingAnnouncement] = useState(null);
  const [showAnnouncementDetails, setShowAnnouncementDetails] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    messsage: "",
    startDate: "",
    endDate: "",
    bookDtos: []
  });

  const initialAnnouncement = {
    id: "",
    title: "",
    messsage: "",
    startDate: "",
    endDate: "",
    bookDtos: []
  };

  // Fetch announcements
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5053/api/Announcement");
      
      // Extract announcements from the API response - handle $values structure
      let apiAnnouncements = [];
      if (response.data.$values) {
        apiAnnouncements = response.data.$values;
      } else if (Array.isArray(response.data)) {
        apiAnnouncements = response.data;
      }
      
      setAnnouncements(Array.isArray(apiAnnouncements) ? apiAnnouncements : []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      alert("Failed to fetch announcements");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch books for selection
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:5053/api/Book/books");
      
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
      
      setBooks(Array.isArray(apiBooks) ? apiBooks : []);
    } catch (error) {
      console.error("Error fetching books:", error);
      setBooks([]);
    }
  };

  // Fetch announcement by ID
  const fetchAnnouncementById = async (announcementId) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5053/api/Announcement/${announcementId}`);
      setViewingAnnouncement(response.data);
      setShowAnnouncementDetails(true);
    } catch (error) {
      console.error("Error fetching announcement details:", error);
      alert("Failed to fetch announcement details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchBooks();
  }, []);

  // Handle create announcement
  const handleCreate = async () => {
    setLoading(true);
    try {
      const createData = {
        title: formData.title,
        messsage: formData.messsage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        bookDtos: formData.bookDtos
      };
      await axios.post("http://localhost:5053/api/Announcement", createData);
      alert("Announcement created successfully!");
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    } finally {
      setLoading(false);
    }
  };

  // Handle update announcement
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        messsage: formData.messsage,
        startDate: formData.startDate,
        endDate: formData.endDate,
        bookDtos: formData.bookDtos
      };
      await axios.put(`http://localhost:5053/api/Announcement/${formData.id}`, updateData);
      alert("Announcement updated successfully!");
      fetchAnnouncements();
      resetForm();
    } catch (error) {
      console.error("Error updating announcement:", error);
      alert("Failed to update announcement");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete announcement
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5053/api/Announcement/${id}`);
        alert("Announcement deleted successfully!");
        fetchAnnouncements();
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Failed to delete announcement");
      } finally {
        setLoading(false);
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialAnnouncement);
    setEditing(false);
  };

  // Open edit form
  const openEditForm = (announcement) => {
    setFormData({
      id: announcement.id,
      title: announcement.title,
      messsage: announcement.messsage,
      startDate: announcement.startDate ? announcement.startDate.split('T')[0] : "",
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : "",
      bookDtos: announcement.bookDtos || []
    });
    setEditing(true);
  };

  // Close announcement details
  const closeAnnouncementDetails = () => {
    setViewingAnnouncement(null);
    setShowAnnouncementDetails(false);
  };

  // Handle book selection
  const handleBookSelection = (bookId) => {
    const updatedBooks = formData.bookDtos.includes(bookId)
      ? formData.bookDtos.filter(id => id !== bookId)
      : [...formData.bookDtos, bookId];
    
    setFormData({ ...formData, bookDtos: updatedBooks });
  };

  // Render form
  const renderForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold mb-4">
        {editing ? "Edit Announcement" : "Add New Announcement"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter announcement title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          value={formData.messsage}
          onChange={(e) => setFormData({ ...formData, messsage: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="4"
          placeholder="Enter announcement message"
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Associated Books</label>
        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
          {books.map((book) => (
            <div key={book.book_Id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`book-${book.book_Id}`}
                checked={formData.bookDtos.includes(book.book_Id)}
                onChange={() => handleBookSelection(book.book_Id)}
                className="mr-2"
              />
              <label htmlFor={`book-${book.book_Id}`} className="text-sm">
                {book.title} by {book.author}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-4 mt-6">
        <button
          onClick={resetForm}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Processing..." : editing ? "Update" : "Add"} Announcement
        </button>
      </div>
    </div>
  );

  // Render announcement details modal
  const renderAnnouncementDetails = () => {
    if (!viewingAnnouncement) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Announcement Details</h3>
            <button
              onClick={closeAnnouncementDetails}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <div><strong>Title:</strong> {viewingAnnouncement.title}</div>
            <div><strong>Message:</strong> {viewingAnnouncement.messsage}</div>
            <div><strong>Start Date:</strong> {new Date(viewingAnnouncement.startDate).toLocaleDateString()}</div>
            <div><strong>End Date:</strong> {new Date(viewingAnnouncement.endDate).toLocaleDateString()}</div>
            <div><strong>Associated Books:</strong> {viewingAnnouncement.bookDtos?.length || 0} books</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-grow px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Admin - Manage Announcements</h1>
            <p className="text-gray-600 mt-2">Create and manage announcements for the offers page</p>
          </div>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="mb-6 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Add New Announcement
            </button>
          )}

          {editing && renderForm()}

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-center">Loading...</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Books</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {announcements.map((announcement) => (
                  <tr key={announcement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {announcement.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(announcement.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(announcement.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {announcement.bookDtos?.length || 0} books
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => fetchAnnouncementById(announcement.id)}
                        className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                        disabled={loading}
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditForm(announcement)}
                        className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {announcements.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No announcements found. Create your first announcement!
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showAnnouncementDetails && renderAnnouncementDetails()}
      <Footer />
    </div>
  );
};

export default Announcements;
