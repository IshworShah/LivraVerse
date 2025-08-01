import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminBookPage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewingBook, setViewingBook] = useState(null);
  const [showBookDetails, setShowBookDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  // These state variables are defined but not currently used in API calls
  // They are kept for future implementation of filtering and sorting
  const [searchQuery] = useState("");
  const [sort] = useState("popular");
  const [category] = useState([]);
  const [priceRange] = useState([0, 1000]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const initialBook = {
    title: "",
    author: "",
    description: "",
    price: 0,
    stockQuantity: 0,
    bookCategoty: 0, // Note: backend has typo 'BookCategoty'
    physicalLibraryAvailability: false,
    ISBN: "",
    languages: 1, // Default to English
    format: 1,
    editionType: 1,
    discountPercent: 0,
    publicationDate: new Date().toISOString().split('T')[0],
    discountTime: "",
    genres: [1], // Default to Fantasy
    isOnSale: false,
    coverImage: null,
  };

  const [formData, setFormData] = useState(initialBook);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5053/api/Book/books", {
        params: {
          SearchQuery: searchQuery,
          PageNumber: page,
          PageSize: 10,
          SortBy: sort === "popular" ? "popularity" : "price",
          SortOrder: sort === "highToLow" ? "desc" : "asc",
          Genre: category.join(","),
          MinPrice: priceRange[0],
          MaxPrice: priceRange[1],
        },
      });

      console.log("Admin Books API Response:", response.data);
      
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
      
      setBooks(apiBooks || []);
      setTotalPages(response.data.totalPage || response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching books:", error);
      alert("Failed to fetch books. Please try again.");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5053/api/Book/book/categories");
      
      console.log("Categories API Response:", response.data);
      
      // Extract categories from the API response - handle various structures
      let apiCategories = [];
      if (response.data.$values) {
        apiCategories = response.data.$values;
      } else if (Array.isArray(response.data)) {
        apiCategories = response.data;
      }
      
      setCategories(apiCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchBookById = async (bookId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5053/api/Book/book/${bookId}`);
      
      console.log("Book Details API Response:", response.data);
      
      // Extract book data from the API response
      let bookData = response.data;
      if (response.data.$values && response.data.$values.length > 0) {
        bookData = response.data.$values[0];
      }
      
      setViewingBook(bookData);
      setShowBookDetails(true);
    } catch (error) {
      console.error("Error fetching book details:", error);
      alert("Failed to fetch book details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateBookStatus = async (bookId, newStatus) => {
    try {
      await axios.patch(`http://localhost:5053/api/Book/UpdateStatus/${bookId}`, {
        status: newStatus
      });
      alert("Book status updated successfully!");
      fetchBooks();
    } catch (error) {
      console.error("Error updating book status:", error);
      alert("Failed to update book status. Please try again.");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, [searchQuery, sort, category, priceRange, page]);

  const handleCreate = async () => {
    try {
      // Validate required fields
      if (!formData.title || formData.title.trim() === "") {
        alert("Please enter a book title");
        return;
      }
      if (!formData.author || formData.author.trim() === "") {
        alert("Please enter an author name");
        return;
      }
      if (!formData.description || formData.description.trim().length < 30) {
        alert("Please enter a description with at least 30 characters");
        return;
      }
      if (!formData.ISBN || formData.ISBN.trim() === "") {
        alert("Please enter an ISBN");
        return;
      }
      if (!formData.coverImage) {
        alert("Please select a cover image");
        return;
      }
      if (formData.price <= 0) {
        alert("Please enter a valid price greater than 0");
        return;
      }

      setLoading(true);
      const data = new FormData();
      
      // Add all form fields with proper formatting and validation
      data.append("title", formData.title || "");
      data.append("author", formData.author || "");
      data.append("description", formData.description || "");
      data.append("price", (isNaN(formData.price) ? 0 : formData.price).toString());
      data.append("stockQuantity", (isNaN(formData.stockQuantity) ? 0 : formData.stockQuantity).toString());
      data.append("bookCategoty", (isNaN(formData.bookCategoty) ? 0 : formData.bookCategoty).toString());
      data.append("physicalLibraryAvailability", formData.physicalLibraryAvailability.toString());
      data.append("ISBN", formData.ISBN || "");
      data.append("languages", (isNaN(formData.languages) ? 1 : formData.languages).toString());
      data.append("format", (isNaN(formData.format) ? 1 : formData.format).toString());
      data.append("editionType", (isNaN(formData.editionType) ? 1 : formData.editionType).toString());
      data.append("discountPercent", (isNaN(formData.discountPercent) ? 0 : formData.discountPercent).toString());
      data.append("isOnSale", formData.isOnSale.toString());
      
      // Handle dates
      if (formData.publicationDate) {
        data.append("publicationDate", new Date(formData.publicationDate).toISOString());
      }
      if (formData.discountTime) {
        data.append("discountTime", new Date(formData.discountTime).toISOString());
      }
      
      // Handle genres array
      if (Array.isArray(formData.genres)) {
        formData.genres.forEach((genre, index) => {
          const genreValue = isNaN(genre) ? 1 : genre;
          data.append(`genres[${index}]`, genreValue.toString());
        });
      } else {
        // Default to Fantasy genre if genres is not an array
        data.append(`genres[0]`, "1");
      }
      
      // Handle cover image
      if (formData.coverImage) {
        data.append("coverImage", formData.coverImage);
      }

      await axios.post("http://localhost:5053/api/Book/AddBook", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Book created successfully!");
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error("Failed to create book:", err);
      if (err.response?.data) {
        alert(`Failed to create book: ${err.response.data}`);
      } else {
        alert("Failed to create book. Please check all fields and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "genres") {
          data.append("genres", JSON.stringify(value));
        } else if (key === "coverImage" && value) {
          data.append("coverImage", value);
        } else {
          data.append(key, value);
        }
      });

      await axios.put("http://localhost:5053/api/Book/UpdateBook", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Book updated successfully!");
      resetForm();
      fetchBooks();
    } catch (err) {
      console.error("Failed to update book:", err);
      alert("Failed to update book. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    try {
      await axios.delete(`http://localhost:5053/api/Book/book/${id}`);
      alert("Book deleted successfully!");
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book:", err);
      alert("Failed to delete book. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData(initialBook);
    setEditingBook(null);
    setShowForm(false);
  };

  const closeBookDetails = () => {
    setViewingBook(null);
    setShowBookDetails(false);
  };

  const openEditForm = (book) => {
    setEditingBook(book);
    setFormData({ ...book, genres: book.genres || [] });
    setShowForm(true);
  };

  const renderBookDetails = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Book Details</h2>
          <button onClick={closeBookDetails} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        {viewingBook && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Title:</strong> {viewingBook.title}</div>
              <div><strong>Author:</strong> {viewingBook.author}</div>
              <div><strong>Price:</strong> ${viewingBook.price?.toFixed(2)}</div>
              <div><strong>Stock:</strong> {viewingBook.stockQuantity}</div>
              <div><strong>ISBN:</strong> {viewingBook.ISBN}</div>
              <div><strong>Category ID:</strong> {viewingBook.bookCategoty}</div>
            </div>
            <div><strong>Description:</strong> {viewingBook.description}</div>
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Physical Library:</strong> {viewingBook.physicalLibraryAvailability ? 'Yes' : 'No'}</div>
              <div><strong>On Sale:</strong> {viewingBook.isOnSale ? 'Yes' : 'No'}</div>
              <div><strong>Discount:</strong> {viewingBook.discountPercent}%</div>
              <div><strong>Language ID:</strong> {viewingBook.languages}</div>
              <div><strong>Format ID:</strong> {viewingBook.format}</div>
              <div><strong>Edition Type ID:</strong> {viewingBook.editionType}</div>
            </div>
            {viewingBook.genres && viewingBook.genres.length > 0 && (
              <div><strong>Genres:</strong> {viewingBook.genres.join(', ')}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Publication Date:</strong> {viewingBook.publicationDate ? new Date(viewingBook.publicationDate).toLocaleDateString() : 'N/A'}</div>
              <div><strong>Discount Time:</strong> {viewingBook.discountTime ? new Date(viewingBook.discountTime).toLocaleDateString() : 'N/A'}</div>
            </div>
            {viewingBook.coverImage && (
              <div>
                <strong>Cover Image:</strong>
                <img src={viewingBook.coverImage} alt="Book Cover" className="mt-2 max-w-xs h-auto" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="bg-white p-6 rounded shadow-md mt-4">
      <h2 className="text-xl font-semibold mb-4">{editingBook ? "Edit Book" : "Add New Book"}</h2>
      <div className="space-y-3">
        <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="border p-2 w-full rounded" />
        <input type="text" placeholder="Author" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="border p-2 w-full rounded" />
        <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })} className="border p-2 w-full rounded" />
        <select 
          value={formData.bookCategoty}
          onChange={e => setFormData({ ...formData, bookCategoty: parseInt(e.target.value) || 0 })} 
          className="border p-2 w-full rounded"
        >
          <option value={0}>Select Category</option>
          {categories.map((category, index) => (
            <option key={category.id || `category-${index}`} value={category.id}>
              {category.name || `Category ${category.id}`}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.physicalLibraryAvailability} onChange={e => setFormData({ ...formData, physicalLibraryAvailability: e.target.checked })} />
          Physical Library Availability
        </label>
        <input type="text" placeholder="ISBN" value={formData.ISBN} onChange={e => setFormData({ ...formData, ISBN: e.target.value })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Language ID" value={formData.languages} onChange={e => setFormData({ ...formData, languages: parseInt(e.target.value) || 1 })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Format ID" value={formData.format} onChange={e => setFormData({ ...formData, format: parseInt(e.target.value) || 1 })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Edition Type ID" value={formData.editionType} onChange={e => setFormData({ ...formData, editionType: parseInt(e.target.value) || 1 })} className="border p-2 w-full rounded" />
        <input type="number" placeholder="Discount Percent" value={formData.discountPercent} onChange={e => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })} className="border p-2 w-full rounded" />
        <input type="datetime-local" value={formData.publicationDate} onChange={e => setFormData({ ...formData, publicationDate: e.target.value })} className="border p-2 w-full rounded" />
        <input type="datetime-local" value={formData.discountTime} onChange={e => setFormData({ ...formData, discountTime: e.target.value })} className="border p-2 w-full rounded" />
        <input type="text" placeholder="Genre IDs (comma-separated, e.g., 1,2,3)" value={formData.genres.join(",")} onChange={e => setFormData({ ...formData, genres: e.target.value.split(",").map(g => parseInt(g.trim()) || 1) })} className="border p-2 w-full rounded" />
        <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, coverImage: e.target.files[0] })} className="border p-2 w-full rounded" />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={formData.isOnSale} onChange={e => setFormData({ ...formData, isOnSale: e.target.checked })} />
          Is On Sale
        </label>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={resetForm} className="px-4 py-2 rounded bg-gray-300">Cancel</button>
        <button onClick={editingBook ? handleUpdate : handleCreate} className="px-4 py-2 rounded bg-black text-white">
          {editingBook ? "Save" : "Add"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-10 text-black">
      <h1 className="text-3xl font-bold mb-6">Admin - Manage Books</h1>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          </div>
        </div>
      )}

      {/* <div className="mb-6 flex flex-wrap gap-4">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="border p-2 rounded" />
        <select value={sort} onChange={e => setSort(e.target.value)} className="border p-2 rounded">
          <option value="popular">Most Popular</option>
          <option value="highToLow">Price: High to Low</option>
          <option value="lowToHigh">Price: Low to High</option>
        </select>
        <input type="number" placeholder="Min Price" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="border p-2 rounded w-24" />
        <input type="number" placeholder="Max Price" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="border p-2 rounded w-24" />
      </div> */}

      <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 mb-6">
        Add New Book
      </button>

      {showForm && renderForm()}
      {showBookDetails && renderBookDetails()}

      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Books</h2>
        {books.length === 0 ? (
          <p className="text-gray-500">No books found.</p>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="border-b">
                <th className="py-2">Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id || `book-${index}`} className="border-t">
                  <td className="py-2">{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.stockQuantity}</td>
                  <td>{book.bookCategoty}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${
                      book.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {book.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => fetchBookById(book.id)} 
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        disabled={loading}
                      >
                        View
                      </button>
                      <button 
                        onClick={() => openEditForm(book)} 
                        className="text-green-600 hover:text-green-800 text-sm"
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => updateBookStatus(book.id, !book.isActive)} 
                        className="text-yellow-600 hover:text-yellow-800 text-sm"
                        disabled={loading}
                      >
                        {book.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDelete(book.id)} 
                        className="text-red-600 hover:text-red-800 text-sm"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={`page-${i + 1}`}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-black text-white" : "bg-white text-black"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookPage;
