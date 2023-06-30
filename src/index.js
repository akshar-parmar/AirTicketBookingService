const express = require('express');
const app = express();
const {PORT,FLIGHT_SERVICE_PATH} = require('./config/serverConfig');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/index');
const db = require('./models/index');



const prepareSetUpServer = async()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use('/api',apiRoutes);
    app.listen(PORT,async()=>{
        console.log(`server started at:${PORT}`);
        if(process.env.DB_SYNC){
            db.sequelize.sync({alter:true});
        }
        

    });
}
prepareSetUpServer();