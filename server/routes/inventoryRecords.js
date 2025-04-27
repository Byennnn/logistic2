import express from "express";
import InventoryRecord from "../models/InventoryRecords.js";
import { serviceVerifyToken } from "../middleware/auth.js";

const router = express.Router();

// ✅ Fetch all inventory records
router.get("/", async (req, res) => {
  try {
    const records = await InventoryRecord.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory records" });
  }
});

// ✅ Fetch a single inventory record by ID
router.get("/:id",serviceVerifyToken,async (req, res) => {
  try {
    const record = await InventoryRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching the record" });
  }
});

// ✅ Create a new inventory record
router.post("/",serviceVerifyToken, async (req, res) => {
  try {
    console.log(req.body);
    
    const newRecord = new InventoryRecord(req.body);  
    await newRecord.save();
    res.status(201).json({ message: "Inventory record added successfully", newRecord });
  } catch (error) {
    res.status(500).json({ message: "Error adding inventory record", error: error.message });
  }
});

// ✅ Update an existing inventory record
router.put("/:id", async (req, res) => {
  try {
    const updatedRecord = await InventoryRecord.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRecord) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Inventory record updated", updatedRecord });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory record" });
  }
});

// ✅ Delete an inventory record
router.delete("/:id", async (req, res) => {
  try {
    const deletedRecord = await InventoryRecord.findByIdAndDelete(req.params.id);
    if (!deletedRecord) return res.status(404).json({ message: "Record not found" });
    res.json({ message: "Inventory record deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inventory record" });
  }
});

export default router;
