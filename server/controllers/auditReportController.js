import AuditReport from '../models/AuditReport.js';

// Controller for creating a new audit report
export const createAuditReport = async (req, res) => {
  try {
    const { department, reportName, description, actions, auditDate, status } = req.body;

    // Create a new AuditReport document
    const newReport = new AuditReport({
      department,
      reportName,
      description,
      actions,
      auditDate,
      status
    });

    // Save the document to the database
    await newReport.save();

    res.status(201).json({ message: 'Audit Report created successfully', report: newReport });
  } catch (error) {
    res.status(500).json({ message: 'Error creating audit report', error: error.message });
  }
};

// Controller for retrieving all audit reports
export const getAuditReports = async (req, res) => {
  try {
    const reports = await AuditReport.find();
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving audit reports', error: error.message });
  }
};
