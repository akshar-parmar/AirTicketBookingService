const express = require('express');
const router = express.Router();
const BookingController = require('../../controllers/booking-controller');

// const {createChannel} = require('../../utils/messageQueue');
// const channel = await createChannel();

const bookingController = new BookingController();

router.post('/bookings', bookingController.create);
router.patch('/bookings/:id' , bookingController.statusUpdate);
router.post('/publish', bookingController.sendMessageToQueue);
module.exports = router; 