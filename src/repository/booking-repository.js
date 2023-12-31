const {AppError,ValidationError } = require('../utils/errors/index');
const {Booking} = require('../models/index');
const {StatusCodes} = require('http-status-codes');
class BookingRepository{
    
    async create(data){
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue creating the booking please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async update(bookingId, data){
        try {
            await Booking.update(data,{
                where:{
                    id:bookingId
                }
            });
            return true;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot create booking',
                'There was some issue updating the booking please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }

    async statusUpdate(bookingId,data){
        try {
            const BookingObject = await Booking.findByPk(bookingId);
            BookingObject.status = data.status;
            await BookingObject.save();
            return BookingObject;
            
        } catch (error) {
            console.log("Something went wrong in the repository layer");
            throw error;
        }
    }
}
module.exports = BookingRepository;