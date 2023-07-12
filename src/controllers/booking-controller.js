const {BookingService} = require('../services/index');
const {StatusCodes} = require('http-status-codes');
const bookingService  = new BookingService();
const {REMINDER_BINDING_KEY} = require('../config/serverConfig');
const {createChannel,publishMessage} = require('../utils/messageQueue');
class BookingController {

    // constructor(channel){
    //     this.channel = channel;
    // }

    async sendMessageToQueue(req,res){
        const channel = await createChannel();
        const payload = {
            data :{
                subject : 'Congratulations! You are selected for onboarding at Cognizant🎉',
                content : 'Dear Keyur, I am delighted to inform you that you have been selected for onboarding with Cognizant. On behalf of our team, I extend my warmest congratulations to you! After careful evaluation of your qualifications, skills, and performance during the interview process, we are impressed with your abilities and believe that you will be a valuable addition to our organization. Your dedication, expertise, and potential stood out among the candidates. We are excited to offer you the opportunity to join our team and contribute to the success of Cognizant. You will soon receive an official offer letter from our Human Resources department, which will provide comprehensive details about your employment, including compensation, benefits, and the onboarding schedule. Once again, congratulations on your selection! We are eager to welcome you to the Cognizant family and work together to achieve great milestones. If you have any questions or require any further information, please feel free to reach out to me or our HR department.',
                recepientEmail : 'keyur.np@somaiya.edu',
                notificationTime : '2023-07-12 12:30:00'
            },
            service : 'Send_Basic_mail'
        }
        const response = await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return res.status(200).json({
            data: response,
            message : 'Successfully published the message'
        });
    }

    async create(req,res){
        try {
            const response = await bookingService.createBooking(req.body);
            console.log("from booking controller try",response);
            return res.status(StatusCodes.OK).json({
                message : 'Successfully completed booking',
                success : true,
                err: {},
                data:response
            });
        } catch (error){
            console.log("from booking controller catch", error);
            return res.status(error.statusCodes).json({
                message : error.message,
                success: false,
                err : error.explanation,
                data : {}
            });
        }
    }
    async statusUpdate(req,res){
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

}




module.exports =  BookingController;