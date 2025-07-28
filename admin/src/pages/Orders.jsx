import React from "react";
import { useEffect } from "react";
import { use } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/admin_assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
        console.error("Failed to fetch orders:", response.statusText);
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch orders");
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleStatusChange = async (event, orderId) => {
    const newStatus = event.target.value;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update order status");
        console.error("Failed to update order status:", response.statusText);
      }
    } catch (error) {
      toast.error(error.message || "Failed to update order status");
      console.error("Failed to update order status:", error);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      {orders.length === 0 && (
        <div className="text-center text-gray-600 text-lg py-8">
          No orders found.
        </div>
      )}
      {orders.map((order, index) => (
        <div
          className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-5 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 "
          key={index}
        >
          <img className="w-12" src={assets.parcel_icon} alt="Parcel Icon" />
          <div>
            <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2">
              Order Details
            </h4>
            <div className="space-y-1">
              {Array.isArray(order.products) &&
                order.products.map((product, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    <span className="font-medium">{product.name}</span> (Qty:{" "}
                    {product.quantity}, Size: {product.size || "N/A"})
                  </p>
                ))}
            </div>

            <p className="mt-3 font-medium text-sm sm:text-base text-gray-800">
              Customer: {order.address.firstName} {order.address.lastName}
            </p>
            <div className="mt-2 text-sm text-gray-600">
              <p className="font-medium">Address:</p>
              <p>{order.address.street},</p>
              <p>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country}, {order.address.zip}
              </p>
              <p>{order.address.phone}</p>
            </div>
            <p>{order.address.phone}</p>
          </div>

          <div className="text-sm sm:text-base text-gray-600">
            <p>
              <span className="font-medium">Items:</span>{" "}
              {order.products.length}
            </p>
            <p className="mt-2">
              <span className="font-medium">Method:</span> {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              {order.payment ? (
                <span className="text-green-600">Done</span>
              ) : (
                <span className="text-red-600">Pending</span>
              )}
            </p>
            <p>
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>
          <p className="text-sm sm:text-[15px]">
            {currency}
            {order.amount}
          </p>
          <select
            onChange={(event) => handleStatusChange(event, order._id)}
            value={order.status}
            className="p-2 font-semibold"
          >
            <option value="Order Placed">Order Placed</option>
            <option value="Packing">Packing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default Orders;
