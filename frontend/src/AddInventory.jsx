import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const AddInventory = () => {
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [totalStock, setTotalStock] = useState("");
  const [reservedStock, setReservedStock] = useState("");
  const [availableStock, setAvailableStock] = useState("");
  const [unit, setUnit] = useState("");
  const [batchNumbers, setBatchNumbers] = useState("");
  const [expiryDates, setExpiryDates] = useState("");
  const [lastSupplierId, setLastSupplierId] = useState("");
  const [lastSupplierName, setLastSupplierName] = useState("");
  const [lastReceivedDate, setLastReceivedDate] = useState("");
  const [lastUpdatedBy, setLastUpdatedBy] = useState("");
  const [error, setError] = useState("");
  
  const { apiURL } = useContext(UserContext);

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Ensure available stock is calculated dynamically
    const computedAvailableStock = totalStock - reservedStock;
  
    const inventoryData = {
      productId,
      productName,
      category,
      warehouseLocation,
      totalStock,
      reservedStock,
      availableStock: computedAvailableStock,  // Auto-calculated
      unit,
      batchNumbers: batchNumbers.split(",").map((batch) => batch.trim()),
      expiryDates: expiryDates.split(",").map((date) => new Date(date.trim())),
      lastSupplierId,
      lastSupplierName,
      lastReceivedDate: lastReceivedDate ? new Date(lastReceivedDate) : null,
      lastUpdatedBy,
    };
  
    console.log("📦 Sending Data:", inventoryData);
  
    try {
      const res = await axios.post(`${apiURL}/api/warehouses`, inventoryData);
      alert("✅ Inventory added successfully!");
  
      // Reset form fields
      setProductId("");
      setProductName("");
      setCategory("");
      setWarehouseLocation("");
      setTotalStock("");
      setReservedStock("");
      setAvailableStock(""); // Will be computed dynamically next time
      setUnit("");
      setBatchNumbers("");
      setExpiryDates("");
      setLastSupplierId("");
      setLastSupplierName("");
      setLastReceivedDate("");
      setLastUpdatedBy("");
      setError("");
    } catch (error) {
      console.error("❌ Error adding inventory:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to add inventory");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search />

        <div className="max-w-5xl mx-auto mt-8 bg-white p-8 rounded-md shadow-md text-black">
          <h1 className="text-2xl font-bold mb-10 text-center">Add Inventory Item</h1>

          {/* Display Error Message */}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
            <div>
                        <label className="text-lg font-bold">Product ID:</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={productId} 
                          onChange={(e) => setProductId(e.target.value)} 
                        />
                      </div>
              <div>
                <label className="text-lg font-bold">Product Name:</label>
                <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} required />
              </div>

              <div>
                <label className="text-lg font-bold">Category:</label>
                <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>

              <div>
                <label className="text-lg font-bold">Warehouse Location:</label>
                <input type="text" className="form-control" value={warehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} required />
              </div>

              <div>
                <label className="text-lg font-bold">Total Stock:</label>
                <input type="number" className="form-control" value={totalStock} onChange={(e) => setTotalStock(e.target.value)} required />
              </div>

              <div>
                <label className="text-lg font-bold">Reserved Stock:</label>
                <input type="number" className="form-control" value={reservedStock} onChange={(e) => setReservedStock(e.target.value)} required />
              </div>
              <div>
                  <label className="text-lg font-bold">Available Stock:</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={totalStock - reservedStock || 0} // Auto-calculate
                        readOnly 
                      />
                    </div>

              <div>
                <label className="text-lg font-bold">Unit:</label>
                <input type="text" className="form-control" value={unit} onChange={(e) => setUnit(e.target.value)} required />
              </div>

              <div>
                <label className="text-lg font-bold">Batch Numbers (comma-separated):</label>
                <input type="text" className="form-control" value={batchNumbers} onChange={(e) => setBatchNumbers(e.target.value)} />
              </div>

              <div>
                <label className="text-lg font-bold">Expiry Dates (comma-separated):</label>
                <input type="text" className="form-control" value={expiryDates} onChange={(e) => setExpiryDates(e.target.value)} />
              </div>

              <div>
                <label className="text-lg font-bold">Last Supplier ID:</label>
                <input type="text" className="form-control" value={lastSupplierId} onChange={(e) => setLastSupplierId(e.target.value)} />
              </div>

              <div>
                <label className="text-lg font-bold">Last Supplier Name:</label>
                <input type="text" className="form-control" value={lastSupplierName} onChange={(e) => setLastSupplierName(e.target.value)} />
              </div>

              <div>
                <label className="text-lg font-bold">Last Received Date:</label>
                <input 
                        type="date" 
                        className="form-control" 
                        value={lastReceivedDate} 
                        min={new Date().toISOString().split("T")[0]} // Set minimum date to today
                        onChange={(e) => setLastReceivedDate(e.target.value)} 
                      />
              </div>

              <div>
                <label className="text-lg font-bold">Last Updated By:</label>
                <input type="text" className="form-control" value={lastUpdatedBy} onChange={(e) => setLastUpdatedBy(e.target.value)} />
              </div>
            </div>

            <button className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-full" type="submit">
              ➕ Add Inventory
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInventory;
