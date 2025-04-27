import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext"; // Assuming UserContext contains the API URL
import Sidebar from "./Components/Sidebar"; // Assuming Sidebar is a component
import Search from "./Components/Search"; // Assuming Search is a component
import { useNavigate } from "react-router-dom"; // Import useNavigate from React Router

const AuditReportForm = () => {
  const { apiURL } = useContext(UserContext); // Fetch the API URL from context
  const [auditReports, setAuditReports] = useState([]); // Store audit reports
  const [filteredReports, setFilteredReports] = useState([]); // Store filtered reports
  const [loading, setLoading] = useState(true); // Handle loading state
  const [message, setMessage] = useState(""); // Display messages (success or error)
  const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering reports

  const navigate = useNavigate(); // Use navigate to programmatically navigate

  useEffect(() => {
    fetchAuditReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [searchTerm, auditReports]);

  // Fetch the audit reports from the backend
  const fetchAuditReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/api/auditreports`);
      setAuditReports(response.data);
    } catch (error) {
      console.error("Error fetching audit reports:", error);
      setMessage("❌ Error fetching audit reports.");
    } finally {
      setLoading(false);
    }
  };

  // Filter reports based on search term
  const filterReports = () => {
    setFilteredReports(
      !searchTerm.trim()
        ? auditReports
        : auditReports.filter((report) =>
            report.reportName.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search
          placeholder="Search by Report Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-4">📑 Audit Report List</h1>
          {message && <p className={`mb-4 ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>{message}</p>}

         

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Audit Reports</h2>
            {loading ? (
              <p>Loading reports...</p>
            ) : filteredReports.length === 0 ? (
              <p>No matching reports found.</p>
            ) : (
              <table className="w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3">Department</th>
                    <th className="p-3">Report Name</th>
                    <th className="p-3">Actions</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report) => (
                    <tr key={report._id} className="border-t">
                      <td className="p-3">{report.department}</td>
                      <td className="p-3">{report.reportName}</td>
                      <td className="p-3">{report.actions.join(", ")}</td>
                      <td className="p-3">{report.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReportForm;
