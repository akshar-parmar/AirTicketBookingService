const express = require('express');
const app = express();
const {PORT,FLIGHT_SERVICE_PATH} = require('./config/serverConfig');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/index');
const db = require('./models/index');
const axios = require('axios');
const {AUTH_SERVICE_PATH} = require('./config/serverConfig');


const prepareSetUpServer = async()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',apiRoutes);
    app.listen(PORT,async()=>{

    // const userId = 12;
    // const getUserEmail = `${AUTH_SERVICE_PATH}/api/v1/user/${userId}`
    // const userPayload = await axios.get(getUserEmail);
    // console.log("USERDATA:::::::>",userPayload.data.data.email);
    
    console.log(`Booking server started at:${PORT}`);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
        

    });
}
prepareSetUpServer();