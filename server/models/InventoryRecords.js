import mongoose from "mongoose";

const InventoryRecordSchema = new mongoose.Schema({
 invoiceId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  supplierId: { type: String, required: true },
  supplierName: { type: String, required: true },
  quantityReceived: { type: Number, required: true },
  unit: { type: String, required: true },
  batchNumber: { type: String, default: null },
  expiryDate: { type: Date, default: null },
  warehouseLocation: { type: String, required: true },
  inspector: { type: String },
  qcStatus: {
    type: String,
    enum: ["Pending", "Passed", "Failed"],
    default: "Pending",
  },
  receivedDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Pending Manual Review", "Updated in Inventory"],
    default: "Pending Manual Review",
  },
  remarks: { type: String },
  loggedBy: { type: String, required: true },
});

export default mongoose.model("InventoryRecord", InventoryRecordSchema);
