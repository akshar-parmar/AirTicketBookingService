const {BookingService} = require('../services/index');
const {StatusCodes} = require('http-status-codes');
const bookingService  = new BookingService();

const create = async(req,res)=>{
    try {
        const response = await bookingService.createBooking(req.body);
        console.log("from booking controller try",response);
        return res.status(StatusCodes.OK).json({
            message : 'Successfully completed booking',
            success : true,
            err: {},
            data:response
        });
    } catch (error) {
        console.log("from booking controller catch", error);
        return res.status(error.statusCodes).json({
            message : error.message,
            success: false,
            err : error.explanation,
            data : {}
        });
    }
}

const statusUpdate = async(req,res) =>{
    try {
        const response = await bookingService.statusUpdate(req.params.id, req.body);
    return res.status(200).json({
        data : response,
        success : true,
        message : "sucessfully updated the booking status",
        err :{}
    });
    } catch (error) {
        console.log("IN THE CATCH OF UPDATE BOOKING STATUS",error);
        return res.status(500).json({
            message : "not able updated the booking status",
            success: false,
            data : {}
        });
    }
    
}


module.exports = {
    create,
    statusUpdate
}