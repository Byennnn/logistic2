import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinishedProductTransfer", // Reference the transfer model
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending", "Dispatched", "Delivered"],
      default: "Pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
const Delivery = mongoose.model("Delivery", DeliverySchema);

export default Delivery;
