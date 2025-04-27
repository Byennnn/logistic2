import express from "express";
import Warehouse from "../models/Warehouse.js";

const router = express.Router();

// ✅ Fetch all warehouses
router.get("/", async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching warehouses" });
  }
});

// ✅ Add or Update Inventory in Warehouse
router.post("/", async (req, res) => {
  try {
    console.log("Received Inventory Data:", req.body); // Debug log

    const {
      productId,
      productName,
      category,
      warehouseLocation,
      totalStock,
      reservedStock,
      availableStock,
      unit,
      batchNumbers,
      expiryDates,
      lastSupplierId,
      lastSupplierName,
      lastReceivedDate,
      lastUpdatedBy,
    } = req.body;

    if (!productId || !productName || !warehouseLocation || !totalStock) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find or create warehouse
    let warehouse = await Warehouse.findOne({ location: warehouseLocation });

    if (!warehouse) {
      console.log("Creating new warehouse for location:", warehouseLocation);
      warehouse = new Warehouse({
        name: `Warehouse - ${warehouseLocation}`,
        location: warehouseLocation,
        productId,
        productName,
        category,
        totalStock,
        reservedStock,
        availableStock,
        unit,
        batchNumbers,
        expiryDates,
        lastSupplierId,
        lastSupplierName,
        lastReceivedDate,
        lastUpdatedBy,
      });
    } else {
      console.log("Updating existing warehouse inventory:", productId);
      warehouse.productId = productId;
      warehouse.productName = productName;
      warehouse.category = category;
      warehouse.totalStock = totalStock;
      warehouse.reservedStock = reservedStock;
      warehouse.availableStock = availableStock;
      warehouse.unit = unit;
      warehouse.batchNumbers = batchNumbers;
      warehouse.expiryDates = expiryDates;
      warehouse.lastSupplierId = lastSupplierId;
      warehouse.lastSupplierName = lastSupplierName;
      warehouse.lastReceivedDate = lastReceivedDate;
      warehouse.lastUpdatedBy = lastUpdatedBy;
    }

    await warehouse.save();
    res.status(201).json({ message: "Inventory added successfully", warehouse });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Update warehouse inventory
router.put("/:id", async (req, res) => {
  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedWarehouse);
  } catch (error) {
    res.status(400).json({ message: "Error updating warehouse" });
  }
});

// ✅ Delete a warehouse
router.delete("/:id", async (req, res) => {
  try {
    await Warehouse.findByIdAndDelete(req.params.id);
    res.json({ message: "Warehouse deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting warehouse" });
  }
});

export default router;
