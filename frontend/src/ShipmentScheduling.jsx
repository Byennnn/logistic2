import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const FinishedProductTransfers = () => {
  const { apiURL } = useContext(UserContext);
  const [transfers, setTransfers] = useState([]);
  const [filteredTransfers, setFilteredTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(null);

  const [editingShipmentId, setEditingShipmentId] = useState(null);
  const [shipmentDate, setShipmentDate] = useState("");
  const [shipmentDetails, setShipmentDetails] = useState("");

  useEffect(() => {
    fetchTransfers();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, transfers]);

  const fetchTransfers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiURL}/api/finishedproducttransfers`);
      const grouped = groupTransfersByProductName(response.data);
      setTransfers(sortTransfers(grouped));
    } catch (error) {
      setMessage("❌ Error fetching transfers.");
    } finally {
      setLoading(false);
    }
  };

  const groupTransfersByProductName = (transfers) => {
    const groupedMap = {};

    transfers.forEach((t) => {
      const key = t.productName || "Unnamed Product";
      if (!groupedMap[key]) {
        groupedMap[key] = {
          ...t,
          quantity: parseFloat(t.quantity) || 0,
          transferDate: t.transferDate,
        };
      } else {
        groupedMap[key].quantity += parseFloat(t.quantity) || 0;

        // Keep latest transfer date
        if (new Date(t.transferDate) > new Date(groupedMap[key].transferDate)) {
          groupedMap[key] = {
            ...groupedMap[key],
            ...t,
            quantity: groupedMap[key].quantity, // retain the summed quantity
          };
        }
      }
    });

    return Object.values(groupedMap);
  };

  const updateStatus = async (id, newStatus) => {
    if (!id) {
      setMessage("❌ Error: Transfer ID is missing.");
      return;
    }

    if (newStatus === "Rejected" && !rejectionReason) {
      setMessage("❌ Please provide a rejection reason.");
      return;
    }

    setUpdating(id);
    try {
      await axios.put(`${apiURL}/api/finishedproducttransfers/${id}`, {
        status: newStatus,
        rejectionReason: newStatus === "Rejected" ? rejectionReason : undefined,
      });

      fetchTransfers();
      setMessage("✅ Status updated successfully!");
      setShowReasonInput(null);
      setRejectionReason("");
    } catch (error) {
      setMessage(`❌ Failed to update status. ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdating(null);
    }
  };

  const handleEditShipment = (transfer) => {
    setEditingShipmentId(transfer._id);
    setShipmentDate(transfer.shipmentDate ? transfer.shipmentDate.split("T")[0] : "");
    setShipmentDetails(transfer.shipmentDetails || "");
  };

  const handleUpdateShipment = async (id) => {
    if (!shipmentDate.trim()) {
      setMessage("❌ Shipment date and details are required.");
      return;
    }

    const selectedDate = new Date(shipmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time part

    if (selectedDate < today) {
      setMessage("❌ Shipment date cannot be in the past.");
      return;
    }

    try {
      const response = await axios.put(`${apiURL}/api/finishedproducttransfers/${id}/schedule`, {
        shipmentDate,
        shipmentDetails,
      });

      if (response.status === 200) {
        setMessage("✅ Shipment schedule updated successfully!");
        setEditingShipmentId(null);
        fetchTransfers();
      } else {
        setMessage("❌ Error updating shipment schedule.");
      }
    } catch (error) {
      setMessage(`❌ Failed to update shipment schedule. ${error.response?.data?.message || error.message}`);
    }
  };

  const shouldShowTransfer = (t) =>
    ["Received"].includes(t.status) || t.invoiceStatus === "Request Successful";

  const filterResults = () => {
    setFilteredTransfers(
      !searchTerm.trim()
        ? transfers.filter(shouldShowTransfer)
        : transfers
            .filter(shouldShowTransfer)
            .filter((t) =>
              t.productName.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );
  };

  const sortTransfers = (transfers) => {
    return transfers.sort((a, b) => {
      if (a.status === "Pending" && b.status !== "Pending") return -1;
      if (b.status === "Pending" && a.status !== "Pending") return 1;
      return new Date(b.transferDate) - new Date(a.transferDate);
    });
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search
          placeholder="Search by Product Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-4">Shipment Scheduling System</h1>
          {message && (
            <p className={`mb-4 ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}

          {loading ? (
            <p>Loading transfers...</p>
          ) : filteredTransfers.length === 0 ? (
            <p>No transfers found.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Transfer Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map((transfer) => (
                  <tr key={transfer._id} className="border-t">
                    <td className="p-3">{transfer.productName || "No Product Name"}</td>
                    <td className="p-3">{transfer.amount || "N/A"}</td>
                    <td className="p-3">
                      {transfer.transferDate ? new Date(transfer.transferDate).toLocaleDateString() : "No Date"}
                    </td>
                    <td className="p-3">{transfer.status}</td>
                    <td className="p-3 space-y-2">
                      {transfer.status === "Pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(transfer._id, "Received")}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                            disabled={updating === transfer._id}
                          >
                            {updating === transfer._id ? "Updating..." : "Approve"}
                          </button>
                          <button
                            onClick={() => setShowReasonInput(transfer._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                          {showReasonInput === transfer._id && (
                            <div>
                              <input
                                type="text"
                                placeholder="Enter rejection reason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="border p-2 w-full"
                              />
                              <button
                                onClick={() => updateStatus(transfer._id, "Rejected")}
                                className="bg-red-600 text-white px-3 py-1 mt-2 rounded"
                              >
                                Confirm Reject
                              </button>
                            </div>
                          )}
                        </>
                      )}

                      {transfer.status === "Received" && (
                        <>
                          {editingShipmentId === transfer._id ? (
                            <div className="space-y-2">
                              <input
                                type="date"
                                value={shipmentDate}
                                onChange={(e) => setShipmentDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]} // restrict past dates
                                className="border p-2 w-full"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleUpdateShipment(transfer._id)}
                                  className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingShipmentId(null)}
                                  className="bg-gray-500 text-white px-3 py-1 rounded"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditShipment(transfer)}
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Set Due Date
                            </button>
                          )}
                          {transfer.shipmentDate && (
                            <p>📅 {new Date(transfer.shipmentDate).toLocaleDateString()}</p>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinishedProductTransfers;
