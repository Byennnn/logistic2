import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    purchaseOrderId: { type: String },
    orderNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    customerAddress: { type: String },
    customerContact: { type: String },
    dueDate: { type: Date },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "To review", "Closed"],
      default: "Pending",
    },
    items: [
      {
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        date: { type: Date },
        price: { type: Number, default: 0 },
      },
    ],
    details: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("InvoiceRecord", InvoiceSchema);
