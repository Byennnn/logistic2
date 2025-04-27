import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";

const UpdateInvoice = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const navigate = useNavigate();
  const { apiURL } = useContext(UserContext);

  const [invoiceData, setInvoiceData] = useState({
    purchaseOrderId: "",
    orderNumber: "",
    customerName: "",
    customerAddress: "",
    customerContact: "",
    dueDate: "",
    totalAmount: "",
    status: "To review", // Default status
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoiceDetails();
  }, []);

  const fetchInvoiceDetails = async () => {
    try {
      const response = await axios.get(`${apiURL}/api/invoices/${id}`);
      const invoice = response.data;

      // Convert dueDate to "yyyy-MM-dd" format
      const formattedDate = invoice.dueDate ? invoice.dueDate.split("T")[0] : "";

      setInvoiceData({ ...invoice, dueDate: formattedDate });
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      setError("Failed to fetch invoice details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setInvoiceData({ ...invoiceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiURL}/api/invoices/${id}`, invoiceData);
      alert("✅ Invoice updated successfully!");
      navigate("/InvoiceList"); // Redirect to invoices list
    } catch (error) {
      console.error("Error updating invoice:", error);
      setError("Failed to update invoice. Please try again.");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full p-6">
        <h1 className="text-3xl font-bold mb-4">Update Invoicesss</h1>

        {error && <p className="text-red-600">{error}</p>}
        {loading ? (
          <p>Loading invoice details...</p>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
            <input
                type="text"
                name="orderNumber"
                placeholder="Order Number"
                value={invoiceData.purchaseOrderId}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="orderNumber"
                placeholder="Order Number"
                value={invoiceData.orderNumber}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="customerName"
                placeholder="Customer Name"
                value={invoiceData.customerName}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="text"
                name="customerAddress"
                placeholder="Customer Address"
                value={invoiceData.customerAddress}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="text"
                name="customerContact"
                placeholder="Customer Contact"
                value={invoiceData.customerContact}
                onChange={handleChange}
                className="p-2 border rounded"
              />
              <input
                type="date"
                name="dueDate"
                value={invoiceData.dueDate}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <input
                type="number"
                name="totalAmount"
                placeholder="Total Amount"
                value={invoiceData.totalAmount}
                onChange={handleChange}
                className="p-2 border rounded"
                required
              />
              <select
                name="status"
                value={invoiceData.status}
                onChange={handleChange}
                className="p-2 border rounded"
              >
             
                <option value="To review">To review</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 mt-4 rounded"
            >
              Update Invoice
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdateInvoice;
