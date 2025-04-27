import mongoose from "mongoose";

const FinishedProductTransferSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number },
    transferDate: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "In Transit", "Received", "Delivered", "Rejected"],
      default: "Pending",
    },
    receiverWarehouse: {
      type: String,
      enum: ["Logistic 2 Warehouse"],
      default: "Logistic 2 Warehouse",
    },
    receivedBy: {
      type: String,
      default: null,
    },
    shipmentDate: {
      type: Date,
      required: false,
    },
    shipmentDetails: {
      type: String,
      required: false,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    receivedDate: { type: Date, default: null },
    coreId: { type: String },

    // ✅ Invoice-related fields
    invoiceNumber: {
      type: String,
      default: null,
    },
    amount: {
      type: Number,
      default: null,
    },
    clientDetails: {
      type: String,
      default: null,
    },
    invoiceStatus: {
      type: String,
      enum: ["Request Successful", null],
      default: null,
    },
  },
  { timestamps: true }
);

// Auto-set receivedDate when status changes to "Received"
FinishedProductTransferSchema.pre("save", function (next) {
  if (this.isModified("status")) {
    if (this.status === "Received") {
      this.receivedDate = new Date();
    }
    if (this.status !== "Rejected") {
      this.rejectionReason = null;
    }
  }
  next();
});

const FinishedProductTransfer = mongoose.model(
  "FinishedProductTransfer",
  FinishedProductTransferSchema
);

export default FinishedProductTransfer;
