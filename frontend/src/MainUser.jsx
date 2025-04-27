import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { apiURL } = useContext(UserContext);
  const [pendingDeliveries, setPendingDeliveries] = useState(0);
  const [overdueShipments, setOverdueShipments] = useState(0);
  const [pendingReceives, setPendingReceives] = useState(0);
  const [pendingToReview, setPendingToReview] = useState(0);
  const [closedInvoices, setClosedInvoices] = useState(0);
  const [pendingInvoices, setPendingInvoices] = useState(0);
  const [deliveryStats, setDeliveryStats] = useState({ delivered: 0, returned: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [deliveriesRes, transfersRes, invoicesRes] = await Promise.all([
        axios.get(`${apiURL}/api/deliveries`),
        axios.get(`${apiURL}/api/finishedproducttransfers`),
        axios.get(`${apiURL}/api/invoices`),
      ]);

      const deliveries = deliveriesRes.data;
      const transfers = transfersRes.data;
      const invoices = invoicesRes.data;
      const today = new Date();

      setPendingDeliveries(deliveries.filter((d) => d.deliveryStatus === "Pending").length);
      setOverdueShipments(
        deliveries.filter(
          (d) => d.shipmentDate && new Date(d.shipmentDate) < today && d.deliveryStatus !== "Dispatched"
        ).length
      );
      setPendingReceives(transfers.filter((t) => t.status !== "Pending").length);
      setPendingToReview(invoices.filter((inv) => inv.status === "To Review").length);
      setClosedInvoices(invoices.filter((inv) => inv.status === "Closed").length);
      setPendingInvoices(invoices.filter((inv) => inv.status === "Pending").length);

      // Count Delivered vs Returned/Rejected items
      const delivered = transfers.filter((t) => t.status === "Delivered").length;
      const returned = transfers.filter((t) => t.status === "Returned" || t.status === "Rejected").length;
      setDeliveryStats({ delivered, returned });
    } catch (err) {
      setError("Error fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const barData = {
    labels: ["Delivered", "Returned/Rejected"],
    datasets: [
      {
        label: "Delivery Status",
        data: [deliveryStats.delivered, deliveryStats.returned],
        backgroundColor: ["#10b981", "#ef4444"],
        borderColor: ["#ffffff", "#ffffff"],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Delivery Status Overview",
        font: {
          size: 18,
        },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mt-4 mb-6">📊 Logistic II Dashboard</h1>
        {error && <p className="text-red-600">❌ {error}</p>}
        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-6 mt-4">
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Pending Deliveries</h2>
                <p className="text-3xl font-bold text-yellow-500">{pendingDeliveries}</p>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Overdue Shipments</h2>
                <p className="text-3xl font-bold text-red-500">{overdueShipments}</p>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Pending to Receive</h2>
                <p className="text-3xl font-bold text-blue-500">{pendingReceives}</p>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Pending to Review</h2>
                <p className="text-3xl font-bold text-purple-500">{pendingToReview}</p>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Closed Invoices</h2>
                <p className="text-3xl font-bold text-green-500">{closedInvoices}</p>
              </div>
              <div className="bg-white p-6 shadow-md rounded-lg text-center">
                <h2 className="text-xl font-semibold">Pending Invoices</h2>
                <p className="text-3xl font-bold text-orange-500">{pendingInvoices}</p>
              </div>
            </div>

            {/* Graph Section */}
            <div className="bg-white mt-10 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-center">Delivery Performance (Monthly)</h2>
              <div className="flex justify-center">
                <div className="w-[500px]">
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
