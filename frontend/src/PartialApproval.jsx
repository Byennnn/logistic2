import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./config/UserContext";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";

const Deliveries = () => {
  const { apiURL } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchPendingDeliveries();
  }, []);

  const fetchPendingDeliveries = async () => {
    try {
      const res = await axios.get(`${apiURL}/api/deliveries`);
      // Fetch products with relevant statuses: "Received", "Partial Acceptance", "Rejected"
      const filteredProducts = res.data.filter((product) => 
        product.status === "Partial Acceptance"
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("❌ Error fetching deliveries:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    } 
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
          <h1 className="text-3xl font-bold mb-4">Products Partially Rejected</h1>

          {loading ? (
            <p>Loading deliveries...</p>
          ) : products.length === 0 ? (
            <p>No products partially rejected.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Status</th>
                  {(products.some(product => product.status === "Rejected" || product.status === "Partial Acceptance")) && (
                    <>
                      <th className="p-3">Reason</th>
                      <th className="p-3">Rejected Quantity</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((product) =>
                    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((product) => (
                    <tr key={product._id} className="border-t">
                      <td className="p-3">{product.productName}</td>
                      <td className="p-3">{product.quantity}</td>
                      <td className="p-3">{product.status}</td>

                      {/* Conditionally render the Reason and Rejected Quantity columns only for Rejected or Partial Acceptance status */}
                      {product.status === "Partial Acceptance" ? (
                        <>
                          <td className="p-3">{product.rejectionReason || ""}</td>
                          <td className="p-3">
                            {product.rejectedQuantity 
                              ? `${product.rejectedQuantity} Product(s) Rejected`
                              : "All Rejected"}
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="p-3">N/A</td>
                          <td className="p-3">N/A</td>
                        </>
                      )}
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
