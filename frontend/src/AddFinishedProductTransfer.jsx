import React, { useState } from "react";
import axios from "axios";

const AddFinishedProductTransfer = ({ onTransferAdded }) => {
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    quantity: "",
    sender: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/finishedProductTransfers", formData);
      onTransferAdded(res.data);
      setMessage("✅ Transfer added successfully!");
      setFormData({ productId: "", productName: "", quantity: "", sender: "" });
    } catch (error) {
      setMessage("❌ Failed to add transfer.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">➕ Add Finished Product Transfer</h2>
      {message && <p className="mb-4 text-green-600">{message}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input type="text" name="productId" placeholder="Product ID" value={formData.productId} onChange={handleChange} required className="border p-2 w-full" />
        <input type="text" name="productName" placeholder="Product Name" value={formData.productName} onChange={handleChange} required className="border p-2 w-full" />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required className="border p-2 w-full" />
        <input type="text" name="sender" placeholder="Sender User ID" value={formData.sender} onChange={handleChange} required className="border p-2 w-full" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
      </form>
    </div>
  );
};

export default AddFinishedProductTransfer;
