import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const FinishedProductTransfers = () => {
  const { apiURL } = useContext(UserContext);
  const [combinedProducts, setCombinedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [threshold, setThreshold] = useState(10); // Threshold for out-of-stock check
  const [requestStatus, setRequestStatus] = useState({}); // To track the request status for each product

  useEffect(() => {
    fetchTransfers();
  }, []);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/api/finishedproducttransfers`);
      const receivedTransfers = response.data.filter(t => t.status === "Received");
      const combined = combineReceivedProducts(receivedTransfers);
      setCombinedProducts(combined);
    } catch (error) {
      setMessage("❌ Error fetching transfers.");
    } finally {
      setLoading(false);
    }
  };

  const combineReceivedProducts = (transfers) => {
    const grouped = transfers.reduce((acc, item) => {
      const key = item.productName;
      if (!acc[key]) {
        acc[key] = {
          productName: key,
          totalQuantity: 0
        };
      }
      acc[key].totalQuantity += item.quantity || 0;
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const filteredProducts = combinedProducts.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if the product is out of stock
  const isOutOfStock = (productQuantity) => {
    return productQuantity <= threshold; // Mark as out of stock if quantity is <= threshold
  };

  // Function to request stock for out-of-stock products
  const handleRequestStock = async (productName) => {
    try {
      // Set the request status to 'Pending' when the stock request is initiated
      setRequestStatus(prevStatus => ({
        ...prevStatus,
        [productName]: "Pending"
      }));

      // Simulate a stock request by calling an API or updating the request status
      // For now, we'll immediately approve the request to simulate success
      // You can replace this logic with an actual API call to request stock
      setTimeout(() => {
        setRequestStatus(prevStatus => ({
          ...prevStatus,
          [productName]: "Approved"
        }));
        setMessage(`✅ Stock request for "${productName}" has been approved.`);
      }, 2000);
    } catch (error) {
      setRequestStatus(prevStatus => ({
        ...prevStatus,
        [productName]: "Rejected"
      }));
      setMessage(`❌ Failed to request stock for "${productName}".`);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-4">Inventory System</h1>
          {message && <p className={`mb-4 ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>{message}</p>}

          {loading ? (
            <p>Loading received products...</p>
          ) : filteredProducts.length === 0 ? (
            <p>No received products found.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Total Quantity Received</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Request Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-3">{product.productName}</td>
                    <td className="p-3">{product.totalQuantity}</td>
                    <td className="p-3">
                      {isOutOfStock(product.totalQuantity) ? (
                        <span className="text-red-600">Out of Stock</span>
                      ) : (
                        <span className="text-green-600">In Stock</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isOutOfStock(product.totalQuantity) ? (
                        <span className="text-yellow-600">{requestStatus[product.productName] || "Pending"}</span>
                      ) : (
                        <span className="text-green-600">N/A</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isOutOfStock(product.totalQuantity) && requestStatus[product.productName] !== "Approved" && (
                        <button
                          onClick={() => handleRequestStock(product.productName)}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Request Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinishedProductTransfers;
