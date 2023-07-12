const axios = require('axios');
const {BookingRepository} = require('../repository/index');
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig');
const {ServiceError} = require('../utils/errors/index');
const {StatusCodes} = require('http-status-codes');

const sendMessageToQueue = require('../utils/ticket-helper');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data){
        try {
            const flightId = data.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                 throw new ServiceError(
                    'Something went wrong in the booking process',
                    'Insufficient seats in the flight',
                    StatusCodes.CONFLICT
                 )
            };
            const totalCost =  priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data,totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            
            console.log('BOOKING',booking);

            //once the booking is done we need to send the info to reminder service
            //we will be sending it to rabbitmq and then reminder service will take if from them
            const mailSend = await sendMessageToQueue(booking);
            
            const updateFlightRequestURL= `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            //console.log(updateFlightRequestURL);
            await axios.patch(updateFlightRequestURL,{totalSeats:flightData.totalSeats-booking.noOfSeats});
            //now that we have updated the totalseats of flight

            //we want to update the booking status to 'booked'
            const BookingStatusUpdate = await this.bookingRepository.statusUpdate(booking.id, {status:"Booked"});
            return BookingStatusUpdate;
        } catch(error) {
            if(error.name=='RepositoryError' || error.name =='ValidationError'){
                throw error;
            }
            throw new ServiceError();
        }

    }

    async statusUpdate(bookingId, data){
        const bookingObject = await this.bookingRepository.statusUpdate(bookingId,data);
        return bookingObject;
    }
}

module.exports = BookingService;