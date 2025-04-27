import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const AddDelivery = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [items, setItems] = useState([{ itemName: "", sku: "", quantity: 1}]);
  const { apiURL } = useContext(UserContext);

  // Fetch warehouses
  useEffect(() => {
    axios.get(`${apiURL}/api/warehouses`)
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error("Error fetching warehouses:", err));
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post(`${apiURL}/api/deliveries`, {
      warehouse,
      customerName,
      invoiceNumber,
      items
    })
      .then(() => {
        alert("Delivery added successfully!");
        setWarehouse("");
        setCustomerName("");
        setInvoiceNumber("");
        setItems([{ itemName: "", sku: "", quantity: 1}]);
      })
      .catch((error) => console.error("Error adding delivery:", error));
  };

  // Handle adding a new item row
  const addItem = () => {
    setItems([...items, { itemName: "", sku: "", quantity: 1}]);
  };

  // Handle updating item details
  const updateItem = (index, key, value) => {
    const newItems = [...items];
    newItems[index][key] = value;
    setItems(newItems);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Delivery</h2>

      <label>Warehouse:</label>
      <select value={warehouse} onChange={(e) => setWarehouse(e.target.value)} required>
        <option value="">Select Warehouse</option>
        {warehouses.map((w) => (
          <option key={w._id} value={w._id}>{w.name}</option>
        ))}
      </select>

      <label>Customer Name:</label>
      <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />

      <label>Invoice Number:</label>
      <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />

      <h3>Items</h3>
      {items.map((item, index) => (
        <div key={index}>
          <input type="text" placeholder="Item Name" value={item.itemName} onChange={(e) => updateItem(index, "itemName", e.target.value)} required />
          <input type="text" placeholder="SKU" value={item.sku} onChange={(e) => updateItem(index, "sku", e.target.value)} required />
          <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value))} required />
          
        </div>
      ))}
      <button type="button" onClick={addItem}>Add Another Item</button>

      <button type="submit">Add Delivery</button>
    </form>
  );
};

export default AddDelivery;
