import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Components/Sidebar";

const AddInventoryRecord = () => {
  const { apiURL } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    invoiceId: "",
    productId: "",
    productName: "",
    supplierId: "",
    supplierName: "",
    quantityReceived: "",
    unit: "",
    batchNumber: "",
    expiryDate: "",
    warehouseLocation: "",
    inspector: "",
    qcStatus: "Pending",
    receivedDate: new Date().toISOString().split("T")[0],
    status: "Pending Manual Review",
    remarks: "",
    loggedBy: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${apiURL}/api/inventoryrecords`, formData);
      setMessage("✅ Inventory record added successfully!");

      // Reset form
      setFormData({
        invoiceId: "",
        productId: "",
        productName: "",
        supplierId: "",
        supplierName: "",
        quantityReceived: "",
        unit: "",
        batchNumber: "",
        expiryDate: "",
        warehouseLocation: "",
        inspector: "",
        qcStatus: "Pending",
        receivedDate: new Date().toISOString().split("T")[0],
        status: "Pending Manual Review",
        remarks: "",
        loggedBy: "",
      });

      // Redirect after 1.5s
      setTimeout(() => navigate("/InventoryRecords"), 1500);
    } catch (error) {
      console.error("❌ Error adding inventory record:", error);
      setMessage("❌ Failed to add inventory record. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-6 bg-gray-100 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">📋 Add Inventory Record</h1>
          
          {message && (
            <p className={`mb-4 text-center font-semibold ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "📜 Invoice ID", name: "invoiceId", type: "text" },
              { label: "🔢 Product ID", name: "productId", type: "text" },
              { label: "📦 Product Name", name: "productName", type: "text" },
              { label: "🏢 Supplier ID", name: "supplierId", type: "text" },
              { label: "🏢 Supplier Name", name: "supplierName", type: "text" },
              { label: "📊 Quantity Received", name: "quantityReceived", type: "number" },
              { label: "📏 Unit", name: "unit", type: "text" },
              { label: "🔖 Batch Number", name: "batchNumber", type: "text" },
              { label: "⏳ Expiry Date", name: "expiryDate", type: "date" },
              { label: "🏢 Warehouse Location", name: "warehouseLocation", type: "text" },
              { label: "🕵️ Inspector", name: "inspector", type: "text" },
              { label: "📅 Received Date", name: "receivedDate", type: "date" },
              { label: "👤 Logged By", name: "loggedBy", type: "text" },
            ].map(({ label, name, type }) => (
              <div key={name}>
                <label className="block text-sm font-semibold text-gray-600 mb-1">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "batchNumber"}
                  className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
                />
              </div>
            ))}

            {/* QC Status Dropdown */}
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">✅ QC Status</label>
              <select
                name="qcStatus"
                value={formData.qcStatus}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              >
                <option value="Pending">Pending</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-600 mb-1">📝 Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 w-full md:w-auto"
              >
                ➕ Add Inventory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventoryRecord;
