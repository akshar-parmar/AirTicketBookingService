const {REMINDER_BINDING_KEY} = require('../config/serverConfig');
const {createChannel,publishMessage} = require('../utils/messageQueue');
const axios = require('axios');
const {AUTH_SERVICE_PATH} = require('../config/serverConfig');

const sendMessageToQueue = async(bookingPayload)=>{
    try {
        const channel = await createChannel();
        const userId  = bookingPayload.dataValues.userId;

        //now we need to get user Email becoz to generate a ticket recepientEmail is required
        const getUserEmail = `${AUTH_SERVICE_PATH}/api/v1/user/${userId}`
        const userData = await axios.get(getUserEmail);
        const userEmail = userData.data.data.email;

        const payload = {
            data :{
                subject : 'Congratulations! Your booking is Succesful',
                content : 'sample body',
                recepientEmail : userEmail,
                notificationTime : '2023-07-12 12:30:00'
            },
            service : 'Create_Notification_ticket'
        }
        const response = await publishMessage(channel,REMINDER_BINDING_KEY,JSON.stringify(payload));
        return response;
    } catch (error) {
        console.log("error happen at ticket-helper");
    }

}
module.exports = sendMessageToQueue;