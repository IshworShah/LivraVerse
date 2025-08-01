import React, { useState, useEffect } from 'react';

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approving, setApproving] = useState({});
  const [manualClaimCode, setManualClaimCode] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5053/api/Order');
        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();

        const transformedOrders = data.$values?.map(order => ({
          id: order.order_Id,
          userId: order.user.userID,
          customerName: order.user.userName,
          email: order.user.email || 'N/A',
          orderDate: order.orderDate,
          items: order.itemDtos.$values.map(item => ({
            name: item.bookTitle,
            quantity: item.quantity,
            price: item.price,
            bookCover: item.bookCover
          })),
          totalAmount: order.total_Cost,
          status: order.orderStatus === 1 ? 'pending' : order.orderStatus === 2 ? 'approved' : 'rejected',
          claimCode: order.order_Id.substring(0, 8).toLowerCase()
        })) || [];

        setOrders(transformedOrders);
        setFilteredOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.claimCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  const handleApproveOrder = async (orderId, claimCode, memberId) => {
    setApproving(prev => ({ ...prev, [orderId]: true }));

    try {
      const response = await fetch('http://localhost:5053/api/Staff', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, claimCode, memberId })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order =>
          order.id === orderId ? { ...order, status: 'approved' } : order
        ));
        alert('Order approved successfully!');
      } else {
        throw new Error('Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      alert('Failed to approve order. Please try again.');
    } finally {
      setApproving(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleManualApprove = () => {
    const matchedOrder = orders.find(
      order =>
        order.claimCode.toLowerCase() === manualClaimCode.trim().toLowerCase() &&
        order.status === 'pending'
    );

    if (!matchedOrder) {
      alert('No pending order found with this claim code.');
      return;
    }

    handleApproveOrder(matchedOrder.id, matchedOrder.claimCode, matchedOrder.userId);
    setManualClaimCode('');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', symbol: '⏰' },
      approved: { color: 'bg-green-100 text-green-800', symbol: '✅' },
      rejected: { color: 'bg-red-100 text-red-800', symbol: '❌' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <span className="mr-1">{config.symbol}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-2xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and approve customer orders</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Manual Approval */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search by customer name, email, or claim code..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📋</span>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Manual Claim Code Approval */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Approve by Claim Code (Manual Entry)</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Enter claim code (e.g., 0abba055)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={manualClaimCode}
                onChange={(e) => setManualClaimCode(e.target.value)}
              />
              <button
                onClick={handleManualApprove}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                Approve
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Orders ({filteredOrders.length})</h2>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-6xl text-gray-400 block mb-4">⚠️</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                          <div className="text-xs text-gray-400 mt-1">{formatDate(order.orderDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900 font-medium mb-1">Claim Code: {order.claimCode}</div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                {item.bookCover && (
                                  <img
                                    src={`http://localhost:5053/uploads/${item.bookCover}`}
                                    alt={item.name}
                                    className="w-8 h-8 object-cover rounded"
                                    onError={(e) => (e.target.style.display = 'none')}
                                  />
                                )}
                                <span>{item.name} (x{item.quantity}) - ${item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {order.status === 'pending' ? (
                          <button
                            onClick={() => handleApproveOrder(order.id, order.claimCode, order.userId)}
                            disabled={approving[order.id]}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {approving[order.id] ? (
                              <>
                                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Approving...
                              </>
                            ) : (
                              <>
                                <span className="mr-2">✅</span>
                                Approve
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-green-600 font-medium">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
