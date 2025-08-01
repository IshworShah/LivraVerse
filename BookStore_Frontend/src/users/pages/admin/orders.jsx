import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const response = await axios.get(`http://localhost:5053/api/Order/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        console.log("Raw API response:", data);

        // Handle the nested $values structure from .NET API
        let ordersArray = [];
        
        if (data && typeof data === 'object' && data.$values && Array.isArray(data.$values)) {
          // This is the expected structure from your API
          ordersArray = data.$values;
          console.log("Successfully extracted orders from $values:", ordersArray);
        } else if (Array.isArray(data)) {
          // Fallback for direct array response
          ordersArray = data;
          console.log("Using direct array response:", ordersArray);
        } else {
          console.error("Unexpected orders data structure:", data);
          setError("Unable to process orders data. Please check the API response format.");
          return;
        }

        setOrders(ordersArray);
        
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatOrderStatus = (status) => {
    const statusMap = {
      0: "Pending",
      1: "Confirmed", 
      2: "Processing",
      3: "Shipped",
      4: "Delivered",
      5: "Cancelled"
    };
    return statusMap[status] || `Status ${status}`;
  };

  const formatOrderDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Orders</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {orders.map((order) => (
          <div 
            key={order.order_Id || order.$id} 
            style={{ 
              border: "1px solid #ddd", 
              borderRadius: "8px", 
              padding: "15px",
              backgroundColor: "#f9f9f9"
            }}
          >
            <div style={{ marginBottom: "10px" }}>
              <strong>Order ID:</strong> {order.order_Id}
            </div>
            
            <div style={{ marginBottom: "10px" }}>
              <strong>Customer:</strong> {order.user?.userName || "Unknown Customer"}
            </div>
            
            <div style={{ marginBottom: "10px" }}>
              <strong>Status:</strong> 
              <span style={{ 
                marginLeft: "5px",
                padding: "2px 8px",
                borderRadius: "4px",
                backgroundColor: order.orderStatus === 1 ? "#d4edda" : "#f8d7da",
                color: order.orderStatus === 1 ? "#155724" : "#721c24"
              }}>
                {formatOrderStatus(order.orderStatus)}
              </span>
            </div>
            
            <div style={{ marginBottom: "10px" }}>
              <strong>Order Date:</strong> {formatOrderDate(order.orderDate)}
            </div>
            
            <div style={{ marginBottom: "10px" }}>
              <strong>Total Cost:</strong> ${order.total_Cost || 0}
            </div>
            
            {order.itemDtos?.$values && (
              <div>
                <strong>Items:</strong> {order.itemDtos.$values.length} item(s)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
