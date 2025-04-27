import mongoose from "mongoose";

const WarehouseSchema = new mongoose.Schema({
  productId: { type: String },
  productName: { type: String, required: true },
  category: { type: String },
  totalStock: { type: Number, required: true },
  reservedStock: { type: Number, default: 0 },
  availableStock: { type: Number},
  unit: { type: String },
  batchNumbers: { type: [String] },
  expiryDates: { type: [Date] },
  lastSupplierId: { type: String },
  lastSupplierName: { type: String },
  lastReceivedDate: { type: Date },
  lastUpdatedBy: { type: String },
});


const Warehouse = mongoose.model("Warehouse", WarehouseSchema);
export default Warehouse;
