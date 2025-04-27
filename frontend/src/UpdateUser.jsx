import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";

const UpdateInventory = () => {
  const { id } = useParams(); // Get product ID from URL
  const { apiURL } = useContext(UserContext);
  const navigate = useNavigate();

  // State for inventory fields
  const [inventoryData, setInventoryData] = useState({
    productName: "",
    category: "",
    totalStock: 0,
    reservedStock: 0,
    availableStock: 0,
    unit: "",
    batchNumbers: [],
    expiryDates: [],
    lastSupplierId: "",
    lastSupplierName: "",
    lastReceivedDate: "",
    lastUpdatedBy: "",
    imageUrl: "",
  });

  // Fetch inventory details when component loads
  useEffect(() => {
    if (!id) {
      console.error("Error: No inventory ID provided.");
      return;
    }

    console.log(`Fetching inventory for ID: ${id} from ${apiURL}/api/warehouses/${id}`);

    axios
      .get(`${apiURL}/api/warehouses/${_id}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setInventoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });
  }, [apiURL, id]);

  // Handle form input changes
  const handleChange = (e) => {
    setInventoryData({ ...inventoryData, [e.target.name]: e.target.value });
  };

  // Handle form submission (update request)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(`Updating inventory at: ${apiURL}/api/warehouses/${id}`, inventoryData);

      await axios.put(`${apiURL}/api/warehouses/${id}`, inventoryData);
      alert("Inventory updated successfully!");
      navigate("/inventory"); // Redirect to inventory list
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Failed to update inventory");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full p-6">
        <h1 className="text-3xl font-bold mb-4">Update Inventory</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-bold">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={inventoryData.productName}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Category:</label>
            <input
              type="text"
              name="category"
              value={inventoryData.category}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
            />
          </div>
          <div>
            <label className="block font-bold">Total Stock:</label>
            <input
              type="number"
              name="totalStock"
              value={inventoryData.totalStock}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Reserved Stock:</label>
            <input
              type="number"
              name="reservedStock"
              value={inventoryData.reservedStock}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
            />
          </div>
          <div>
            <label className="block font-bold">Available Stock:</label>
            <input
              type="number"
              name="availableStock"
              value={inventoryData.availableStock}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
              required
            />
          </div>
          <div>
            <label className="block font-bold">Unit:</label>
            <input
              type="text"
              name="unit"
              value={inventoryData.unit}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
            />
          </div>
          <div>
            <label className="block font-bold">Last Supplier:</label>
            <input
              type="text"
              name="lastSupplierName"
              value={inventoryData.lastSupplierName}
              onChange={handleChange}
              className="w-full px-3 py-1 border"
            />
          </div>
          <div>
            <label className="block font-bold">Last Received Date:</label>
            <input
              type="date"
              name="lastReceivedDate"
              value={
                inventoryData.lastReceivedDate
                  ? new Date(inventoryData.lastReceivedDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleChange}
              className="w-full px-3 py-1 border"
            />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-800">
            Update Inventory
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateInventory;
