const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    itemName: String,
    itemCode: String,
    quantity: Number,
    location: String,
    reorderLevel: Number,
    lastUpdated: { type: Date, default: Date.now },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
module.exports = Inventory;

import mongoose from "mongoose";


const WarehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  eachprice: { type: String, required: true }
});

const Warehouse = mongoose.model("Warehouse", WarehouseSchema);
export default Warehouse;