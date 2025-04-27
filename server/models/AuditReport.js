import mongoose from 'mongoose';

// Define the AuditReport schema
const AuditReportSchema = new mongoose.Schema(
  {
    department: { type: String, required: true },
    reportName: { type: String, required: true }, // Report name
    description: { type: String, required: true },
    actions: { type: [String], required: true }, // Array of strings for audit actions
    auditDate: { type: Date, required: true }, // The date of the audit
    status: { type: String, required: true, enum: ['Pending', 'Completed', 'Reviewed'] }, // The status of the audit report
  },
  { timestamps: true }
);

// Create the model based on the schema
const AuditReport = mongoose.model('AuditReport', AuditReportSchema);

// Export the model
export default AuditReport;
