import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const Deliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // New state for status filtering

  useEffect(() => {
    fetchDeliveries();
  }, []);

  useEffect(() => {
    filterResults();
  }, [searchTerm, filterStatus, deliveries]);

  const fetchDeliveries = async () => {
    try {
      const res = await axios.get("/api/deliveries");
      setDeliveries(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch deliveries:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/deliveries/${id}`, { deliveryStatus: newStatus });
      setDeliveries(deliveries.map(d => (d._id === id ? { ...d, deliveryStatus: newStatus } : d)));
      setMessage("✅ Delivery status updated successfully!");
    } catch (error) {
      setMessage("❌ Failed to update delivery status.");
    }
  };

  // Function to filter deliveries based on search term and status
  const filterResults = () => {
    let filtered = deliveries;
    
    if (searchTerm) {
      filtered = filtered.filter(delivery =>
        delivery.transferId?.productName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus) {
      filtered = filtered.filter(delivery => delivery.deliveryStatus === filterStatus);
    }
    
    setFilteredDeliveries(filtered);
  };

  const updateProductStatus = async (id, newStatus, rejectionReason = "") => {
  setUpdatingId(id);
  try {
    await axios.put(`${apiURL}/api/deliveries/${id}/status`, {
      status: newStatus,
      rejectionReason: newStatus === "Rejected" ? rejectionReason : undefined,
    });

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === id
          ? { ...product, status: newStatus, rejectionReason }
          : product
      )
    );
  } catch (error) {
    console.error("❌ Error updating product status:", error);
    alert("❌ Failed to update status.");
  } finally {
    setUpdatingId(null);
  }
};

const handleReject = async (id) => {
  const reason = prompt("Enter reason for rejection:");
  if (reason && reason.trim() !== "") {
    await updateProductStatus(id, "Rejected", reason.trim());
  } else {
    alert("❗ Rejection reason is required.");
  }
};

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-col w-full">
        <Search placeholder="Search by Product Name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold">🚚 Deliveries</h1>
          <br />

          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Search by Product Name"
              className="px-4 py-0.5 border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="space-x-4">
              <button onClick={() => setFilterStatus("")} className="px-2 py-1 bg-gray-500 text-white hover:bg-gray-600">
                All
              </button>
              <button onClick={() => setFilterStatus("Pending")} className="px-2 py-1 bg-yellow-500 text-white hover:bg-yellow-600">
                Pending
              </button>
              <button onClick={() => setFilterStatus("Dispatched")} className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600">
                Dispatched
              </button>
              <button onClick={() => setFilterStatus("Delivered")} className="px-2 py-1 bg-green-500 text-white hover:bg-green-600">
                Delivered
              </button>
            </div>
          </div>
          <br />

          {loading ? (
            <p>Loading deliveries...</p>
          ) : filteredDeliveries.length === 0 ? (
            <p>No deliveries found.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Transfer Date</th>
                  <th className="p-3">Delivery Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDeliveries.map((delivery) => (
                  <tr key={delivery._id} className="border-t">
                    <td className="p-3">{delivery.transferId?.productName || "N/A"}</td>
                    <td className="p-3">{delivery.transferId?.quantity || "N/A"}</td>
                    <td className="p-3">
                      {delivery.transferId?.transferDate
                        ? new Date(delivery.transferId.transferDate).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-3">{delivery.deliveryStatus}</td>
                    <td className="p-3">
                      {user?.role === "admin" && (
                        <>
                          {delivery.deliveryStatus === "Pending" && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery._id, "Dispatched")}
                              className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                            >
                              Mark Dispatched
                            </button>
                          )}
                          {delivery.deliveryStatus === "Dispatched" && (
                            <button
                              onClick={() => updateDeliveryStatus(delivery._id, "Delivered")}
                              className="bg-green-500 text-white px-3 py-1 rounded"
                            >
                              Mark Delivered
                            </button>
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

export default Deliveries;
