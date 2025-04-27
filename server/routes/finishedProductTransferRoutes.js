import express from "express";
import FinishedProductTransfer from "../models/FinishedProductTransfer.js";
import {
  getAllTransfers,
  getApprovedTransfers,
  approveFinishedProductTransfer,
  updateInvoiceStatus,
} from "../controllers/finishedProductTransferController.js";
import { serviceVerifyToken } from "../middleware/auth.js";

import {
  scheduleShipment,
  // other imports...
} from "../controllers/finishedProductTransferController.js";

import { getFinishedProductTransfers, updateTransferData, createTransfer, 

 } from "../controllers/finishedProductTransferController.js"; // Adjust the path

const router = express.Router();

router.get('/finishedproducttransfers', getFinishedProductTransfers);

// Route to update a finished product transfer by ID
router.put('/finishedproducttransfers/:id', updateTransferData);

// Route to create a new finished product transfer
router.post('/finishedproducttransfers', createTransfer);

router.put("/:id/invoice-status", updateInvoiceStatus);
router.put("/:id/schedule", scheduleShipment); // ✅ This line is important
router.put("/:id/schedule", async (req, res) => {
  const { shipmentDate, shipmentDetails } = req.body;

  try {
    const transfer = await FinishedProductTransfer.findById(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    transfer.shipmentDate = shipmentDate;
    transfer.shipmentDetails = shipmentDetails;

    await transfer.save();
    res.json({ message: "Shipment schedule updated successfully", transfer });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Get all finished product transfers
router.get("/", getAllTransfers);

// ✅ Get all approved transfers (ready for dispatch)
router.get("/approved-transfers", getApprovedTransfers);

// ✅ Approve a transfer and create a delivery
router.put("/approve/:id", approveFinishedProductTransfer);

router.put("/:id", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (
      !["Pending", "In Transit", "Received", "Delivered", "Rejected", "Dispatch"].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedTransfer = await FinishedProductTransfer.findByIdAndUpdate(
      req.params.id,
      { status, rejectionReason: status === "Rejected" ? rejectionReason : undefined },
      { new: true }
    );

    if (!updatedTransfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    res.json({ message: "Status updated successfully", transfer: updatedTransfer });
  } catch (error) {
    console.error("❌ Error updating transfer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// ✅ Get all finished product transfers
router.get("/", serviceVerifyToken,async (req, res) => {
    try {
        const transfers = await FinishedProductTransfer.find();
        res.json(transfers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transfers" });
    }
});


// ✅ Create a new transfer
router.post("/", async (req, res) => {
  try {
    const newTransfer = new FinishedProductTransfer(req.body);
    const savedTransfer = await newTransfer.save();
    res.status(201).json(savedTransfer);
  } catch (error) {
    res.status(400).json({ error: "Failed to create transfer" });
  }
});

// ✅ Update transfer status
router.put("/:id", async (req, res) => {
  try {
    const updatedTransfer = await FinishedProductTransfer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTransfer);
  } catch (error) {
    res.status(400).json({ error: "Failed to update transfer" });
  }
});

// ✅ Delete a transfer
router.delete("/:id", async (req, res) => {
  try {
    await FinishedProductTransfer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Transfer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transfer" });
  }
});

export default router;
