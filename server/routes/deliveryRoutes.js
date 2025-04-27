import express from "express";
import Delivery from "../models/Delivery.js";
import FinishedProductTransfer from "../models/FinishedProductTransfer.js";
import { updateFinishedProductStatus, getPendingDeliveries } from "../controllers/deliveryController.js";
//import { updateDeliveryStatus, getDeliveries } from "../controllers/deliveryController.js";




const router = express.Router();

// Get all deliveries that are "Received" or "In Transit"
router.get("/", getPendingDeliveries);

// Update product delivery status
router.put("/:id/status", updateFinishedProductStatus);


// Create a new delivery linked to a transfer
router.post("/", async (req, res) => {
  const { transferId, deliveryPerson, recipientWarehouse, deliveryNotes } = req.body;

  try {
    // Check if transfer exists
    const transfer = await FinishedProductTransfer.findById(transferId);
    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    const newDelivery = new Delivery({
      transferId,
      deliveryPerson,
      recipientWarehouse,
      deliveryNotes,
    });

    await newDelivery.save();
    res.status(201).json(newDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error creating delivery" });
  }
});

// Update delivery status
router.put("/:id", async (req, res) => {
  const { deliveryStatus } = req.body;

  try {
    const updatedDelivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { deliveryStatus },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(updatedDelivery);
  } catch (error) {
    res.status(500).json({ message: "Error updating delivery status" });
  }
});

export default router;
