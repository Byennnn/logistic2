import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { apiURL } = useContext(UserContext);

  // 🟢 Fetch all warehouse items
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${apiURL}/api/warehouses`);
        setInventory(response.data);
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, [apiURL]);

  // 🟢 Delete an inventory item
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this inventory item?")) return;

    try {
      await axios.delete(`${apiURL}/api/warehouses/${productId}`);
      setInventory((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error("Error deleting inventory item:", err);
      setError("Failed to delete item. Please try again.");
    }
  };

  // 🟢 Filter inventory based on search input
  const filteredInventory = inventory.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col w-full p-6">
        <Search />
        <h1 className="text-3xl font-bold mb-4">Inventory System</h1>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by Product Name"
          className="px-4 py-2 border rounded w-full md:w-1/3 mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500">Loading inventory...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Product Name</th>
                  <th className="px-4 py-2 border">Total Stock</th>
                  <th className="px-4 py-2 border">Available Stock</th>
                  <th className="px-4 py-2 border">Last Supplier</th>
                  <th className="px-4 py-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length > 0 ? (
                  filteredInventory.map((item) => (
                    <tr key={item.productId} className="text-center">
                      <td className="px-4 py-2 border">{item.productName}</td>
                      <td className="px-4 py-2 border">{item.totalStock}</td>
                      <td className="px-4 py-2 border">{item.availableStock}</td>
                      <td className="px-4 py-2 border">{item.lastSupplierName || "Unknown"}</td>
                      <td className="px-4 py-2 border">
                        <button
                          onClick={() => handleDelete(item.productId)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          🗑 Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No matching records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;
