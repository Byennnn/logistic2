import React, { useState } from "react";
import jjm2 from "./Assets/jjm2.png";
import { MdOutlineScreenshotMonitor } from "react-icons/md";
import { MdOutlineInventory, MdEmojiTransportation, MdHome } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";
import { BsFillBasket2Fill } from "react-icons/bs";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoFileTrayOutline, IoChatboxOutline, IoDocumentTextOutline } from "react-icons/io5";
import { RiFilePaper2Line } from "react-icons/ri";
import { FiBox } from "react-icons/fi";
import { FaWpforms } from "react-icons/fa";
import { Link } from "react-router-dom"
import { Menu } from "antd";
import {HomeOutlined, AppstoreOutlined, SettingOutlined} from '@ant-design/icons';
import { AiOutlineStock } from "react-icons/ai";
import { MdWarehouse } from "react-icons/md";
import { GrFormSchedule } from "react-icons/gr";
import { FaFileInvoice } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { TbTruckReturn } from "react-icons/tb";
import { FaShoppingCart } from "react-icons/fa";
import { AiOutlineAudit } from "react-icons/ai";
import { FaBoxOpen } from "react-icons/fa6";
import { MdInventory2 } from "react-icons/md";
import { CiDeliveryTruck } from "react-icons/ci";





const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div
      className={`flex flex-col h-screen bg-white text-black px-4 py-4 border-r-2 sticky top-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-72 lg:w-80'
      }`}
      aria-label="Sidebar"
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="mb-4 p-1 text-black border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200"
        aria-expanded={!isCollapsed}
        aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {isCollapsed ? '▶' : '◀'}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer mb-8 justify-center" aria-label="Dashboard Logo">
        <img src={jjm2} alt="Dashboard logo" className="w-10 h-10" />
        {!isCollapsed && <p className="text-xl font-bold">JJM Soap & Detergent Manufacturing</p>}
      </div>

      {/* Dashboard */}
      
      
       {/* Warehouse System */}
       <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <MdDashboard className="w-5 h-5" />
        {!isCollapsed && <p><a href="/MainUser">Dashboard</a></p>}
      </div>
      {/* Warehouse System */}
     
      {/* Inventory System*/}
      
      {/* Inventory System*/}
      
      
      
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <FaShoppingCart className="w-5 h-5" />
        {!isCollapsed && <p><a href="/FinishedProductTransfers">Warehouse System</a></p>}
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <MdInventory2  className="w-5 h-5" />
        {!isCollapsed && <p><a href="/InventoryRecords">Inventory System</a></p>}
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <FaFileInvoice className="w-5 h-5" />
        {!isCollapsed && <p><a href="/InvoiceList">Invoice</a></p>}
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <GrFormSchedule className="w-5 h-5" />
        {!isCollapsed && <p><a href="/ShipmentScheduling">Shipment Scheduling</a></p>}
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <MdEmojiTransportation className="w-5 h-5" />
        {!isCollapsed && <p><a href="/Tracking">Delivery System</a></p>}
        
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <CiDeliveryTruck  className="w-5 h-5" />
        {!isCollapsed && <p><a href="/DeliveredItems">Dispatched products</a></p>}
        
      </div>
      <div
        className="flex gap-2 items-center text-sm cursor-pointer mb-2 hover:text-blue-500 transition"
        aria-label="File Manager" 
      >
        <TbTruckReturn className="w-5 h-5" />
        {!isCollapsed && <p><a href="/Returnedproduct">Returned Product</a></p>}
        
      </div>
        
      
      
     
      
      
         
      
    </div>
    
  );
};

export default Sidebar;
