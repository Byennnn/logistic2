// Backend: FinishedProductTransfer Controller
import FinishedProductTransfer from "../models/FinishedProductTransfer.js";
import Delivery from "../models/Delivery.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import axios from "axios"


// ✅ Get all Finished Product Transfers
export const getAllTransfers = async (req, res) => {
  try {
    const transfers = await FinishedProductTransfer.find();
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transfers", error });
  }
};

// ✅ Get Approved Transfers
export const getApprovedTransfers = async (req, res) => {
  try {
    const transfers = await FinishedProductTransfer.find({ status: "Approved" });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved transfers", error });
  }
};

// ✅ Approve a Transfer and Create a Delivery
export const approveFinishedProductTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await FinishedProductTransfer.findById(id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    transfer.status = "Approved";
    await transfer.save();

    const newDelivery = new Delivery({
      transferId: transfer._id,
      deliveryStatus: "Pending",
    });

    await newDelivery.save();
    res.json({ message: "Transfer approved and delivery created", transfer, newDelivery });
  } catch (error) {
    res.status(500).json({ message: "Error approving transfer", error });
  }
};

// ✅ Update Transfer Status
export const updateTransferStatus = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const updatedInvoice = await InvoiceRecord.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    if (!updatedInvoice) return res.status(404).json({ message: "Invoice not found" });

    const generateServiceToken = () => {
        const payload = { service: 'Logistic 2' };
        return jwt.sign(payload, process.env.GATEWAY_JWT_SECRET, { expiresIn: '10m' });
    };

    console.log(updatedInvoice)
    const token = generateServiceToken()
    const sendData = {
        productId: updatedInvoice.productId,
        status: updatedInvoice.status,
        rejectionReason: updatedInvoice.rejectionReason,
    }
    console.log(sendData)
    const result = await axios.post('https://gateway.jjm-manufacturing.com/core2/update-status-fp', sendData , {
        headers: { Authorization: `Bearer ${token}`}
    })
    console.log(result.data)

    
    res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
} catch (error) {
    console.error(error.message)
    res.status(500).json({ message: "Error updating invoice", error: error.message });
}
};


// ✅ Dispatch a Delivery
export const dispatchDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id);

    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    if (delivery.deliveryStatus !== "Pending") {
      return res.status(400).json({ message: "Delivery already dispatched" });
    }

    delivery.deliveryStatus = "Dispatched";
    await delivery.save();
    res.json({ message: "Delivery dispatched successfully", delivery });
  } catch (error) {
    res.status(500).json({ message: "Error dispatching delivery", error });
  }
};

export const scheduleShipment = async (req, res) => {
  const { id } = req.params;
  const { shipmentDate, shipmentDetails, invoiceNumber, amount, clientDetails } = req.body;

  try {
    const transfer = await FinishedProductTransfer.findByIdAndUpdate(
      id,
      { shipmentDate, shipmentDetails, invoiceNumber, amount, clientDetails },
      { new: true }
    );

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found." });
    }

    res.status(200).json({ message: "Shipment scheduled successfully", transfer });
  } catch (err) {
    console.error("🚨 Error in scheduleShipment:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { invoiceStatus } = req.body;
    const updated = await FinishedProductTransfer.findByIdAndUpdate(
      req.params.id,
      { invoiceStatus },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Transfer not found" });
    res.json({ message: "Invoice status updated", updated });
  } catch (err) {
    res.status(500).json({ message: "Error updating invoice status", error: err.message });
  }
};

export const getFinishedProductTransfers = async (req, res) => {
  try {
    const transfers = await FinishedProductTransfer.find();
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: `❌ Error fetching transfers: ${error.message}` });
  }
};

export const updateTransferData = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // Make sure that the status is not updated if it is part of the request body
  delete updateData.status; // Prevent status from being updated

  try {
    const transfer = await FinishedProductTransfer.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Make sure the data passes validation
    });

    if (!transfer) {
      return res.status(404).json({ message: '❌ Transfer not found.' });
    }

    res.status(200).json(transfer);
  } catch (error) {
    res.status(500).json({ message: `❌ Failed to update data: ${error.message}` });
  }
};

export const createTransfer = async (req, res) => {
  const { productName, quantity, invoiceNumber, clientDetails, amount, status } = req.body;

  try {
    const newTransfer = new FinishedProductTransfer({
      productName,
      quantity,
      invoiceNumber,
      clientDetails,
      amount,
      status: status || 'Pending', // Default to "Pending" if status is not provided
    });

    await newTransfer.save();
    res.status(201).json(newTransfer);
  } catch (error) {
    res.status(500).json({ message: `❌ Error creating transfer: ${error.message}` });
  }
};

const updateInvoiceDetails = async (req, res) => {
  const { id } = req.params;
  const { clientDetails, invoiceNumber, amount } = req.body;

  if (!clientDetails || !invoiceNumber || !amount) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const transfer = await FinishedProductTransfer.findById(id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found.' });
    }

    // Update the invoice details on the transfer
    transfer.clientDetails = clientDetails;
    transfer.invoiceNumber = invoiceNumber;
    transfer.amount = amount;
    transfer.invoiceStatus = 'Request Successful'; // Assuming when an invoice is updated, it's successful

    await transfer.save();

    return res.status(200).json(transfer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating invoice details.' });
  }
};
