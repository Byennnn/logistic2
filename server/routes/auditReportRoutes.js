import express from 'express';
import { createAuditReport, getAuditReports } from "../controllers/auditReportController.js";

const router = express.Router();

// POST route for creating a new audit report
router.post('/api/auditreports', createAuditReport);

// GET route for retrieving all audit reports
router.get('/api/auditreports', getAuditReports);

export default router;
