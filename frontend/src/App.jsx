import React from "react";
import Sidebar from "./Components/Sidebar";
import Search from "./Components/Search";
import Dashboard from "./Components/Dashboard";
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Users from './Users';
import CreateUser from './CreateUser';
import UpdateUser from './UpdateUser';
import Viewshipment from './viewshipment';
import Viewtracking from './viewtracking';
import WarehouseUser from './WarehouseUser';
import InventoryUser from './InventoryUser';
import TransportationUser from './TransportationUser';
import RegisterUser from './RegisterUser';
import MainUser from './MainUser'
import ReceivingWarehouse from './ReceivingWarehouse';
import ProcessWarehouse from './ProcessWarehouse';
import StockWarehouse from './StockWarehouse';
import OutWarehouse from './OutWarehouse';
import DeliveredItems from './DeliveredItems';
import QualityControl from './QualityControl';
import ShipmentScheduling from './ShipmentScheduling';
import TrackingSystem from './TrackDelivery';
import UnsolvedProduct from './Unsolved';
import AddInventory from './AddInventory';
import AddInventoryRecord from './AddInventoryRecord';
import UpdateInventoryRecord from './UpdateInventoryRecord';
import UpdateInvoice from './UpdateInvoice';
import InventoryRecords from './InventoryRecords';
import AddDelivery from './AddDelivery';
import TrackDelivery from './TrackDelivery';
import Delivery from './Delivery';
import FinishedProductTransfers from './FinishedProductTransfers';
import AddFinishedProductTransfer from './AddFinishedProductTransfer';
import InvoiceList from './InvoiceList';
import Returnedproduct from './Returnedproduct';
import AuditReportForm from "./AuditReport";
import AddReport from "./AddReport";
import PartialApproval from "./PartialApproval"

const App = () => {
  return (
    <div>
      <BrowserRouter>
        
        <Routes>
          <Route path='/' element={<Users />}></Route>
          <Route path='/create' element={<CreateUser />}></Route>
          <Route path='/update/:id' element={<UpdateUser />}></Route>
          <Route path='/viewship/:id' element={<Viewshipment />}></Route>
          <Route path='/viewtrack/:id' element={<Viewtracking />}></Route>
          <Route path='/AuditReportForm' element={<AuditReportForm />}></Route>
          <Route path='/AddReport' element={<AddReport />}></Route>
          <Route path='/Warehouse' element={<WarehouseUser />}></Route>
          <Route path='/Inventory' element={<InventoryUser />}></Route>
          <Route path='/AddInventory' element={<AddInventory />}></Route>
          <Route path='/PartialApproval' element={<PartialApproval />}></Route>
          <Route path='/AddInventoryRecord' element={<AddInventoryRecord />}></Route>
          <Route path="/UpdateInventoryRecord/:recordId" element={<UpdateInventoryRecord />} />
          <Route path="/UpdateInvoice/:id" element={<UpdateInvoice/>} />
          <Route path='/InventoryRecords' element={<InventoryRecords />}></Route>
          <Route path='/AddDelivery' element={<AddDelivery />}></Route>
          <Route path='/FinishedProductTransfers' element={<FinishedProductTransfers />}></Route>
          <Route path='/Returnedproduct' element={<Returnedproduct />}></Route>
          <Route path='/AddFinishedProductTransfer' element={<AddFinishedProductTransfer />}></Route>
          <Route path='/Delivery' element={<Delivery />}></Route>
          <Route path='/TrackDelivery' element={<TrackDelivery />}></Route>
          <Route path='/Transportation' element={<TransportationUser />}></Route>
          <Route path='/Registration' element={<RegisterUser />}></Route>
          <Route path='/Users' element={<Users />}></Route>
          <Route path='/MainUser' element={<MainUser />}></Route>
          <Route path='/Receiving' element={<ReceivingWarehouse />}></Route>
          <Route path='/Process' element={<ProcessWarehouse />}></Route>
          <Route path='/Stock' element={<StockWarehouse />}></Route>
          <Route path='/Out' element={<OutWarehouse />}></Route>
          <Route path='/DeliveredItems' element={<DeliveredItems />}></Route>
          <Route path='/Quality' element={<QualityControl />}></Route>
          <Route path='/ShipmentScheduling' element={<ShipmentScheduling/>}></Route>
          <Route path='/Tracking' element={<TrackingSystem />}></Route>
          <Route path='/Unsolved' element={<UnsolvedProduct />}></Route>
          <Route path='/InvoiceList' element={<InvoiceList />}></Route>
         
        </Routes>
      </BrowserRouter>
   
    </div>
    
  );
};

export default App;
