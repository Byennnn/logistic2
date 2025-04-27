import FinishedProductTransfer from "../models/FinishedProductTransfer.js";
import InvoiceRecord from "../models/InvoiceRecord.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios";

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const invoices = await InvoiceRecord.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoices", error: error.message });
  }
};

// Get invoice by ID
export const getInvoiceById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const invoice = await InvoiceRecord.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Error fetching invoice", error: error.message });
  }
};

// Create invoice
export const createInvoice = async (req, res) => {
  try {
    console.log("Received invoice request:", req.body); // Debug line

    const {
      purchaseOrderId,
      orderNumber,
      customerName,
      customerAddress,
      customerContact,
      dueDate,
      totalAmount,
      status = "Pending",
      items,
      details,
    } = req.body;

    const newInvoice = new InvoiceRecord({
      purchaseOrderId,
      orderNumber,
      customerName,
      customerAddress,
      customerContact,
      dueDate,
      totalAmount,
      status,
      items,
      details,
    });

    await newInvoice.save();
    res.status(201).json({ message: "Invoice created successfully", invoice: newInvoice });
  } catch (error) {
    console.error("Invoice creation error:", error); // Debug line
    res.status(500).json({ message: "Error creating invoice", error: error.message });
  }
};

// Update invoice
export const updateInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const updatedInvoice = await InvoiceRecord.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });

    const generateServiceToken = () => {
      const payload = { service: "Logistic 2" };
      return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: "10m" });
    };

    const token = generateServiceToken();
    const sendData = {
      purchaseOrderId: updatedInvoice.purchaseOrderId,
      status: updatedInvoice.status,
    };

    await axios.post(
      "https://gateway.jjm-manufacturing.com/finance/update-purchase-order",
      sendData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
  } catch (error) {
    res.status(500).json({ message: "Error updating invoice", error: error.message });
  }
};

// Delete invoice
export const deleteInvoice = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const deletedInvoice = await InvoiceRecord.findByIdAndDelete(req.params.id);
    if (!deletedInvoice) return res.status(404).json({ message: "Invoice not found" });

    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting invoice", error: error.message });
  }
};
