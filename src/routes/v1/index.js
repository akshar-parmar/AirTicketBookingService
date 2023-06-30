const express = require('express');
const router = express.Router();
const {BookingController} = require('../../controllers/index');
//router.get, router.post

router.post('/bookings', BookingController.create);
router.patch('/bookings/:id' , BookingController.statusUpdate);
module.exports = router;