const app = require('./app');
const dotenv = require('dotenv');
const connectDatabse = require('./config/db');

dotenv.config({path:"config/config.env"});


connectDatabse();

const server = app.listen(process.env.PORT, ()=> {
    console.log(`Server is listening in ${process.env.PORT} in ${process.env.NODE_ENV}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandled rejection error");
    server.close(()=>{
        process.exit(1);
    })
})

process.on('uncaughtException', (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to uncaught exception error");
    server.close(()=>{
        process.exit(1);
    })
})