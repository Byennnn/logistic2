import express from 'express';
import ShipmentSchedule from '../models/ShipmentSchedule.js';
import FinishedProductTransfer from '../models/FinishedProductTransfer.js';

const router = express.Router();

router.post('/auto-schedule', async (req, res) => {
  try {
    const receivedProducts = await FinishedProductTransfer.find({ status: 'Received' });

    if (receivedProducts.length === 0) {
      return res.status(404).json({ message: 'No received products to schedule' });
    }

    const shipmentSchedules = receivedProducts.map((product) => ({
      transferId: product._id,
      shipmentDate: new Date(),
      shipmentDetails: `Auto-scheduled shipment for ${product.productName}`,
    }));

    await ShipmentSchedule.insertMany(shipmentSchedules);
    await FinishedProductTransfer.updateMany({ status: 'Received' }, { status: 'Scheduled' });

    res.status(200).json({ message: 'Shipments scheduled successfully', shipmentSchedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
