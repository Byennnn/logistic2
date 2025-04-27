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
      if (t.status !== "Received") return;

      if (!groupedMap[key]) {
        groupedMap[key] = {
          ...t,
          amount: parseFloat(t.amount) || 0,
          shipmentDate: t.shipmentDate,
        };
      } else {
        groupedMap[key].amount += parseFloat(t.amount) || 0;

        if (new Date(t.shipmentDate) > new Date(groupedMap[key].shipmentDate)) {
          groupedMap[key] = {
            ...groupedMap[key],
            ...t,
            amount: groupedMap[key].amount, // Keep total quantity
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

  const filterResults = () => {
    setFilteredTransfers(
      !searchTerm.trim()
        ? transfers
        : transfers.filter((transfer) =>
            transfer.productName.toLowerCase().includes(searchTerm.toLowerCase())
          )
    );
  };

  const sortTransfers = (transfers) => {
    return transfers.sort((a, b) => new Date(b.shipmentDate) - new Date(a.shipmentDate));
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
          <h1 className="text-3xl font-bold mb-4">Delivery System</h1>
          {message && (
            <p className={`mb-4 ${message.includes("❌") ? "text-red-600" : "text-green-600"}`}>
              {message}
            </p>
          )}

          {loading ? (
            <p>Loading transfers...</p>
          ) : filteredTransfers.length === 0 ? (
            <p>No received or delivered transfers found.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Shipment Date</th>
                  <th className="p-3">Client Details</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransfers.map((transfer) => (
                  <tr key={transfer._id} className="border-t">
                    <td className="p-3">{transfer.productName || "No Product Name"}</td>
                    <td className="p-3">{transfer.amount}</td>
                    <td className="p-3">
                      {transfer.shipmentDate
                        ? new Date(transfer.shipmentDate).toLocaleDateString()
                        : "No Date"}
                    </td>
                    <td className="p-3">{transfer.shipmentDetails || "—"}</td>
                    <td className="p-3">{transfer.status}</td>
                    <td className="p-3 flex flex-col gap-2">
                      {transfer.status === "Received" && (
                        <>
                          <button
                            onClick={() => updateStatus(transfer._id, "In Transit")}
                            className="bg-yellow-500 text-white px-3 py-1 rounded"
                            disabled={updating === transfer._id}
                          >
                            {updating === transfer._id ? "Updating..." : "Mark to Deliver"}
                          </button>
                          <button
                            onClick={() => setShowReasonInput(transfer._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                          {showReasonInput === transfer._id && (
                            <div className="mt-2">
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
