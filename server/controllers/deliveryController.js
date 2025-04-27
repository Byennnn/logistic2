import Delivery from "../models/Delivery.js";
import FinishedProductTransfer from "../models/FinishedProductTransfer.js";

import FinishedProduct from "../models/FinishedProductTransfer.js";



// Update product status (Received → In Transit → Delivered)
export const updateFinishedProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await FinishedProduct.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    let newStatus = "";
    if (product.status === "Received") newStatus = "Delivered";
    else return res.status(400).json({ message: "Product is already Delivered." });

    product.status = newStatus;
    await product.save();

    res.json({ message: `Product marked as ${newStatus}`, product });
  } catch (error) {
    console.error("Error updating product status:", error);
    res.status(500).json({ message: "Error updating product status", error });
  }
};

// Get all products that are "Received" or "In Transit"
export const getPendingDeliveries = async (req, res) => {
  try {
    const products = await FinishedProduct.find({ status: { $in: ["Received","Rejected", "Dispatch"] } });
    res.json(products);
  } catch (error) {
    console.error("Error fetching pending deliveries:", error);
    res.status(500).json({ message: "Error fetching deliveries", error });
  }
};
// ✅ Fetch a single delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate("transferId");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Error fetching delivery", error });
  }
};

// ✅ Approve a Finished Product Transfer and Create a Delivery
export const approveFinishedProductTransfer = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await FinishedProductTransfer.findById(id);

    if (!transfer) {
      return res.status(404).json({ message: "Transfer not found" });
    }

    // Update transfer status
    transfer.status = "Approved";
    await transfer.save();

    // Create a Delivery entry
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

// ✅ Dispatch a Delivery (Mark as Dispatched)
export const dispatchDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id).populate("transferId");

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.deliveryStatus !== "Pending") {
      return res.status(400).json({ message: "Delivery already dispatched" });
    }

    // Update delivery status
    delivery.deliveryStatus = "Dispatched";
    await delivery.save();

    res.json({ message: "Delivery dispatched successfully", delivery });
  } catch (error) {
    res.status(500).json({ message: "Error dispatching delivery", error });
  }
};

// ✅ Cancel a Delivery
export const cancelDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (delivery.deliveryStatus === "Dispatched") {
      return res.status(400).json({ message: "Cannot cancel a dispatched delivery" });
    }

    // Update delivery status
    delivery.deliveryStatus = "Cancelled";
    await delivery.save();

    res.json({ message: "Delivery cancelled successfully", delivery });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling delivery", error });
  }
};
