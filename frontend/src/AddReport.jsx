import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './config/UserContext'; // Assuming UserContext contains the API URL
import Sidebar from './Components/Sidebar'; // Assuming Sidebar is a component
import Search from './Components/Search'; // Assuming Search is a component
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const AddReport = () => {
  const { apiURL } = useContext(UserContext); // Fetch the API URL from context
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const [department, setDepartment] = useState('');
  const [reportName, setReportName] = useState('');
  const [description, setDescription] = useState('');
  const [actions, setActions] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [status, setStatus] = useState('Pending');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const actionsArray = actions.split(',').map((action) => action.trim());
    const newAuditReport = {
      department,
      reportName,
      description,
      actions: actionsArray,
      auditDate,
      status,
    };

    setLoading(true);
    try {
      const response = await axios.post(`${apiURL}/api/auditreports`, newAuditReport);
      setMessage('✅ Audit Report created successfully!');
      // Redirect to the Audit Reports page after successful creation
      navigate('/AuditReportForm'); // Update the path based on your route configuration
    } catch (error) {
      setMessage('❌ Error creating audit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Component */}
      <Sidebar />

      <div className="flex-col w-full p-6">
        {/* Search Bar Component */}
        <Search placeholder="Search Audit Reports" />

        <div className="bg-white shadow-md rounded-lg p-6 mt-4">
          <h2 className="text-2xl font-bold mb-4">Create New Audit Report</h2>
          {message && (
            <p className={`mb-4 ${message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">Department:</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Report Name:</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Actions (comma separated):</label>
              <input
                type="text"
                value={actions}
                onChange={(e) => setActions(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Audit Date:</label>
              <input
                type="date"
                value={auditDate}
                onChange={(e) => setAuditDate(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div>
              <label className="block">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border p-2 w-full"
                required
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Reviewed">Reviewed</option>
              </select>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReport;
