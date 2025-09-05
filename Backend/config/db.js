const mongoose = require("mongoose")

const connectDatabse = () => {
    mongoose.connect(process.env.DB_LOCAL_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then(con=>{
        console.log(`Mongodb is connected to the ${con.connection.host}`)
    })
}

module.exports = connectDatabse;