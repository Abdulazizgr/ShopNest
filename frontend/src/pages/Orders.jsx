import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { Title } from "../components";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [trackingLoading, setTrackingLoading] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load orders once on mount
  const loadOrderData = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.products.forEach((product) => {
            allOrdersItem.push({
              ...product,
              orderId: order._id,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
            });
          });
        });
        setOrderData(allOrdersItem.reverse());
      } else {
        toast.error(response.data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Something went wrong while loading orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Track order updates only the clicked product + size
  const trackOrder = async ({ orderId, productId, size }) => {
    if (!token) return;
    const loadingKey = `${productId}-${size}`;
    setTrackingLoading(loadingKey);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/trackOrder`,
        { orderId, productId, size },
        { headers: { token } }
      );
      if (response.data.success) {
        // Update the status of only the clicked product+size
        setOrderData((prev) =>
          prev.map((item) =>
            item._id === productId && item.size === size
              ? { ...item, status: response.data.status }
              : item
          )
        );
      } else {
        toast.error(response.data.message || "Failed to track order");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toast.error("Something went wrong while tracking order");
    } finally {
      setTimeout(() => {
        setTrackingLoading(null);
      }, 1000);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 && !isLoading && (
        <p className="mt-8 text-gray-500 text-center">No orders found.</p>
      )}

      {orderData.map((product, index) => {
        const loadingKey = `${product._id}-${product.size}`;
        const isTrackingLoading = trackingLoading === loadingKey;

        return (
          <div
            key={index}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-16 sm:w-20"
              />
              <div>
                <p className="sm:text-base font-medium">{product.name}</p>
                <div className="flex items-center gap-3 mt-1 text-base text-gray-700">
                  <p>
                    {product.price} {currency}
                  </p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Size: {product.size}</p>
                </div>
                <p className="mt-1">
                  Date:{" "}
                  <span className="text-gray-400">
                    {new Date(product.date).toDateString()}
                  </span>
                </p>
                <p className="mt-1">
                  Payment Method:{" "}
                  <span className="text-gray-400">{product.paymentMethod}</span>
                </p>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2">
                <span className="min-w-2 h-2 rounded-full bg-green-500"></span>
                <p className="text-sm md:text-base">{product.status}</p>
              </div>

              <button
                onClick={() =>
                  trackOrder({
                    orderId: product.orderId,
                    productId: product._id,
                    size: product.size,
                  })
                }
                disabled={isTrackingLoading}
                className={`text-sm font-medium border  border-[#FF725C] px-4 py-2 rounded-sm ${
                  isTrackingLoading ? "bg-gray-500 text-white" : ""
                }`}
              >
                {isTrackingLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Loading...
                  </span>
                ) : (
                  "Track Order"
                )}
              </button>
            </div>
          </div>
        );
      })}

      {isLoading && (
        <p className="text-center mt-4 text-gray-500">Loading orders...</p>
      )}
    </div>
  );
};

export default Orders;
